import React from 'react';
import { ChatForm } from '../ChatForm';
import { ChatMessages } from '../ChatMessages';
import { ChatTitle } from '../ChatTitle';
import { RoomParticipants } from '../RoomParticipants';
import './ChatContainer.css';

function ChatContainer()
{
    return (
        <div className="chat-container">
            <RoomParticipants />
            <ChatTitle />
            <ChatMessages />
            <ChatForm />
        </div>
    )
}

export default ChatContainer
