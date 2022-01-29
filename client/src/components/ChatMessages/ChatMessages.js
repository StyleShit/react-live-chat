import React, { useRef, useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import './ChatMessages.css';

function ChatMessages( { messages } ) {
	const socket = useSocket();
	const id = socket.id;

	const ref = useRef( null );

	// Auto scroll on new messages.
	useEffect( () => {
		ref.current.scrollTop = ref.current.scrollHeight;
	}, [ messages ] );

	return (
		<div className="chat-messages" ref={ ref }>

			{
				// TODO: create different component for message
				messages.map( ( { author, time, message }, i ) => {
					const formattedTime = new Date( time ).toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit' } );

					const chatbotClass = author.id === -1 ? 'message-chatbot' : '';
					const inOutClass = author.id === id ? 'message-out' : 'message-in';

					return (
						<div className={ `message ${ inOutClass } ${ chatbotClass }` } key={ i }>

							{ author.id !== id &&
                                <span className="message-author">{ author.userName }</span>
							}

							<div className="message-content" dir="auto">
								{ message }
							</div>

							<span className="message-time">{ formattedTime }</span>

						</div>
					);
				} )
			}

		</div>
	);
}

export default ChatMessages;
