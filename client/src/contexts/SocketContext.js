import React, { useContext } from 'react';
import io from 'socket.io-client';


// create socket context
const SocketContext = React.createContext( null );

// init socket
const socket = io( 'http://localhost:3001' );


// custom hook
export const useSocket = () => {

    return useContext( SocketContext );

}


// custom socket provider
export const SocketProvider = ({ children }) => {

    return (
        <SocketContext.Provider value={ socket }>
            { children }
        </SocketContext.Provider>
    );

}