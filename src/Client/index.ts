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

import io from 'socket.io-client';
import { EVENT } from '../Server/PubSocket/config';

/** PubSocket Client Application */
class PubSocketClient {
	/**
	 * PubSocket Client socket instance.
	 * @access public
	 * @member {SocketIOClient.Socket} Socket
	 * @memberof PubSocketClient
	 */
	public socket: SocketIOClient.Socket | undefined | null;

	/**
	 * Client data
	 * @access public
	 * @member {any} Data
	 * @memberof PubSocketClient
	 */
	public data?: any;

	/**
	 * Set channel listener
	 * @access private
	 * @member {Function} SetChannelListener
	 * @memberof PubSocketClient
	 */
	private setChannelListener: Function;

	/**
	 * Server Url
	 * @access public
	 * @member {String} ServerUrl
	 * @memberof PubSocketClient
	 */
	public serverUrl: String | undefined | null;

	/**
	 * Listeners
	 * @access private
	 * @member {Array<Function>} Listeners
	 * @memberof PubSocketClient
	 */
	private listeners: Array<Function>;

	/**
	 * Create a PubSocket Client instance.
	 * @constructor
	 */
	public constructor() {
		this.listeners = [];
		this.setChannelListener = () => { };
	}

	/**
	 * Add Listener to the client.
	 * @access public
	 * @param {Function} fn - Listener function
	 * @returns {Array<Function> | boolean} - Listeners list
	 */
	public addListener(fn: Function): Array<Function> | boolean {
		if (!this.isConnected()) return false;
		this.listeners.push(fn);
		this.socket?.on(EVENT, fn);
		return this.listeners;
	}

	/**
	 * Remove Listener to the client
	 * @access public
	 * @param {Function} fn - Listener function
	 * @returns {Array<Function> | null} - Listeners list
	 */
	public removeListener(fn: Function): Array<Function> | null {
		if (!this.isConnected()) return null;
		this.socket?.off(EVENT, fn);
		this.listeners = this.listeners.filter((l) => l !== fn);
		return this.listeners;
	}

	/**
	 * Clear all client event listener.
	 * @access public
	 * @returns {Array<Function> | null} - Listeners list
	 */
	public clearListeners(): Array<Function> | null {
		if (!this.isConnected()) return null;
		this.socket?.off(EVENT);
		this.listeners = [];
		return this.listeners;
	}

	/**
	 * Change the client channel.
	 * @access public
	 * @param {String} channelName - Channel to be connected
	 * @returns {Promise<boolean>} - Set channel successfully
	 */
	public async setChannel(channelName: String): Promise<boolean> {
		if (!this.isConnected()) return false;
		return this.connect(this.serverUrl || '', channelName)
			.then(() => {
				return true;
			}).catch(() => {
				return false;
			});
	}

	/**
	 * Publish a message.
	 * @access public
	 * @param {any} data - Data to broadcast
	 * @returns {boolean} - Published
	 */
	public publish = (data: any) => {
		if (!this.isConnected()) return false;
		this.socket?.emit(EVENT, data);
		return true;
	}

	/**
	 * Connect the client.
	 * @access public
	 * @param {String} serverUrl - The server url
	 * @param {String} channelName - The channels name
	 * @returns {Promise<string>} - Returns connection state as promise
	 */
	public connect = async (serverUrl: String, channelName: String): Promise<string> => {
		const socket = io.connect(`${serverUrl}/CHANNEL_${channelName}`, { forceNew: true, query: `ns=${channelName}` });
		return new Promise((resolve, reject) => {
			socket.on('disconnect', () => {
				reject(`Disconnected from: ${channelName}`);
			});
			socket.on('connection_refused', (reason: any) => {
				reject(`Connection refused, reason: ${reason}`);
			});
			socket.on('set_channel', async (channelName: string) => {
				const success = await this.setChannel(channelName);
				this.listeners.forEach((v) => this.socket?.on(EVENT, v));
				this.setChannelListener(success, channelName);
			});
			socket.on('connected', async (data: any) => {
				socket.off('connect');
				if (this.isConnected()) await this.disconnect();
				this.socket = socket;
				this.data = data;
				this.serverUrl = serverUrl;
				resolve();
			});
		});
	}

	/**
	 * Add on set channel listener
	 * @access public
	 * @param {Function} fn - Listener function
	 */
	public onSetChannel(fn: Function) {
		this.setChannelListener = fn;
	}

	/**
	 * Is connected.
	 * @access public
	 * @returns {boolean} - Client is connected
	 */
	public isConnected() {
		return this.socket ? this.socket.connected : false;
	}

	/**
	 * Disconnect Client
	 * @access public
	 * @returns {Promise<boolean>} - is Disconnected
	 */
	public async disconnect(): Promise<boolean> {
		if (!this.isConnected()) return false;
		this.clearListeners();
		await this.socket?.disconnect();
		this.socket = null;
		this.data = null;
		this.serverUrl = null;
		return true;
	}
}

export default PubSocketClient;