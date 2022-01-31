require( 'dotenv' ).config();

const express = require( 'express' );
const io = require( 'socket.io' )();
const PORT = process.env.PORT || 80;

const {
	handleConnection,
	handleChatMessage,
	handleJoinRoom,
	handleDisconnect,
	handleStartTyping,
	handleStopTyping,
	handleLeaveRoom
} = require( './event-handlers' );

const app = express();

app.use( express.static( './public' ) );

const server = app.listen( PORT, () => {
	console.log( `Express server is running on port ${ PORT }...` );
} );

io.listen( server, {
	cors: {
		origin: '*',
		methods: [ 'GET', 'POST' ],
	},
} );

io.on( 'connection', ( socket ) => {
	handleConnection( socket );

	socket.on( 'join-room', ( data ) => {
		handleJoinRoom( socket, data );
	} );

	socket.on( 'leave-room', ( ) => { 
		handleLeaveRoom( socket  )
	});

	socket.on( 'chat-message', ( message ) => {
		handleChatMessage( socket, message );
	} );

	socket.on( 'start-typing', () => {
		handleStartTyping( socket );
	} );

	socket.on( 'stop-typing', () => {
		handleStopTyping( socket );
	} );

	socket.on( 'disconnect', () => {
		handleDisconnect( socket );
	} );
} );

exports.io = io;
