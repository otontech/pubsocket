/**
 * PubSocket Client Controls.
 *
 * Use this class to handle clients functions.
 *
 * @link   <http://www.otontech.com.br>
 * @file   This files defines the PubSocketClient class.
 * @author Antônio Vinicius.
 * @since  1.0.0
 */
/// <reference types="socket.io-client" />
/** PubSocket Client Application */
declare class PubSocketClient {
    /**
     * PubSocket Client socket instance.
     * @access public
     * @member {SocketIOClient.Socket} Socket
     * @memberof PubSocketClient
     */
    socket: SocketIOClient.Socket | undefined | null;
    /**
     * Client data
     * @access public
     * @member {any} Data
     * @memberof PubSocketClient
     */
    data?: any;
    /**
     * Set channel listener
     * @access private
     * @member {Function} SetChannelListener
     * @memberof PubSocketClient
     */
    private setChannelListener;
    /**
     * Server Url
     * @access public
     * @member {String} ServerUrl
     * @memberof PubSocketClient
     */
    serverUrl: String | undefined | null;
    /**
     * Listeners
     * @access private
     * @member {Array<Function>} Listeners
     * @memberof PubSocketClient
     */
    private listeners;
    /**
     * Create a PubSocket Client instance.
     * @constructor
     */
    constructor();
    /**
     * Add Listener to the client.
     * @access public
     * @param {Function} fn - Listener function
     * @returns {Array<Function> | boolean} - Listeners list
     */
    addListener(fn: Function): Array<Function> | boolean;
    /**
     * Remove Listener to the client
     * @access public
     * @param {Function} fn - Listener function
     * @returns {Array<Function> | null} - Listeners list
     */
    removeListener(fn: Function): Array<Function> | null;
    /**
     * Clear all client event listener.
     * @access public
     * @returns {Array<Function> | null} - Listeners list
     */
    clearListeners(): Array<Function> | null;
    /**
     * Change the client channel.
     * @access public
     * @param {String} channelName - Channel to be connected
     * @returns {Promise<boolean>} - Set channel successfully
     */
    setChannel(channelName: String): Promise<boolean>;
    /**
     * Publish a message.
     * @access public
     * @param {any} data - Data to broadcast
     * @returns {boolean} - Published
     */
    publish: (data: any) => boolean;
    /**
     * Connect the client.
     * @access public
     * @param {String} serverUrl - The server url
     * @param {String} channelName - The channels name
     * @returns {Promise<string>} - Returns connection state as promise
     */
    connect: (serverUrl: String, channelName: String) => Promise<string>;
    /**
     * Add on set channel listener
     * @access public
     * @param {Function} fn - Listener function
     */
    onSetChannel(fn: Function): void;
    /**
     * Is connected.
     * @access public
     * @returns {boolean} - Client is connected
     */
    isConnected(): boolean;
    /**
     * Disconnect Client
     * @access public
     * @returns {Promise<boolean>} - is Disconnected
     */
    disconnect(): Promise<boolean>;
}
export default PubSocketClient;
