import React from 'react';
import { ChatForm } from '../ChatForm';
import { ChatMessages } from '../ChatMessages';
import { ChatTitle } from '../ChatTitle';
import { RoomParticipants } from '../RoomParticipants';
import './ChatContainer.css';

function ChatContainer({ messages })
{
    return (
        <div className="chat-container">
            <RoomParticipants />
            <ChatTitle />
            <ChatMessages messages={ messages } />
            <ChatForm />
        </div>
    )
}

export default ChatContainer;