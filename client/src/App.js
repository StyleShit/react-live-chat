import { useState } from 'react';
import useChat from './hooks/useChat';
import withSocket from './HOCs/withSocket';
import { ChatContainer } from './components/ChatContainer';
import { ChatLogin } from './components/ChatLogin';
import './App.css';

function App() {
	const [ userName, setUserName ] = useState( '' );
	const [ room, setRoom ] = useState( '' );

	const { messages, participants } = useChat();

	return (
		<div className="App">
			{ ! userName || ! room
				? <ChatLogin setUserName={ setUserName } setRoom={ setRoom } />
				: <ChatContainer messages={ messages } participants={ participants } room={ room } />
			}
		</div>
	);
}

export default withSocket( App );
