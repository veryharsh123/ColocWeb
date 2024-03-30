import React, { useState } from 'react'
import Spinner from '../components/spinner'
import { toast } from 'react-toastify'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import {v4 as uuidv4} from "uuid"
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router'
export default function CreateListing() {
    const auth = getAuth();
    const navigate = useNavigate()
    const [geolocationEnabled, setGeoLocationEnalbled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        type:"rent",
        name:'',
        bedroom: 1,
        bathroom: 1,
        parking: false,
        furnished: false,
        address:"",
        description:"",
        price:0,
        latitude:0,
        longitude:0,
        images:{}
    })
    const {type, name, bedroom, bathroom, parking, furnished, address, description, price, latitude, longitude, images} = formData;
    function onChange(e){
        let boolean = null;
        if(e.target.value === "false"){
            boolean = false
        }
        if(e.target.value === "true"){
            boolean = true
        }
        if(e.target.files){
            setFormData((prevState)=>({
                ...prevState,
                images:e.target.files
            }))
        }
        if(!e.target.files){
            setFormData((prevState)=>({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }))
        }
    }
    async function onSubmit(e)
    {
        e.preventDefault()
        setLoading(true);
        if(images.length>6){
            setLoading(false);
            toast.error("Maximum 6 images are allowed.")
            return;
        }
        let geolocation ={}
        let location 
        if(geolocationEnabled){
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`);
            const data = await response.json()
            console.log(data);
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

            location = data.status === "ZERO_RESULTS" && undefined;
            if(location === undefined){
                setLoading(false)
                toast.error("Please enter the correct address")
                return
            }
        }else{
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }
        async function storeImage(image){
            return new Promise((resolve,reject)=>{
                const storage = getStorage()
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                const storageRef = ref(storage, filename)
                const uploadTask = uploadBytesResumable(storageRef, image)
                uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
    reject(error)
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
     resolve(downloadURL);
    });
  }
);
            })
        }
        const imgUrls = await Promise.all(
            [...images].map((image)=> storeImage(image)))
            .catch((error)=>{
                setLoading(false)
                toast.error("images not uploaded")
                return
            });
     
            const formDataCopy = {
                ...formData,
                imgUrls, 
                geolocation,
                timestamp:serverTimestamp(),
            };
            delete formDataCopy.images;
            delete formDataCopy.latitude;
            delete formDataCopy.longitude;
            const docRef = await addDoc(collection(db, "listings"), formDataCopy);
            setLoading(false)
            toast.success("Listing Created");
            navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }
    if(loading){
        return <Spinner />
    }
  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className="text-3xl my-3 text-center mt-6 font-bold">Create a Listing</h1>
        <form onSubmit={onSubmit}>
            <p className="text-lg mt-6 font-semibold">Sell/Rent</p>
            <div className='flex my-3'>
                <button type='button' id="type" value="sale" onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${type === 'rent' ? "bg-white text-black" : "bg-blue-800 hover:bg-blue-950"}`}>
                    Sell
                </button>
                <button type='button' id="type" value="rent" onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${type === 'sale' ? "bg-white text-black" : "bg-blue-800 hover:bg-blue-950"}`}>
                    Rent
                </button>
            </div>
            <p className='text-lg mt-6 font-semibold '>Name</p>
            <input type="text" id="name" value={name} onChange={onChange} placeholder='Name' maxLength="32" minLength="10" required className=" w-full py-2 px-3 my-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"/>
            <div className="flex justify-between my-3">
                <div className="w-full">
                <p>Bedroom</p>
                <input type="number" id="bedroom" value={bedroom} onChange={onChange} min="1" max="10" className="w-3/4 py-2 my-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"/>
                </div>
                <div className='w-full'>
                <p>Bathroom</p>
                <input type="number" id="bathroom" value={bathroom} onChange={onChange} min="1" max="10" className="w-3/4 py-2 my-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"/>
                </div>
            </div>
            <p className="text-lg mt-6 font-semibold">Parking</p>
            <div className='flex my-3'>
                <button type='button' id="parking" value={true} onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${!parking ? "bg-white text-black" : "bg-blue-800 hover:bg-blue-950"}`}>
                    Yes
                </button>
                <button type='button' id="parking" value={false} onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${parking ? "bg-white text-black" : "bg-blue-800 hover:bg-blue-950"}`}>
                    No
                </button>
            </div>
            <p className="text-lg mt-6 font-semibold">Furnished</p>
            <div className='flex my-3'>
                <button type='button' id="furnished" value={true} onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${!furnished ? "bg-white text-black" : "bg-blue-800 hover:bg-blue-950"}`}>
                    Yes
                </button>
                <button type='button' id="furnished" value={false} onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${furnished ? "bg-white text-black" : "bg-blue-800 hover:bg-blue-950"}`}>
                    No
                </button>
            </div>
            <p className='text-lg mt-6 font-semibold '>Address</p>
            <textarea type="text" id="address" value={address} onChange={onChange} placeholder='Address' maxLength="32" minLength="10" required className=" w-full my-2 py-5 px-3 text-md text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"/>
            {!geolocationEnabled && (
                <div className="flex space-x-4 justify-start mb-4">
                    <div className='text-lg font-semibold'>
                        <p>Latitude:</p>
                        <input type="number" id='latitude' value={latitude}  onChange={onChange} className="w-full px-4 py-2 text-xl text-gray-700 bg-white rounded transition ease-in-out" min="-90" max="90" required/>
                    </div>
                    <div className='text-lg font-semibold'>
                        <p>longitude:</p>
                        <input type="number" id='longitude' value={longitude} onChange={onChange} className="w-full px-4 py-2 text-xl text-gray-700 bg-white rounded transition ease-in-out" min="-180" max="180"required/>
                    </div>
                </div>
            )}
            <p className='text-lg font-semibold '>Description</p>
            <textarea type="text" id="description" value={description} onChange={onChange} placeholder='Description' maxLength="32" minLength="10" required className=" w-full py-5 px-3 my-2 text-md text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"/>
            <div className=''>
                <div>
                    <p className="text-lg font-semibold">Price</p>
                    <div className='flex w-full justify-center items-center space-x-4'>
                    <input type="number" id="price" value={price} onChange={onChange} min="1000" max="300000000" required className="w-full px-0 py-2 text-xl bg-white" />
                    {type === 'rent' && (
                        <div className=''>
                            <p className="text-md w-full whitespace-nowrap">₹ / Month</p>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        <div className="my-6">
            <p className="text-lg font-semibold">Images</p>
            <p className="text-gray-600 py-2">The first image will be cover(max 6)</p>
            <input type="file" id="images" onChange={onChange} accept=".jpg,.png, .jpeg" multiple required className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded transition ease-in-out"/>
        </div>
        <button type="submit" className="mb-6 w-full px-7 py-3 bg-blue-800 hover:bg-blue-950 text-white rounded transition ease-in-out">Create Listing</button>
        </form>
    </main>
  )
}
