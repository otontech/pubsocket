/**
 * Channel Controls.
 *
 * Use this class to create channels for the PubSocket.
 *
 * @link   <http://www.otontech.com.br>
 * @file   This files defines the Channel class.
 * @author Antônio Vinicius.
 * @since  1.0.0
 */

import { EVENT } from '../PubSocket/config';
import MiddlewareManager from '../MiddlewareManager';

export interface ClientData {
	data: any,
	socket: SocketIOClient.Socket
}

/** Channel handle */
class Channel {
	/**
	 * String Representation for this channel.
	 * @access private
	 * @member {String} Name
	 * @memberof Channel
	 */
	private name: String;

	/**
	 * Socket for connection.
	 * @access private
	 * @member {SocketIO.Server} Sockets
	 * @memberof Channel
	 */
	private socket: SocketIO.Namespace;

	/**
	 * Connected clients.
	 * @access private
	 * @member {Map<string, SocketIOClient.Socket} Clients
	 * @memberof Channel
	 */
	private clients: Map<string, ClientData>;

	/**
	 * Listeners.
	 * @access private
	 * @member {Array<Function>} Listeners
	 * @memberof Channel
	 */
	private listeners: Array<Function>;

	/**
	 * Create a channel instance.
	 * @constructor
	 * @param {String} name - String Representation for this channel
	 * @param {SocketIO.Server} socket - Current Socket Server
	 * @todo - Create new name for connection middlewares
	 * @todo - implements publish middlewares
	 */
	public constructor(name: String, socket: SocketIO.Server, ...middlewares: Array<Function>) {
		this.clients = new Map();
		this.listeners = [];
		this.name = name;
		this.socket = socket.of(`/CHANNEL_${name}`);
		this.registerEvents(...middlewares);
	}

	/**
	 * Register connection event.
	 * 
	 * Based in middlewares, refuse user connection
	 * or add in the connected clients list.
	 * 
	 * @access private
	 * @param {Array<Function>} middlewares - Connection Middlewares
	 */
	private registerEvents(...middlewares: Array<Function>) {
		this.socket.on('connection', (socket: SocketIOClient.Socket) => {
			const { rejected, data } = this.manageMiddlewares({ id: socket.id }, ...middlewares);
			if (rejected) {
				socket.emit('connection_refused', data.reason);
				socket.disconnect();
			} else {
				this.clients.set(socket.id, { data, socket });
				this.listeners.forEach((listener) => { socket.on(EVENT, listener) });
				socket.on(EVENT, (data: any) => { this.publish(data); });
				socket.emit('connected', data);
			}
		})
	}

	/**
	 * Middlewares Manager.
	 * @access private
	 * @param {any} initialData - Initial Data for the middleware 
	 * @param {Array<Function>} middlewares - Connection Middlewares 
	 */
	private manageMiddlewares(initialData: any, ...middlewares: Array<Function>) {
		const middlewareManager = new MiddlewareManager();
		this.registerMiddlewares(middlewareManager, ...middlewares);
		return middlewareManager.process(initialData);
	}

	/**
	 * Register Middlewares.
	 * 
	 * For Each middleware register to use.
	 * 
	 * @access private
	 * @param {Array<Function>} middlewares - Connection Middlewares
	 */
	private registerMiddlewares(middlewareManager: MiddlewareManager, ...middlewares: Array<Function>) {
		middlewares.forEach((fn) => middlewareManager.use(fn));
	}

	/**
	 * Add channel event listener.
	 * @access public
	 * @param {Function} fn - Listener function
	 * @todo Implements multi events channels
	 * @return {Array<Function>} - All Listeners
	 */
	public addListener = (fn: Function) => {
		this.clients.forEach(({ socket }) => { socket.on(EVENT, fn) });
		this.listeners.push(fn);
		return this.listeners;
	}

	/**
	 * Remove channel event listener.
	 * @access public
	 * @param {Function} fn - Listener function
	 * @todo Implements multi events channels
	 * @return {Array<Function>} - All Listeners
	 */
	public removeListener = (fn: Function) => {
		this.clients.forEach(({ socket }) => { socket.off(EVENT, fn) });
		this.listeners = this.listeners.filter((listener) => listener !== fn);
		return this.listeners;
	}

	/**
	 * Channel's name Getter.
	 * @access public
	 * @return {String} - Channel's name
	 */
	public getName(): String {
		return this.name;
	}

	/**
	 * Set all clients to another channel
	 * - Move all clients if client id is not defined 
	 * @param {string} channelName - The new channel name
	 * @param {string} clientId - Client to move
	 */
	public moveToChannel(channelName: string, clientId?: string) {
		if (clientId) {
			const { socket } = this.clients.get(clientId) || {};
			if (socket) {
				socket.emit('set_channel', channelName);
				socket.disconnect();
				this.clients.delete(clientId);
			} else {
				throw new Error("The client id is incorrect.");
			}
		} else {
			this.socket.emit('set_channel', channelName);
		}
	}

	/**
	 * Disconnect client by id.
	 * - For disconnect all clients don't pass the client id
	 * @access public
	 * @param {String} clientId - The client id
	 * @returns {Map<string, ClientData>} - Clients Map
	 */
	public disconnect(clientId?: string): Map<string, ClientData> {
		if (clientId) {
			const { socket } = this.clients.get(clientId) || {};
			if (socket) {
				socket.disconnect();
				this.clients.delete(clientId);
			} else {
				throw new Error("The client id is incorrect.");
			}
		} else {
			this.clients.forEach(({ socket }) => socket.disconnect());
			this.clients = new Map();
		}
		return this.clients;
	}

	/**
	 * Publish message.
	 * @access public
	 * @param {string} event - Event to broadcast
	 * @param {any} data - Data to broadcast
	 */
	public publish(data: any) {
		return this.socket.emit(EVENT, data);
	}

	/**
	 * Close channel
	 * @access public
	 */
	public async close(): Promise<void> {
		this.clients.forEach(({ socket }) => { socket.disconnect() });
		this.clients = new Map();
		this.listeners = [];
		this.socket.removeAllListeners();
		return await this.socket.server.close();
	}
}

export default Channel;