import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

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
			<h1>
				It Works!
			</h1>

			{ response &&
				<div>
					<strong>Server Says: </strong>{ response }
				</div>
			}
		</div>
	);
}

export default App;