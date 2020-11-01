import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import { ChatContainer } from './components/ChatContainer';

function App()
{
	const [ response, setResponse ] = useState( '' );
	useEffect( () => {

		// connect to socket server on mount
		const socket = io( 'http://localhost:3001' );

		// on message from server
		socket.on( 'message', message => {
			setResponse( message );
		});

	}, []);

	return (
		<div className="App">
			<ChatContainer />
		</div>
	);
}

export default App;