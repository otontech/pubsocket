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
/// <reference types="socket.io-client" />
/// <reference types="socket.io" />
export interface ClientData {
    data: any;
    socket: SocketIOClient.Socket;
}
/** Channel handle */
declare class Channel {
    /**
     * String Representation for this channel.
     * @access private
     * @member {String} Name
     * @memberof Channel
     */
    private name;
    /**
     * Socket for connection.
     * @access private
     * @member {SocketIO.Server} Sockets
     * @memberof Channel
     */
    private socket;
    /**
     * Connected clients.
     * @access private
     * @member {Map<string, SocketIOClient.Socket} Clients
     * @memberof Channel
     */
    private clients;
    /**
     * Listeners.
     * @access private
     * @member {Array<Function>} Listeners
     * @memberof Channel
     */
    private listeners;
    /**
     * Create a channel instance.
     * @constructor
     * @param {String} name - String Representation for this channel
     * @param {SocketIO.Server} socket - Current Socket Server
     * @todo - Create new name for connection middlewares
     * @todo - implements publish middlewares
     */
    constructor(name: String, socket: SocketIO.Server, ...middlewares: Array<Function>);
    /**
     * Register connection event.
     *
     * Based in middlewares, refuse user connection
     * or add in the connected clients list.
     *
     * @access private
     * @param {Array<Function>} middlewares - Connection Middlewares
     */
    private registerEvents;
    /**
     * Middlewares Manager.
     * @access private
     * @param {any} initialData - Initial Data for the middleware
     * @param {Array<Function>} middlewares - Connection Middlewares
     */
    private manageMiddlewares;
    /**
     * Register Middlewares.
     *
     * For Each middleware register to use.
     *
     * @access private
     * @param {Array<Function>} middlewares - Connection Middlewares
     */
    private registerMiddlewares;
    /**
     * Add channel event listener.
     * @access public
     * @param {Function} fn - Listener function
     * @todo Implements multi events channels
     * @return {Array<Function>} - All Listeners
     */
    addListener: (fn: Function) => Function[];
    /**
     * Remove channel event listener.
     * @access public
     * @param {Function} fn - Listener function
     * @todo Implements multi events channels
     * @return {Array<Function>} - All Listeners
     */
    removeListener: (fn: Function) => Function[];
    /**
     * Channel's name Getter.
     * @access public
     * @return {String} - Channel's name
     */
    getName(): String;
    /**
     * Set all clients to another channel
     * - Move all clients if client id is not defined
     * @param {string} channelName - The new channel name
     * @param {string} clientId - Client to move
     */
    moveToChannel(channelName: string, clientId?: string): void;
    /**
     * Disconnect client by id.
     * - For disconnect all clients don't pass the client id
     * @access public
     * @param {String} clientId - The client id
     * @returns {Map<string, ClientData>} - Clients Map
     */
    disconnect(clientId?: string): Map<string, ClientData>;
    /**
     * Publish message.
     * @access public
     * @param {string} event - Event to broadcast
     * @param {any} data - Data to broadcast
     */
    publish(data: any): boolean;
    /**
     * Close channel
     * @access public
     */
    close(): Promise<void>;
}
export default Channel;
