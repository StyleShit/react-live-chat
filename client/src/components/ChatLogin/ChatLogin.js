import React, { useRef } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import './ChatLogin.css';

function ChatLogin({ setUserName, setRoom })
{
    const socket = useSocket();
    const userNameRef = useRef( null );
    const roomRef = useRef( null );

    const handleSubmit = ( e ) => {

        e.preventDefault();

        const userName = userNameRef.current.value.trim();
        const room = roomRef.current.value;

        if( !userName || !room || room === '0' )
            return;

        setUserName( userName );
        setRoom( room );

        // join room
		socket.emit( 'join-room', { userName, room } );

    };

    return (
        <div className="chat-login">

            <div className="login-title">
                <h1>
                    Login:
                </h1>
                <span>
                    React & Socket.io Live Chat
                </span>
            </div>

            <form onSubmit={ handleSubmit }>

                <input type="text" placeholder="User Name" ref={ userNameRef } />

                <select ref={ roomRef }>
                    <option value="0">Room</option>
                    <option value="Node.js">Node.js</option>
                    <option value="PHP">PHP</option>
                    <option value="React">React</option>
                    <option value="Vue">Vue</option>
                    <option value="Angular">Angular</option>
                    <option value="Python">Python</option>
                </select>

                <input type="submit" value="Login 🎉" />
            </form>
        </div>
    )
}

export default ChatLogin;