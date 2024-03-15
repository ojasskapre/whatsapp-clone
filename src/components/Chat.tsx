import React, { useState, useEffect } from 'react';
import '../css/Chat.css';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import AttachFile from '@mui/icons-material/AttachFile';
import MoreVert from '@mui/icons-material/MoreVert';
import InsertEmoticon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { useParams } from 'react-router-dom';
import db from '../firebase';
import {
  doc,
  query,
  orderBy,
  onSnapshot,
  collection,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { useAuth } from './auth/AuthContext';

type MessageType = {
  id: string;
  message: string;
  name: string;
  timestamp: Timestamp;
};

const Chat = () => {
  const [input, setInput] = useState('');
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (roomId) {
      const unsubscribeRooms = onSnapshot(
        doc(db, 'rooms', roomId),
        (snapshot) => {
          if (snapshot.exists()) {
            setRoomName(snapshot.data().name);
          }
        }
      );

      const messagesRef = collection(db, 'rooms', roomId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));

      const unsubscribeMessages = onSnapshot(q, (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            message: doc.data().message,
            name: doc.data().name,
            timestamp: doc.data().timestamp,
          }))
        );
      });

      return () => {
        unsubscribeRooms();
        unsubscribeMessages();
      };
    }
  }, [roomId]);

  const sendMessage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (roomId) {
      addDoc(collection(db, 'rooms', roomId, 'messages'), {
        message: input,
        name: user?.displayName,
        timestamp: Timestamp.now(),
      });
    }
    setInput('');
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar
          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${roomId}`}
        />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last seen at{' '}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toLocaleString()}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => (
          <p
            key={message.id}
            className={`chat__message ${
              message.name === user?.displayName && 'chat__receiver'
            }`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {message.timestamp?.toDate().toLocaleString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <InsertEmoticon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
};

export default Chat;
