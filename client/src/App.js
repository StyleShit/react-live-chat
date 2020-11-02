import { useEffect, useState } from 'react';
import { useSocket } from './contexts/SocketContext';
import withSocket from './HOCs/withSocket';
import { ChatContainer } from './components/ChatContainer';
import './App.css';
import { ChatLogin } from './components/ChatLogin';

function App()
{
	// store user name and room
	const [ userName, setUserName ] = useState( '' );
	const [ room, setRoom ] = useState( '' );

	// store messages from server
	const [ messages, setMessages ] = useState( [] );
	const [ participants, setParticipants ] = useState( [] );

	// use socket
	const socket = useSocket();


	// join room & fetch messages on mount
	useEffect( () => {


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

		// server sent updated participants list
		socket.on( 'chat-participants', ( participants ) => {
			setParticipants( participants );
		});

		// close connection on unmount
		return () => {
			socket.disconnect()
		};

		// eslint-disable-next-line
	}, [] );

	return (
		<div className="App">
			{ !userName && !room
				? <ChatLogin setUserName={ setUserName } setRoom={ setRoom } />
				: <ChatContainer messages={ messages } participants={ participants } room={ room } />
			}
		</div>
	);
}

export default withSocket( App );