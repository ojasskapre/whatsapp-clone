import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import '../css/SidebarChat.css';

interface SidebarChatProps {
  addNewChat?: boolean;
}

const SidebarChat: React.FC<SidebarChatProps> = ({ addNewChat }) => {
  const [seed, setSeed] = useState('');

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000).toString());
  }, []);

  const createChat = () => {
    const roomName = prompt('Please enter name for chat room');

    if (roomName) {
      // TODO: create a new chat room
    }
  };

  return !addNewChat ? (
    <div className="sidebarChat">
      <Avatar src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`} />
      <div className="sidebarChat__info">
        <h2>Room Name</h2>
        <p>Last Message</p>
      </div>
    </div>
  ) : (
    <div className="sidebarChat" onClick={createChat}>
      <h2>Add new Chat</h2>
    </div>
  );
};

export default SidebarChat;
