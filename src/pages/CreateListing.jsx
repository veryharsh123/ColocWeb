import React, { useState } from 'react'
export default function CreateListing() {
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
    })
    const {type, name, bedroom, bathroom, parking, furnished, address, description, price} = formData;
    function onChange(){

    }
  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className="text-3xl my-3 text-center mt-6 font-bold">Create a Listing</h1>
        <form>
            <p className="text-lg mt-6 font-semibold">Sell/Rent</p>
            <div className='flex my-3'>
                <button type='button' id="type" value="sale" onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${type === 'rent' ? "bg-white text-black" : "bg-blue-800 hover:bg-blue-950"}`}>
                    Sell
                </button>
                <button type='button' id="type" value="sale" onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out w-full ${type === 'sale' ? "bg-white text-black" : "bg-blue-800 hover:bg-blue-950"}`}>
                    Rent
                </button>
            </div>
            <p className='text-lg mt-6 font-semibold '>Name</p>
            <input type="text" id="name" value={name} onChange={onChange} placeholder='Name' maxLength="32" minLength="10" required className=" w-full py-2 px-3 my-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"/>
            <div className="flex justify-between my-3">
                <div className="w-full">
                <p>Bedroom</p>
                <input type="number" id="bedrooms" value={bedroom} onChange={onChange} min="1" max="10" className="w-3/4 py-2 my-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"/>
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
