import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faLocationDot,
  faStar,
  faClock,
  faPaperPlane
} from "@fortawesome/free-solid-svg-icons";

function StationCard({ station }) {

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/station/${station.id}`)}
      className="bg-white rounded-xl border p-4 sm:p-6 cursor-pointer hover:shadow-lg transition"
    >

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

        {/* Left Section */}
        <div className="flex items-start gap-3 sm:gap-4">

          {/* Icon */}
          <div className="bg-green-100 text-green-600 p-3 sm:p-4 rounded-lg">
            <FontAwesomeIcon icon={faBolt}/>
          </div>

          {/* Info */}
          <div>

            <h2 className="text-base sm:text-lg font-semibold">
              {station.name}
            </h2>

            <p className="text-gray-500 flex items-center gap-2 text-xs sm:text-sm mt-1">
              <FontAwesomeIcon icon={faLocationDot}/>
              {station.location}
            </p>

            {/* Bottom Info */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">

              <span className="text-green-600 font-medium">
                {station.available}
              </span>

              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faPaperPlane}/>
                {station.distance}
              </span>

              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400"/>
                {station.rating}
              </span>

              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faClock}/>
                {station.time}
              </span>

            </div>

          </div>

        </div>

        {/* Badge */}
        <div className="w-fit bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs sm:text-sm">
          {station.type}
        </div>

      </div>

    </div>
  );
}

export default StationCard;