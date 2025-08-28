import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function MatchCards({ currentUid }) {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    async function fetchProfiles() {
      const snap = await getDocs(collection(db, "profiles"));
      const data = snap.docs
        .map((doc) => doc.data())
        .filter((u) => u.uid !== currentUid); // exclude self
      setProfiles(data);
    }
    fetchProfiles();
  }, [currentUid]);

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-4">
      <h2 className="text-2xl font-bold">Potential Flatmates</h2>
      {profiles.map((p) => (
        <div
          key={p.uid}
          className="p-4 border rounded-lg shadow bg-white"
        >
          <h3 className="font-semibold text-gray-700 text-lg">{p.name}</h3>
          <p className="text-gray-600">{p.college}</p>
          <p className="text-sm text-gray-500">
            Budget: ₹{p.budgetMin} - ₹{p.budgetMax}
          </p>
          <p className="mt-2 text-gray-600">{p.bio}</p>
        </div>
      ))}
    </div>
  );
}
