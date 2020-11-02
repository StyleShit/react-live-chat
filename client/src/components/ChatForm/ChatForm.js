import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import './ChatForm.css';

function ChatForm()
{
    const [ message, setMessage ] = useState( '' );
    const [ typing, setTyping ] = useState( [] );
    const [ typeTimeout, setTypeTimeout ] = useState( null );

    const inputRef = useRef( null );
    const socket = useSocket();

    
    
    // handle form submission
    const handleSubmit = ( e ) => {

        e.preventDefault();

        // prevent empty message
        const trimmedMessage = message.trim();

        if( !trimmedMessage )
            return;

        // send message to the server
        socket.emit( 'chat-message', trimmedMessage );

        // reset the message and focus on the input
        setMessage( '' );
        inputRef.current.focus();

    };


    // handle message input keyup
    const handleKeyUp = ( e ) => {

        // don't count `enter` as typing
        if( e.keyCode === 13 )
            return;

        // user just started typing
        if( !typeTimeout )
        {
            // tell the server that the user has started typing
            socket.emit( 'start-typing' );
        }

        // user was typing till now
        else
        {
            // clear the typing timeout message
            clearTimeout( typeTimeout );
        }


        // wait till user stops typing and tell the server
        setTypeTimeout( setTimeout( () => { 

            socket.emit( 'stop-typing' ); 
            setTypeTimeout( null );

        }, 500 ));

    }


    // format `typers` array to a user friendly string
    const formatTypers = () => {

        // return only user names, without current user
        const typers = typing.reduce( ( res, u ) => {

            if( u.id !== socket.id )
                res.push( u.userName );

            return res;

        }, [] );


        // nobody is typing ( maybe except the current user )
        if( typers.length === 0 )
            return '';


        // determine if it's `is` or `are` and return
        const isAre = ( typers.length === 1 ) ? ' is ' : ' are ';

        return typers.join( ', ' ) + isAre + 'typing...';

    };


    // onmount
    useEffect( () => {

        // listen to room typers
        socket.on( 'room-typing', ( typing ) => {
            setTyping( typing );
        });

        // eslint-disable-next-line
    }, [] );


    return (
        <div className="chat-form-container">

            { formatTypers() !== '' &&
                <div className="typing-indicator">
                    { formatTypers() }
                </div>
            }

            <form action="#" className="chat-form" onSubmit={ handleSubmit }>
                <input type="text"
                    dir="auto"
                    placeholder="💬 Type your message..." 
                    value={ message } 
                    onChange={ ( e ) => { setMessage( e.target.value ); } }
                    onKeyUp={ handleKeyUp }
                    ref={ inputRef }
                />
                <input type="submit" value="🚀" />
            </form>
        </div>
    )
}

export default ChatForm;