import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import MarketplaceItem from "../pages/MarketplaceItem";

export default function Marketplace() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const itemsRef = collection(db, "marketplace");
        const q = query(itemsRef, orderBy("timestamp", "desc"));
        const querySnap = await getDocs(q);

        const itemsArr = [];
        querySnap.forEach((doc) => {
          itemsArr.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setItems(itemsArr);
      } catch (error) {
        console.log("Error fetching marketplace items:", error);
      }
    }

    fetchItems();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Marketplace</h1>
      {items && items.length > 0 ? (
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <MarketplaceItem key={item.id} id={item.id} item={item.data} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No items found in marketplace.</p>
      )}
    </div>
  );
}
