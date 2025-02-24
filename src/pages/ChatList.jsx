import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import Chat from "../components/Chat";

export default function ChatList() {
  const { chatId } = useParams(); // Get chatId from URL (if available)
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [participantsData, setParticipantsData] = useState({});
  const [loading, setLoading] = useState(true); // Handle async loading state
  const [currentUser, setCurrentUser] = useState(null);
  const auth = getAuth();

  // ✅ Ensure we wait until currentUser is available
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribeAuth; // Cleanup on unmount
  }, [auth]);


  // ✅ Fetch chats for the current user (works for direct access + profile navigation)
  useEffect(() => {
    if (!currentUser) return;

    const fetchChats = async () => {
      setLoading(true); // Ensure loading state is set

      const q = query(collection(db, "chats"), where("participants", "array-contains", currentUser.uid));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const chatData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setChats(chatData);

        // ✅ Fetch participant details (ensure we load every user in the chat)
        const users = {};
        for (const chat of chatData) {
          const otherUserId = chat.participants.find((id) => id !== currentUser.uid);
          if (otherUserId && !users[otherUserId]) {
            const userDoc = await getDoc(doc(db, "users", otherUserId));
            users[otherUserId] = userDoc.exists() ? userDoc.data() : null;
          }
        }
        setParticipantsData(users);

        setLoading(false); // Finished loading
      });

      return unsubscribe;
    };

    fetchChats();
  }, [currentUser]);

  // ✅ Auto-select the correct chat if chatId exists (for direct navigation)
  useEffect(() => {
    if (chatId && chats.length > 0) {
      const chat = chats.find((chat) => chat.id === chatId);
      if (chat) setSelectedChat(chat);
    }
  }, [chatId, chats]);

  const goBack = () => setSelectedChat(null);

  // 🕵️‍♂️ Loading indicator for better UX
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Chat List Panel */}
      <div
        className={`w-full sm:w-1/3 border-r p-4 overflow-y-auto ${selectedChat ? "hidden sm:block" : "block"}`}
      >
        <h1 className="text-2xl font-bold mb-4">Chats</h1>

        {chats.length === 0 ? (
          <p>No chats available. Start a conversation!</p>
        ) : (
          chats.map((chat) => {
            const otherUserId = chat.participants.find((id) => id !== currentUser.uid);
            const otherUser = participantsData[otherUserId];

            return (
              <div
                key={chat.id}
                className="p-3 mb-2 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200"
                onClick={() => setSelectedChat(chat)}
              >
                <p className="font-semibold">{otherUser?.fullname || "Unknown User"}</p>
                <small className="text-gray-500">{otherUser?.bio || "No bio available"}</small>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Window (When a chat is selected) */}
      {selectedChat ? (
        <div className="flex-1">
          <Chat
            chatId={selectedChat.id}
            otherUser={participantsData[selectedChat.participants.find((id) => id !== currentUser.uid)]}
          />
          <button onClick={goBack} className="p-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-800 sm:hidden">
            Back to Chat List
          </button>
        </div>
      ) : (
        <div className="hidden sm:flex items-center justify-center flex-1">
          <p>Select a chat to start messaging.</p>
        </div>
      )}
    </div>
  );
}
