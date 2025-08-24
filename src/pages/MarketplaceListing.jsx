import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCards } from "swiper/modules";
import "swiper/css/bundle";
import Spinner from "../components/spinner";
import { MdIosShare } from "react-icons/md";
import Contact from "../components/Contact";

export default function MarketplaceListing() {
  const { itemId } = useParams();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactOwner, setContactOwner] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      const docRef = doc(db, "marketplace", itemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItem(docSnap.data());
        setLoading(false);
      }
    }
    fetchItem();
  }, [itemId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      {/* Image Carousel */}
      <Swiper
        className="w-4/6"
        modules={[Navigation, Pagination, Autoplay, EffectCards]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true, type: "progressbar" }}
        effect="cards"
        autoplay={{ delay: 3000 }}
      >
        {item.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full items-center overflow-hidden h-[400px]"
              style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Share Button */}
      <div
        className="fixed top-[13%] right-[18%] z-10 bg-black cursor-pointer border-2 border-blue-400 rounded-full w-10 h-10 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <MdIosShare className="text-lg text-white" />
      </div>
      {shareLinkCopied && (
        <p className="fixed top-[20%] right-[17%] p-2 text-blue-800 font-bold border-2 border-gray-300 rounded-md bg-gray-400 z-10">
          Link Copied
        </p>
      )}

      {/* Content */}
      <div className="flex flex-col max-w-4xl lg:mx-auto p-4 rounded-lg shadow-lg bg-gray-950 mt-5">
        <p className="text-2xl font-extrabold mb-3 text-gray-300">
          {item.name} - ₹
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>

        <p className="mt-2 mb-3 font-semibold text-gray-400">
          <span className="font-extrabold text-white">Category:</span>{" "}
          {item.category}
        </p>

        <p className="mt-2 mb-3 text-gray-400">
          <span className="font-extrabold text-white">Description:</span>{" "}
          {item.description}
        </p>

        {/* Contact Owner */}
        {item.userRef !== auth.currentUser?.uid && !contactOwner && (
          <div className="mt-4">
            <button
              onClick={() => setContactOwner(true)}
              className="w-3/4 px-7 py-3 bg-blue-600 text-white font-medium rounded shadow-md hover:bg-blue-800 hover:shadow-lg"
            >
              Contact Seller
            </button>
          </div>
        )}

        {contactOwner && (
          <Contact userRef={item.userRef} listing={item} marketplace />
        )}
      </div>
    </main>
  );
}
