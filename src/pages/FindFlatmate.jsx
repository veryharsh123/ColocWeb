import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; 
import MatchCards from './MatchCards';
import Questionnaire from "./Questionnaire"; 
import Spinner from "../components/spinner";

export default function FindFlatmates() {
  const auth = getAuth();
  const [hasProfile, setHasProfile] = useState(null); // null = loading, true/false
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function checkProfile() {
      setLoading(true);
      const ref = doc(db, "profiles", auth.currentUser.uid);
      const snap = await getDoc(ref);
      setHasProfile(snap.exists());
    }
    checkProfile();
    setLoading(false);
  }, [auth.currentUser.uid]);

  if (hasProfile === null) {
    <Spinner />;
  }

  // If profile exists → show match cards
  if (hasProfile=== true) {
    return <MatchCards currentUid={auth.currentUser.uid} />;
  }

  // If no profile → ask if they want to sign up
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-800"
      >
        Join Flatmate Matching
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Join Matching?</h2>
            <p className="text-gray-600 mb-6">
              To find your ideal flatmate, we’ll need a short profile from you.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-red-500 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setHasProfile("create"); // trigger questionnaire
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {hasProfile === "create" && <Questionnaire />}
    </div>
  );
}
