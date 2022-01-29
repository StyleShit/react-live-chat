import React from 'react';
import './ChatTitle.css';

function ChatTitle( { room } ) {
	return (
		<div className="chat-title">
			<strong>Room: </strong>{ room }
		</div>
	);
}

export default ChatTitle;
