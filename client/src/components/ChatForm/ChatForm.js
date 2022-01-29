import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import './ChatForm.css';

function ChatForm() {
	const [ message, setMessage ] = useState( '' );
	const [ typing, setTyping ] = useState( [] );
	const [ typeTimeout, setTypeTimeout ] = useState( null );

	const inputRef = useRef( null );
	const socket = useSocket();

	const handleSubmit = ( e ) => {
		e.preventDefault();

		const trimmedMessage = message.trim();

		if ( ! trimmedMessage )
			return;

		socket.emit( 'chat-message', trimmedMessage );

		setMessage( '' );
		inputRef.current.focus();
	};

	const handleKeyUp = ( e ) => {
		if ( e.keyCode === 13 ) // `Enter` key.
			return;

		if ( ! typeTimeout ) {
			socket.emit( 'start-typing' );
		} else {
			clearTimeout( typeTimeout );
		}

		setTypeTimeout( setTimeout( () => {
			socket.emit( 'stop-typing' );
			setTypeTimeout( null );
		}, 500 ) );
	};

	const formatTypers = () => {
		const typers = typing.reduce( ( res, u ) => {
			if ( u.id !== socket.id )
				res.push( u.userName );

			return res;
		}, [] );

		if ( typers.length === 0 ) {
			return '';
		}

		const isAre = ( typers.length === 1 ) ? ' is ' : ' are ';

		return typers.join( ', ' ) + isAre + 'typing...';
	};

	useEffect( () => {
		socket.on( 'room-typing', ( typingUsers ) => {
			setTyping( typingUsers );
		} );

		// eslint-disable-next-line
	}, [] );

	return (
		<div className="chat-form-container">

			{ formatTypers() !== '' &&
				<div className="typing-indicator">
					{ formatTypers() }
				</div>
			}

			<form action="#" className="chat-form" onSubmit={ handleSubmit }>
				<input type="text"
					dir="auto"
					placeholder="💬 Type your message..."
					value={ message }
					onChange={ ( e ) => setMessage( e.target.value ) }
					onKeyUp={ handleKeyUp }
					ref={ inputRef }
				/>
				<input type="submit" value="🚀" />
			</form>
		</div>
	);
}

export default ChatForm;
