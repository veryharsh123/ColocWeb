import Moment from "react-moment"
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
export default function ListingItem({listing,id, onEdit, onDelete}) {
  return (
   <li className="relative bg-gray-900 flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden m-[10px]">
    <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in" loading="lazy" src={listing.imgUrls[0]} alt="Helll nawww"/>
        <Moment fromNow className="absolute top-1 left-1 bg-blue-800 rounded-md px-2 py-1 shadow-lg">
            {listing.timestamp?.toDate()}
        </Moment>
     <div className="w-full p-[10px]">
        <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4"/>
            <p className="font-semibold text-sm mb-[2px] truncate">{listing.address}</p>
        </div>
        <p className="font-semibold mt-2 text-xl truncate">{listing.name}</p>
        <p className="text-blue-600 mt-2 font-semibold">₹{listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{listing.type === "rent" && " /Month"}</p>
        <div className="flex space-x-6 items-center mt-2">
            <div >
                <p className="font-bold text-xs">{listing.bedroom > 1 ? `${listing.bedroom} Beds` : `${listing.bedroom} Bed`}</p>
            </div>
            <div>
            <p className="font-bold text-xs">{listing.bathroom > 1 ? `${listing.bathroom} Baths` : `${listing.bathroom} Bath`}</p>
            </div>
        </div>
     </div>
    </Link>
    {onDelete && (
        <FaTrash className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-700" onClick={()=>onDelete(listing.id)}/>
    )}
     {onEdit && (
        <MdEdit className="absolute bottom-2 right-7 h-4 cursor-pointer text-blue-800" onClick={()=>onEdit(listing.id)}/>
    )}
    </li>
   
  )
}
