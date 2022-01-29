import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

export default function useChat() {
	const [ messages, setMessages ] = useState( [] );
	const [ participants, setParticipants ] = useState( [] );

	const socket = useSocket();

	useEffect( () => {
		socket.on( 'chat-history', ( history ) => {
			setMessages( history );
		} );

		socket.on( 'chat-message', ( message ) => {
			setMessages( ( prev ) => {
				return [ ...prev, message ];
			} );
		} );

		socket.on( 'chat-participants', ( chatParticipants ) => {
			setParticipants( chatParticipants );
		} );

		return () => {
			socket.disconnect();
		};

		// eslint-disable-next-line
	}, [] );

	return {
		messages,
		participants,
	};
}
