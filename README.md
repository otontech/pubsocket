# PubSocket

Javascript implementation of the [Publish/Subscribe](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) pattern using [socket.io](http://socket.io).

## Install

*npm*
```
npm install pubsocket
```

*yarn*
```
yarn add pubsocket
```

## Tests

*npm*
```
npm run test
```

*yarn*
```
yarn test
```

## Example Usage

### Server

```js
const {PubSocket} = require('pubsocket');

// Create PubSocket server instance
const pubSocket = PubSocket();

// Create a channel for this pubsocket
const channel = pubSocket.createChannel('ROOM');

// Add Listener to receive messages
channel.addListener((data) => {console.log(data)});

// Publish a message for all connected peers
channel.publish("Server Message: Hi.");

setTimeout(() => {
  // Disconnect the channel
  channel.disconnect();

	// Close PubSocketServer
	pubSocket.close();
}, 10000);
```

*The default port for the server is 3000.*

### Client

```js
const {PubSocketClient} = require('pubsocket');

// Create PubSocket client instance
const psClient = PubSocketClient();

// Connect the client
psClient.connect('http://localhost:3000', 'ROOM').then(() => {
	// Add Listener to receive messages
	psClient.addListener((data) => {console.log(data)});
	
	// Publish a message for channel connected peers
	psClient.publish('Client Message: Hi');

	setTimeout(() => {
		// Disconnect the client
		psClient.disconnect();
	}, 10000);
});
```

*The client need to connect to a server, if you not define the serverUrl property the Client admit http://localhost:3000/ by default.*

*The Channel Name is required.*

## Special Thanks
 ![insecure](https://secure.gravatar.com/avatar/61e4535ed769ffbf490a236696ed1d22) 
<br>[Leonardo Holanda](@Leonhcp) 
<br>*help with testing and documentation.*
