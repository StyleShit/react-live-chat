import React, { useContext } from 'react';
import io from 'socket.io-client';


// create socket context
const SocketContext = React.createContext( null );

// init socket
const socket = io( process.env.REACT_APP_SOCKET_SERVER || window.location.host );


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