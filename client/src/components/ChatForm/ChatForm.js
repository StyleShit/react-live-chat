import React, { useState, useRef } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import './ChatForm.css';

function ChatForm()
{
    const [ message, setMessage ] = useState( '' );
    const inputRef = useRef( null );
    const socket = useSocket();


    // handle form submission
    const handleSubmit = ( e ) => {

        e.preventDefault();

        // send message to the server
        socket.emit( 'chat-message', message );
        
        // reset the message and focus on the input
        setMessage( '' );
        inputRef.current.focus();

    };


    return (
        <form action="#" className="chat-form" onSubmit={ handleSubmit }>
            <input type="text" 
                placeholder="💬 Type your message..." 
                value={ message } 
                onChange={ ( e ) => { setMessage( e.target.value ); } }
                ref={ inputRef }
            />
            <input type="submit" value="🚀" />
        </form>
    )
}

export default ChatForm;