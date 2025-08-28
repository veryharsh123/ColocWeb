import React, { useState } from "react";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Questionnaire() {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName || "",
    college: "",
    budgetMin: "",
    budgetMax: "",
    bio: ""
  });

  function onChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const ref = doc(db, "profiles", auth.currentUser.uid);
    await setDoc(ref, {
      uid: auth.currentUser.uid,
      ...formData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    window.location.reload(); // refresh → goes to MatchCards
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-6"
    >
      <h2 className="text-2xl font-bold mb-4">Create Your Profile</h2>

      <input
        id="name"
        value={formData.name}
        onChange={onChange}
        placeholder="Your Name"
        className="w-full border p-2 mb-3 rounded"
        required
      />

      <input
        id="college"
        value={formData.college}
        onChange={onChange}
        placeholder="Your College"
        className="w-full border p-2 mb-3 rounded"
        required
      />

      <div className="flex gap-2 mb-3">
        <input
          id="budgetMin"
          type="number"
          value={formData.budgetMin}
          onChange={onChange}
          placeholder="Min Budget"
          className="w-1/2 border p-2 rounded"
          required
        />
        <input
          id="budgetMax"
          type="number"
          value={formData.budgetMax}
          onChange={onChange}
          placeholder="Max Budget"
          className="w-1/2 border p-2 rounded"
          required
        />
      </div>

      <textarea
        id="bio"
        value={formData.bio}
        onChange={onChange}
        placeholder="Write a short bio"
        className="w-full border p-2 text-black mb-4 rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800"
      >
        Save Profile
      </button>
    </form>
  );
}
