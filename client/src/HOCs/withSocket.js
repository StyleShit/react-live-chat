import React from 'react';
import { SocketProvider } from '../contexts/SocketContext';

// wrap an element with socket provider
const withSocket = ( WrappedComponent ) => {
	return class extends React.Component {
		render() {
			return (
				<SocketProvider>
					<WrappedComponent { ...this.props } />
				</SocketProvider>
			);
		}
	};
};

export default withSocket;
