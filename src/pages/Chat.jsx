import React from 'react'
import { useParams } from 'react-router'
import { db } from '../firebase';
import { collection, orderBy } from 'firebase/firestore';
import { getDocs, query } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../components/spinner';


export default function Chat() {
    const param = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    useEffect(() => {
        async function fetchMessages() {
            try {
                const messageRef = collection(db, 'chats', param.ch, 'messages');
                const messageQuery = query(messageRef, orderBy('timestamp', 'asc'));
                const messageSnapshot = await getDocs(messageQuery);
                const message = [];
                messageSnapshot.forEach(doc => {
                    message.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                setMessages(message);
                setLoading(false);

                const unsubscribe = collection(db, 'chats', param.userId, 'messages').orderBy('timestamp').onSnapshot((snapshot) => {
                    const message = [];
                    snapshot.forEach(doc => {
                        message.push({
                            id: doc.id,
                            data: doc.data()
                        });
                    });
                    setMessages(message);
                });
                return unsubscribe;

            } catch (error) {
                toast.error('Error fetching messages', error);
            }
        }
        fetchMessages();
    }, [param.userId]);
    async function onSendMessage() {
      try{

      }
      catch{}
    }
    if(loading){
      return <Spinner/>
    }
  return (
    <div className="flex flex-col h-screen p-4">
    <div className="flex-1 overflow-y-auto mb-4">
      {messages.map(({ id, data }) => (
        <div
          key={id}
          className={`mb-2 p-2 rounded-lg ${
            data.senderId === auth.currentUser.uid
              ? 'bg-blue-500 text-white self-end'
              : 'bg-gray-200 self-start'
          }`}
        >
          <p>{data.text}</p>
        </div>
      ))}
    </div>
    <form onSubmit={onSendMessage} className="flex">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded-r-lg">
        Send
      </button>
    </form>
  </div>
);
};
