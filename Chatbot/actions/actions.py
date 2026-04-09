from typing import Any, Text, Dict, List
import re
import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

BASE_URL = "https://ev-bharat-backend-j5s4.onrender.com/api/stations"

# ── Intents that mean "select a station from the last list" ───────────────────
SELECTION_INTENTS = {"select_station_from_list"}

# ── Intents that mean "tell me more about the CURRENT station" ────────────────
FOLLOWUP_INTENTS = {
    "ask_charger_info", "ask_port_availability",
    "ask_amenities", "ask_rating",
    "ask_operator", "ask_verified", "ask_status",
}


def fmt_list(stations):
    lines = []
    for i, s in enumerate(stations[:5], 1):
        name     = s.get("name") or "Unknown Station"
        operator = s.get("operator") or ""
        addr     = s.get("address") or {}
        city     = addr.get("city") or addr.get("state") or ""
        rating   = s.get("averageRating") or 0
        verified = "✅" if s.get("isVerified") else ""
        chargers = s.get("chargers") or []
        types    = list(dict.fromkeys([c.get("type","") for c in chargers if c.get("type")]))
        plug     = " · " + ", ".join(types[:2]) if types else ""
        stars    = f" ⭐{rating:.1f}" if rating else ""
        op_city  = f"{operator} · {city}" if operator and city else (operator or city or "")
        lines.append(f"{i}. ⚡ {name} {verified}\n   {op_city}{stars}{plug}")
    return "\n\n".join(lines)


def fmt_detail(s):
    name      = s.get("name") or "Unknown"
    operator  = s.get("operator") or "N/A"
    addr      = s.get("address") or {}
    city      = addr.get("city") or ""
    state     = addr.get("state") or ""
    rating    = s.get("averageRating") or 0
    reviews   = s.get("reviewCount") or 0
    verified  = "✅ Verified" if s.get("isVerified") else "❌ Not Verified"
    status    = (s.get("status") or "unknown").capitalize()
    amenities = s.get("amenities") or []
    chargers  = s.get("chargers") or []

    charger_lines = []
    for c in chargers:
        t   = c.get("type", "?")
        pw  = c.get("power", "?")
        tot = c.get("totalPorts", "?")
        av  = c.get("availablePorts", "?")
        charger_lines.append(f"  • {t} — {pw} kW — {av}/{tot} ports free")

    rating_str  = f"{rating:.1f} ({reviews} reviews)" if rating else "No ratings yet"
    charger_str = chr(10).join(charger_lines) if charger_lines else "  No charger info"
    amenity_str = ", ".join(amenities) if amenities else "None listed"

    return (
        f"📍 **{name}**\n\n"
        f"🏢 Operator: {operator}\n"
        f"📌 {city}, {state}\n"
        f"⭐ Rating: {rating_str}\n"
        f"{verified} · Status: {status}\n\n"
        f"⚡ Chargers:\n{charger_str}\n\n"
        f"🛎 Amenities: {amenity_str}"
    )


def extract_number(tracker):
    """Get the selected number from slot or raw message text."""
    raw = tracker.get_slot("selected_number")
    if raw is not None:
        try:
            return int(str(raw).strip())
        except ValueError:
            pass

    text = (tracker.latest_message.get("text") or "").strip().lower()
    word_map = {
        "first": 1, "one": 1, "ek": 1, "pehla": 1, "1st": 1,
        "second": 2, "two": 2, "do": 2, "doosra": 2, "2nd": 2,
        "third": 3, "three": 3, "teen": 3, "teesra": 3, "3rd": 3,
        "fourth": 4, "four": 4, "char": 4, "chautha": 4, "4th": 4,
        "fifth": 5, "five": 5, "paanch": 5, "paanchwa": 5, "5th": 5,
    }
    for word, num in word_map.items():
        if word in text:
            return num
    match = re.search(r"\b([1-5])\b", text)
    if match:
        return int(match.group(1))
    return None


def charger_type_matches(station, ctype):
    """Check if any charger in a station matches the requested type (partial, case-insensitive)."""
    ctype_l = ctype.lower()
    # Map generic terms to what's actually in the DB
    type_aliases = {
        "dc":     ["dc", "chademo", "ccs", "ccs2"],
        "ac":     ["ac", "type 2", "type2", "cee"],
        "ccs":    ["ccs"],
        "ccs2":   ["ccs2", "ccs (type 2)"],
        "chademo":["chademo"],
        "type2":  ["type 2", "type2"],
    }
    search_terms = type_aliases.get(ctype_l, [ctype_l])
    for c in (station.get("chargers") or []):
        t = (c.get("type") or "").lower()
        for term in search_terms:
            if term in t:
                return True
    return False


class ActionSearchStations(Action):
    def name(self) -> Text:
        return "action_search_stations"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        intent       = tracker.get_intent_of_latest_message()
        city         = tracker.get_slot("city")
        state        = tracker.get_slot("state")
        charger_type = tracker.get_slot("charger_type")
        operator     = tracker.get_slot("operator")
        params       = {}
        client_charger_filter = None

        if   intent == "find_station_by_city"         and city:         params["city"]        = city
        elif intent == "find_station_by_state"        and state:        params["search"]      = state
        elif intent == "find_station_by_operator"     and operator:     params["search"]      = operator
        elif intent == "find_station_by_charger_type":
            if not charger_type:
                dispatcher.utter_message(
                    text=(
                        "Please specify a charger type!\n\n"
                        "Available types:\n"
                        "• **CCS** / **CCS2**\n"
                        "• **CHAdeMO**\n"
                        "• **Type2**\n"
                        "• **AC** / **DC**\n\n"
                        "Example: *Show CCS chargers*"
                    )
                )
                return []
            params["chargerType"]     = charger_type
            client_charger_filter = charger_type

        try:
            data     = requests.get(BASE_URL, params=params, timeout=5).json()
            stations = list(data.get("stations") or [])

            # ── Client-side charger type filter (fallback when API returns nothing) ──
            if client_charger_filter and not stations:
                all_data = requests.get(BASE_URL, timeout=5).json()
                all_stations = list(all_data.get("stations") or [])
                stations = [s for s in all_stations if charger_type_matches(s, client_charger_filter)]

            # ── Special filters ────────────────────────────────────────────────────
            if intent == "find_verified_stations":
                stations = [s for s in stations if s.get("isVerified")]
            elif intent == "find_fastest_charger":
                def top_kw(s):
                    return max((c.get("power", 0) for c in (s.get("chargers") or [])), default=0)
                stations = sorted(stations, key=top_kw, reverse=True)
            elif intent == "find_top_rated_stations":
                stations = sorted(stations, key=lambda s: s.get("averageRating", 0), reverse=True)

            if not stations:
                dispatcher.utter_message(text="😕 No stations found. Try a different city or filter!")
                return [SlotSet("station_ids", None)]

            labels = {
                "find_station_by_city":         f"in **{city}**",
                "find_station_by_state":        f"in **{state}**",
                "find_station_by_operator":     f"by **{operator}**",
                "find_station_by_charger_type": f"with **{charger_type}** chargers",
                "find_top_rated_stations":      "(Top Rated ⭐)",
                "find_fastest_charger":         "(Fastest ⚡)",
                "find_verified_stations":       "(Verified Only ✅)",
            }
            label = labels.get(intent, "")
            total = data.get("total", len(stations))

            dispatcher.utter_message(
                text=(
                    f"Found **{total} stations** {label}:\n\n"
                    f"{fmt_list(stations)}\n\n"
                    f"Say a number **1–5** to get full details! 👇"
                )
            )
            ids = ",".join(str(s["_id"]) for s in stations[:5])
            return [SlotSet("station_ids", ids)]

        except Exception as e:
            dispatcher.utter_message(text=f"⚠️ Backend unreachable. Is the server running on port 8000?")
            return []


class ActionGetStationById(Action):
    def name(self) -> Text:
        return "action_get_station_by_id"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        intent      = tracker.get_intent_of_latest_message()
        station_ids = tracker.get_slot("station_ids")
        fallback_id = tracker.get_slot("current_station_id")
        station_id  = None

        # ── SELECTION intent: user picked a number from the list ──────────────
        if intent in SELECTION_INTENTS:
            num = extract_number(tracker)
            if num is not None and station_ids:
                try:
                    id_list = [x.strip() for x in station_ids.split(",")]
                    idx = num - 1
                    if 0 <= idx < len(id_list):
                        station_id = id_list[idx]
                except (ValueError, IndexError):
                    pass

        # ── FOLLOW-UP intent: user asking more about CURRENT station ──────────
        elif intent in FOLLOWUP_INTENTS:
            station_id = fallback_id

        # ── Generic fallback ──────────────────────────────────────────────────
        if not station_id:
            num = extract_number(tracker)
            if num is not None and station_ids:
                try:
                    id_list = [x.strip() for x in station_ids.split(",")]
                    idx = num - 1
                    if 0 <= idx < len(id_list):
                        station_id = id_list[idx]
                except (ValueError, IndexError):
                    pass
            if not station_id:
                station_id = fallback_id

        if not station_id:
            dispatcher.utter_message(
                text="Please search for stations first! Try: *Find stations in Mumbai*"
            )
            return []

        try:
            resp    = requests.get(f"{BASE_URL}/{station_id}", timeout=5).json()
            station = resp.get("station") or {}
            if not station:
                dispatcher.utter_message(text="Station not found. Please search again.")
                return []
            dispatcher.utter_message(text=fmt_detail(station))
            return [
                SlotSet("current_station_id",   station_id),
                SlotSet("current_station_name", station.get("name", ""))
            ]
        except Exception:
            dispatcher.utter_message(text="⚠️ Could not fetch station details. Is the backend running?")
            return []


class ActionFindNearby(Action):
    def name(self) -> Text:
        return "action_find_nearby"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(
            text=(
                "📍 For stations near you, use the **Map View** in the app — "
                "it uses your GPS in real time!\n\n"
                "Or tell me your city. Example: *Find stations in Pune*"
            )
        )
        return []
