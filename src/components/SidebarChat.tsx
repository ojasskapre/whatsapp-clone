import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import '../css/SidebarChat.css';
import db from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

interface SidebarChatProps {
  addNewChat?: boolean;
  id?: string;
  name?: string;
}

const SidebarChat: React.FC<SidebarChatProps> = ({ addNewChat, id, name }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    const messageRef = collection(db, 'rooms', id, 'messages');
    const q = query(messageRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessage(snapshot.docs[0]?.data().message);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const createChat = () => {
    const roomName = prompt('Please enter name for chat room');

    if (roomName) {
      addDoc(collection(db, 'rooms'), {
        name: roomName,
      });
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${id}`} />

        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div className="sidebarChat" onClick={createChat}>
      <h2>Add new Chat</h2>
    </div>
  );
};

export default SidebarChat;
