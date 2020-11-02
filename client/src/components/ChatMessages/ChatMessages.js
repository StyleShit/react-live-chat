import React, { useRef, useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import './ChatMessages.css';

function ChatMessages({ messages })
{
    // get socket id
    const socket = useSocket();
    const id = socket.id;

    // scroll messages container on messages change
    const messagesContainerRef = useRef( null );

    useEffect(() => {
        
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;

    }, [ messages ]);

    return (
        <div className="chat-messages" ref={ messagesContainerRef }>

            {
                // TODO: create different component for message
                messages.map(( { author, time, message }, i ) => {

                    const formattedTime = new Date( time ).toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit' } );
                    
                    const chatbotClass = author.id === -1 ? 'message-chatbot' : '';
                    const inOutClass = author.id === id ? 'message-out' : 'message-in';

                    return (
                        <div className={ `message ${ inOutClass } ${ chatbotClass }` } key={ i }>

                            { author.id !== id &&
                                <span className="message-author">{ author.userName }</span>   
                            }
                            
                            { message }

                            <span className="message-time">{ formattedTime }</span>

                        </div>
                    );

                })
            }

        </div>
    )
}

export default ChatMessages;