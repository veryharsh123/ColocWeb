import Moment from "react-moment";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function MarketplaceItem({ item, id, onEdit, onDelete }) {
  return (
    <li className="relative bg-gray-900 flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden m-[10px]">
      <Link className="contents" to={`/marketplace/${id}`}>
        {/* Image */}
        <img
          className="h-[170px] w-full object-cover hover:scale-105 transition-transform duration-200 ease-in"
          loading="lazy"
          src={item.imgUrls[0]}
          alt={item.name}
        />

        {/* Timestamp */}
        <Moment
          fromNow
          className="absolute top-1 left-1 bg-blue-800 text-white text-xs font-light rounded-md px-2 py-1 shadow-lg"
        >
          {item.timestamp?.toDate()}
        </Moment>

        {/* Content */}
        <div className="w-full p-[10px]">
          {/* Name */}
          <p className="font-semibold mt-1 text-lg truncate text-white">
            {item.name}
          </p>

          {/* Price */}
          <p className="text-blue-400 mt-1 font-semibold text-sm">
            ₹{item.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>

          {/* Description */}
          <p className="text-gray-400 mt-1 text-xs line-clamp-2">
            {item.description}
          </p>
        </div>
      </Link>

      {/* Actions */}
      {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500 hover:text-red-600 transition"
          onClick={() => onDelete(item.id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute bottom-2 right-7 h-4 cursor-pointer text-blue-500 hover:text-blue-600 transition"
          onClick={() => onEdit(item.id)}
        />
      )}
    </li>
  );
}
