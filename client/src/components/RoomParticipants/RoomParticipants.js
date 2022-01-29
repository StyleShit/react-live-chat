import React from 'react';
import { useSocket } from '../../contexts/SocketContext';
import './RoomParticipants.css';

function RoomParticipants( { participants } ) {
	const socket = useSocket();

	return (
		<div className="room-participants">
			<h3>
                Participants:
			</h3>
			<ul>
				<li>You</li>

				{
					participants.map( ( p ) => {
						return ( p.id !== socket.id )
							? <li key={ p.id }>{ p.userName }</li>
							: null;
					} )
				}
			</ul>
		</div>
	);
}

export default RoomParticipants;
