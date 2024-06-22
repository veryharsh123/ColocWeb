import React, { useEffect, useState } from 'react';
import {db} from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import Spinner from '../components/spinner';
export default function AdditionalInfo() 
{
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [college, setCollege] = useState('');
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
const [colleges, setColleges] = useState([]);
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const cachedColleges = localStorage.getItem('colleges');
        console.log(cachedColleges);
        if (cachedColleges) {
          setColleges(JSON.parse(cachedColleges));
        } else {
          const collegesRef = collection(db,'colleges');
          const collegesSnapshot = await getDocs(collegesRef);
          console.log(collegesSnapshot);
          const collegesList = collegesSnapshot.docs.map(doc => doc.data());
          setColleges(collegesList);
          localStorage.setItem('colleges', JSON.stringify(collegesList));
        }
      } catch (error) {
        console.error('Error fetching colleges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  useEffect(()=>
  { setLoading(true);
      async function getUser(){
          const docRef = doc(db, "users" ,auth.currentUser.uid)
          const docSnap = await getDoc(docRef);
         
          if(docSnap.exists()){
            setUserData(docSnap.data())
            if (userData && userData.age && userData.bio && userData.college)
            {
                setLoading(false);
                navigate('/');
            }
          }else{
              console.log("Couldn't get Owner's Info")
          }
      }
      getUser();
      setLoading(false);
  },[auth.currentUser.uid,navigate,userData])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) {
      console.error('No user data found');
      return;
    }

    const { id } = userData;

    try {
        setLoading(true);
        const userRef = doc(db, 'users', id);

        await updateDoc(userRef, {
          age,
          bio,
          college,
        });
  
      // Redirect to a welcome page or dashboard
      navigate('/');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
    finally{
        setLoading(false);
    }
  };
if(loading){
    return <Spinner/>
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
    <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-white">Complete Your Profile</h1>
      <div className="mb-4">
        <label className="block text-white mb-2" htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2" htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
        <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="college">College:</label>
            <select
            id="college"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Select College</option>
            {colleges.map((college) => (
                <option key={college.id} value={college.name}>
                {college.name}
                </option>
            ))}
            </select>
        </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  </div>
);
};