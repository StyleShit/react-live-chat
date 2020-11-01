import { useEffect, useState } from 'react';
import { useSocket } from './contexts/SocketContext';
import withSocket from './HOCs/withSocket';
import { ChatContainer } from './components/ChatContainer';
import './App.css';

function App()
{
	// store messages from server
	const [ messages, setMessages ] = useState( [] );

	// use socket
	const socket = useSocket();


	// join room & fetch messages on mount
	useEffect( () => {

		// join room
		socket.emit( 'join-room', { userName: 'StyleShit', room: 'test-room'} );


		// get chat history from server
		socket.on( 'chat-history', ( history ) => {
			setMessages( history );
		});


		// new message from server
		socket.on( 'chat-message', ( message ) => {
			setMessages( prev => {
				return [ ...prev, message ];
			});
		});

		// close connection on unmount
		return () => {
			socket.disconnect()
		};

		// eslint-disable-next-line
	}, [] );

	return (
		<div className="App">
			<ChatContainer messages={ messages } />
		</div>
	);
}

export default withSocket( App );