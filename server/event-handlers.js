// default chat bot props
const CHAT_BOT = {
    userName: 'ChatBot',
    id: -1
};

// handle rooms data
let rooms = [];

// handle users data
let users = [];


// handle incoming connections
exports.handleConnection = ( socket ) => {

    console.log( 'New connection: ', socket.id );

};


// handle join room
exports.handleJoinRoom = ( socket, { userName, room } ) => {

    // user-related actions
    addUser( userName, socket );
    addUserToRoom( socket, room );
    sendHistoryToUser( socket, room );

    // room-related actions
    sendMessageToRoom( `${ userName } has joined the room`, room );
    sendMessageToRoom( `Welcome ${ userName }!`, room );

};


// handle new chat message
exports.handleChatMessage = ( socket, message ) => {

    // get the sender room
    const room = users[socket.id].room;

    // send their message to the room
    sendMessageToRoom( message, room, users[socket.id] );

};


// handle user started typing
exports.handleStartTyping = ( socket ) => {

    setUserTyping( socket );

}


// handle user stopped typing
exports.handleStopTyping = ( socket ) => {

    setUserNotTyping( socket );

}


// handle disconnect
exports.handleDisconnect = ( socket ) => {

    if( !users[socket.id] )
        return;

    // remove user from users array and from their associated room
    const associatedRoom = users[socket.id].room;

    removeUserFromRoom( socket, associatedRoom );
    removeUser( socket );

};



/**
 * Utils
 */



// add user to users array
const addUser = ( userName, socket ) => {
    
    users[socket.id] = { 
        userName,
        id: socket.id
    };

}


// remove user from users array
const removeUser = ( socket ) => {
    
    delete users[socket.id];

}


// add user as a participant to rooms array
const addUserToRoom = ( socket, room ) => {
    
    // get user name from users array
    const userName = users[socket.id].userName;

    // set the user's room to the current selected room
    users[socket.id].room = room;

    // join user to room over socket
    socket.join( room );


    // set default values for room
    if( !rooms[room] )
    {
        rooms[room] = {

            participants: [],
            messagesHistory: [],
            typing: []
            
        };
    }

    // add the user to the appropriate room in rooms array
    rooms[room].participants.push({ userName, id: socket.id });

    // notify other room participants that a new user has joined
    const { io } = require( './index' );
    io.to( socket.id ).emit( 'joined-room', { room } );
    io.to( room ).emit( 'chat-participants', rooms[room].participants || [] );

}


// remove user from rooms array
const removeUserFromRoom = ( socket, room ) => {

    if( rooms[room] )
    {
        // iterate over room participants and remove the user
        const tmp = rooms[room].participants.filter( u => {
            return u.id !== socket.id;
        });

        rooms[room].participants = tmp;

        const { io } = require( './index' );
        io.to( room ).emit( 'chat-participants', rooms[room].participants || [] );
    }

}


// send message to room and push it to history
const sendMessageToRoom = ( message, room, user = CHAT_BOT ) => {

    // create message object
    const messageObject = formatMessage( message, user );

    // send the message to the room
    const { io } = require( './index' );
    io.to( room ).emit( 'chat-message', messageObject );

    // push the message to the history array
    rooms[room].messagesHistory.push( messageObject );

};


// send room messages history to user
const sendHistoryToUser = ( socket, room ) => {

    // get history or return an empty array
    const history = rooms[room].messagesHistory || [];

    // send the history array
    const { io } = require( './index' );
    io.to( socket.id ).emit( 'chat-history', history );

}


// format message string to message object
const formatMessage = ( message, user = CHAT_BOT ) => {

    return { 
        message, 
        author: user,
        time: new Date() 
    };

}


// add user to typing array
const setUserTyping = ( socket, notify = true ) => {

    // remove user from typing array
    setUserNotTyping( socket, false );

    // get user & room
    const user = users[socket.id];
    const room = user.room;

    // push user to typing array
    rooms[room].typing.push( user );

    // notify room
    notify && notifyTypingToRoom( room );

};


// remove user from typing array
const setUserNotTyping = ( socket, notify = true ) => {

    // get user & room
    const user = users[socket.id];
    const room = user.room;

    // remove user from typing array
    rooms[room].typing = rooms[room].typing.filter( i => ( i.id !== socket.id ));

    // notify room
    notify && notifyTypingToRoom( room );

};


// notify room about who is typing
const notifyTypingToRoom = ( room ) => {

    // send the typing array to the room
    const { io } = require( './index' );
    io.to( room ).emit( 'room-typing', rooms[room].typing );

};