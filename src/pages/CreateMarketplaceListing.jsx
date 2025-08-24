import React, { useState } from 'react';
import Spinner from '../components/spinner';
import { toast } from 'react-toastify';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router';

export default function CreateMarketplaceListing() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'electronics',
    description: '',
    price: 0,
    images: {}
  });

  const { name, category, description, price, images } = formData;

  function onChange(e) {
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (images.length > 6) {
      setLoading(false);
      toast.error('Maximum 6 images are allowed.');
      return;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Optional: track progress
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all([...images].map((image) => storeImage(image))).catch((error) => {
      setLoading(false);
      toast.error('Images not uploaded');
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid
    };

    delete formDataCopy.images;

    const docRef = await addDoc(collection(db, 'marketplace'), formDataCopy);
    setLoading(false);
    toast.success('Marketplace Item Created');
    navigate(`/marketplace/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl my-3 text-center mt-6 font-bold">Create Marketplace Listing</h1>
      <form onSubmit={onSubmit}>
        {/* Name */}
        <p className="text-lg mt-6 font-semibold">Item Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Item name"
          maxLength="64"
          minLength="3"
          required
          className="w-full py-2 px-3 my-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
        />

        {/* Category */}
        <p className="text-lg mt-6 font-semibold">Category</p>
        <select
          id="category"
          value={category}
          onChange={onChange}
          className="w-full py-2 px-3 my-2 text-md text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
        >
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="books">Books</option>
          <option value="fashion">Fashion</option>
          <option value="other">Other</option>
        </select>

        {/* Description */}
        <p className="text-lg mt-6 font-semibold">Description</p>
        <textarea
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Item description"
          maxLength="500"
          minLength="10"
          required
          className="w-full py-5 px-3 my-2 text-md text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
        />

        {/* Price */}
        <div>
          <p className="text-lg font-semibold">Price</p>
          <input
            type="number"
            id="price"
            value={price}
            onChange={onChange}
            min="1"
            max="10000000"
            required
            className="w-full px-3 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
          />
        </div>

        {/* Images */}
        <div className="my-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600 py-2">The first image will be the cover (max 6)</p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded transition ease-in-out"
          />
        </div>

        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-800 hover:bg-blue-950 text-white rounded transition ease-in-out"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
}
