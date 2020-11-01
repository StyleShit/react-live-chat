const express = require( 'express' );
const io = require( 'socket.io' )();


// init the express server
const app = express();

app.get( '/', ( req, res ) => {
    res.send( 'It Works!' );
});


// listen to incoming HTTP connections
const server = app.listen( 3001, () => {

    console.log( 'Express server is running...' );

});


// attach the socket.io server to the express server
io.listen( server );


// handle new socket connection
io.on( 'connection', socket => {

    console.log( 'New connection:', socket.id );
    socket.emit( 'message', `Hello there, seems like it's working` );

})