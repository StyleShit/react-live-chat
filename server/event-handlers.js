const CHAT_BOT = {
	userName: 'ChatBot',
	id: -1,
};

const rooms = [];
const users = [];

/**
 * Handle incoming connections.
 *
 * @param {Object} socket - User's socket object.
 *
 * @returnd {void}
 */
exports.handleConnection = ( socket ) => {
	console.log( 'New connection: ', socket.id );
};

/**
 * Handle user data when joining a room.
 *
 * @param {Object} socket - User's socket object.
 * @param {Object} data - Connection data.
 *
 * @returns {void}
 */
exports.handleJoinRoom = ( socket, data ) => {
	data = ensureJSON( data );

	const { userName, room } = data;

	// user-related actions
	addUser( userName, socket );
	addUserToRoom( socket, room );
	sendHistoryToUser( socket, room );

	// room-related actions
	sendMessageToRoom( `${ userName } has joined the room`, room );
	sendMessageToRoom( `Welcome ${ userName }!`, room );
};


/**
 * Handle user data when leaving a room.
 *
 * @param {Object} socket - User's socket object.
 *
 * @returns {void}
 */
exports.handleLeaveRoom = ( socket ) => {
	const associatedRoom = users[ socket.id ].room;

	removeUserFromRoom( socket, associatedRoom );
}

/**
 * Handle new chat message.
 *
 * @param {Object} socket - User's socket object.
 * @param {string} message - User's message.
 *
 * @returns {void}
 */
exports.handleChatMessage = ( socket, message ) => {
	const room = users[ socket.id ].room;

	sendMessageToRoom( message, room, users[ socket.id ] );
};

/**
 * Handle user started typing.
 *
 * @param {Object} socket - User's socket object.
 *
 * @returns {void}
 */
exports.handleStartTyping = ( socket ) => {
	setUserTyping( socket );
};

/**
 * Handle user stopped typing.
 *
 * @param {Object} socket - User's socket object.
 *
 * @returns {void}
 */
exports.handleStopTyping = ( socket ) => {
	setUserNotTyping( socket );
};

/**
 * Handle user disconnected.
 *
 * @param {Object} socket - User's socket object.
 *
 * @returns {void}
 */
exports.handleDisconnect = ( socket ) => {
	if ( ! users[ socket.id ] )
		return;

	const associatedRoom = users[ socket.id ].room;

	removeUserFromRoom( socket, associatedRoom );
	removeUser( socket );
};

/**
 * Utils
 */

/**
 * Add user to users array.
 *
 * @param {string} userName - User's display name.
 * @param {Object} socket - User's socket object.
 *
 * @returns {void}
 */
const addUser = ( userName, socket ) => {
	users[ socket.id ] = {
		userName,
		id: socket.id,
	};
};

/**
 * Remove user from the users array.
 *
 * @param {Object} socket - User's socket object.
 *
 * @returns {void}
 */
const removeUser = ( socket ) => {
	delete users[ socket.id ];
};

/**
 * Add user as a participant in a room.
 *
 * @param {Object} socket - User's socket object.
 * @param {string} room - Room name.
 *
 * @returns {void}
 */
const addUserToRoom = ( socket, room ) => {
	const { userName } = users[ socket.id ];

	users[ socket.id ].room = room;

	socket.join( room );

	if ( ! rooms[ room ] ) {
		rooms[ room ] = {
			participants: [],
			messagesHistory: [],
			typing: [],
		};
	}

	rooms[ room ].participants.push( { userName, id: socket.id } );

	// Notify other room participants that a new user has joined
	const { io } = require( './index' );
	io.to( socket.id ).emit( 'joined-room', { room } );
	io.to( room ).emit( 'chat-participants', rooms[ room ].participants || [] );
};

/**
 * Remove user from a room.
 *
 * @param {Object} socket - User's socket object.
 * @param {string} room - Room name.
 *
 * @returns {void}
 */
const removeUserFromRoom = ( socket, room ) => {
	if ( ! rooms[ room ] ) {
		return;
	}

	rooms[ room ].participants = rooms[ room ].participants.filter( ( u ) => {
		return u.id !== socket.id;
	} );

	const { io } = require( './index' );
	io.to( room ).emit( 'chat-participants', rooms[ room ].participants || [] );
};

/**
 * Send message to room and push it to history.
 *
 * @param {string} message - Message content.
 * @param {string} room - Room name.
 * @param {Object} user - Sender data.
 *
 * @returns {void}
 */
const sendMessageToRoom = ( message, room, user = CHAT_BOT ) => {
	const messageObject = formatMessage( message, user );

	const { io } = require( './index' );
	io.to( room ).emit( 'chat-message', messageObject );

	rooms[ room ].messagesHistory.push( messageObject );
};

/**
 * Send room messages history to user.
 *
 * @param {Object} socket - User's socket object.
 * @param {string} room - Room name.
 *
 * @returns {void}
 */
const sendHistoryToUser = ( socket, room ) => {
	const history = rooms[ room ].messagesHistory || [];

	const { io } = require( './index' );
	io.to( socket.id ).emit( 'chat-history', history );
};

/**
 * Format message string to message object.
 *
 * @param {string} message - Message content.
 * @param {Object} user - User data.
 *
 * @returns {void}
 */
const formatMessage = ( message, user = CHAT_BOT ) => {
	return {
		message,
		author: user,
		time: new Date(),
	};
};

/**
 * Add user to the typers array.
 *
 * @param {Object} socket - User's socket object.
 * @param {boolean} notify - Whether to notify the room.
 *
 * @returns {void}
 */
const setUserTyping = ( socket, notify = true ) => {
	setUserNotTyping( socket, false );

	const user = users[ socket.id ];
	const { room } = user;

	rooms[ room ].typing.push( user );

	if ( notify ) {
		notifyTypingToRoom( room );
	}
};

/**
 * Remove user from the typers array.
 *
 * @param {Object} socket - User's socket object.
 * @param {boolean} notify - Whether to notify the room.
 *
 * @returns {void}
 */
const setUserNotTyping = ( socket, notify = true ) => {
	const user = users[ socket.id ];
	const { room } = user;

	rooms[ room ].typing = rooms[ room ].typing.filter( ( i ) => ( i.id !== socket.id ) );

	if ( notify ) {
		notifyTypingToRoom( room );
	}
};

/**
 * Notify a room about who is typing.
 *
 * @param {string} room - Room name.
 *
 * @returns {void}
 */
const notifyTypingToRoom = ( room ) => {
	// send the typing array to the room
	const { io } = require( './index' );
	io.to( room ).emit( 'room-typing', rooms[ room ].typing );
};

/**
 * Ensure that a JSON data from socket is an object.
 *
 * @param {Object|string} data
 *
 * @returns {Object}
 */
const ensureJSON = ( data ) => {
	return ( typeof data === 'string' ) ? JSON.parse( data ) : data;
};
