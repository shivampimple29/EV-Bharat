import { useForm } from "react-hook-form";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faClock, faPlug, faBolt } from "@fortawesome/free-solid-svg-icons";

function BookSlot() {

  const { register, handleSubmit } = useForm();
  const [success, setSuccess] = useState(false);

  const onSubmit = (data) => {
    console.log("Booking Data:", data);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faBolt} className="text-green-600"/>
          Book Charging Slot
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Date */}
          <div>
            <label className="text-sm font-medium flex gap-2 items-center">
              <FontAwesomeIcon icon={faCalendarDays}/>
              Select Date
            </label>
            <input
              type="date"
              {...register("date")}
              required
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* Time */}
          <div>
            <label className="text-sm font-medium flex gap-2 items-center">
              <FontAwesomeIcon icon={faClock}/>
              Select Time Slot
            </label>
            <select
              {...register("time")}
              required
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="">Choose Slot</option>
              <option>08:00 AM - 09:00 AM</option>
              <option>09:00 AM - 10:00 AM</option>
              <option>10:00 AM - 11:00 AM</option>
              <option>11:00 AM - 12:00 PM</option>
              <option>12:00 PM - 01:00 PM</option>
            </select>
          </div>

          {/* Connector Type */}
          <div>
            <label className="text-sm font-medium flex gap-2 items-center">
              <FontAwesomeIcon icon={faPlug}/>
              Connector Type
            </label>
            <select
              {...register("connector")}
              required
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="">Select Connector</option>
              <option>Type 2</option>
              <option>CCS</option>
              <option>CHAdeMO</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mt-4"
          >
            Confirm Booking
          </button>

        </form>

        {success && (
          <div className="text-green-600 text-center mt-4 font-medium">
            Slot booked successfully 🚗⚡
          </div>
        )}

      </div>
    </div>
  );
}

export default BookSlot;