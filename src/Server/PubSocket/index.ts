/**
 * PubSocket Server Controls.
 *
 * Use this class to create a PubSocket Server.
 *
 * @link   <http://www.otontech.com.br>
 * @file   This files defines the PubSocketServer class.
 * @author Antônio Vinicius.
 * @since  1.0.0
 */

import socket from 'socket.io';
import url from 'url';
import { Server } from 'http';

import Channel from '../Channel';

/** The entry point for PubSocket Server Application */
class PubSocketServer {
	/** 
	 * Channels string array
	 * @access private
	 * @member {Channel} Channels
	 * @memberof PubSocketServer
	 */
	private channels: Array<Channel>;

	/**
	 * PubSocket Server Socket instance
	 * @access private
	 * @member {SocketIO.Server} IO
	 * @memberof PubSocketServer
	 */
	public io: SocketIO.Server;

	/**
	 * Create a PubSocket Server instance.
	 * - You can connect with another http server
	 * @constructor
	 * @param {Server} server - The http server
	 * @param {number} port - Port to run the server
	 */
	public constructor(server?: Server, port?: number) {
		this.channels = [];
		this.io = socket(server);
		this.io.sockets.on('connection', (socket) => {
			const { ns } = url.parse(socket.handshake.url, true).query;

			this.io.of(`/CHANNEL_${ns}`).on('connection', (socket) => {
				if (!this.getChannelsNames().includes(ns?.toString() || '')) {
					socket.emit('connection_refused', 'This channel does not exits');
					socket.disconnect();
				}
			})
		});
		if (!server)
			this.io.listen(port || 3000);
	}

	/**
	 * Get channels list
	 * @return {Array<Channel>} - All channels list
	 */
	public getChannels(): Array<Channel> {
		return this.channels;
	}

	/**
	 * Get channel by name
	 * @access public
	 * @param {String} channelName - The channel name
	 * @return {Channel | null} - Channel instance
	 */
	public getChannel(channelName: String): Channel | null {
		const channels = this.channels.filter((channel) => channel.getName() === channelName);
		if (channels.length <= 0)
			return null;
		else
			return channels[0];
	}

	/**
	 * Get socket
	 * @return {SocketIO.Server} - Socket instance
	 */
	public getSocket = (): SocketIO.Server => {
		return this.io;
	}

	/**
	 * Clear all channels
	 * @access public
	 * @return {boolean} - It's clear
	 */
	public clearChannels() {
		this.channels.forEach((v) => v.close());
		this.channels = [];
		return this.channels.length === 0;
	}

	/**
	 * Add new channel in channels list.
	 * - The channel must be unique.
	 * - The channel's name must be unique.
	 * @param {Channel} channel - The channel to be added
	 * @access public
	 * @return {Array<Channels> | null} - All Channel's list 
	 */
	public addChannel(channel: Channel): Array<Channel> | null {
		try {
			this.isValidChannel(channel);
			this.channels.push(channel);
			console.log(`PubSocket: The channel (${channel.getName()}) is added successfully.`);
			return this.channels;
		} catch (e) {
			return null;
		}
	}

	/**
	 * Create a new Channel instance.
	 * - The name must be unique
	 * @access public
	 * @param {String} channelName - Name for the channel
	 * @param {Array<Function>} middlewares
	 * @return {Array<Channels> | null} - Created Channel
	 */
	public createChannel = (channelName: String, ...middlewares: Array<Function>): Channel | null => {
		const channel = new Channel(channelName, this.getSocket(), ...middlewares);
		try {
			this.addChannel(channel);
			return channel;
		} catch (e) {
			return null;
		}
	}

	/**
	 * Verify if channel is valid.
	 * @access public
	 * @param {Channel} channel - The channel to be verified
	 */
	public isValidChannel = (channel: Channel) => {
		if (this.getChannelsNames().includes(channel.getName()))
			throw new Error('Already exist a channel with this name.');
		else if (this.channels.includes(channel))
			throw new Error('This channel already exists.');
	}

	/**
	 * Get all channels names
	 * @access public
	 * @return {Array<String>} - All channels names
	 */
	public getChannelsNames = (): Array<String> => {
		return this.channels.map(channel => channel.getName());
	}

	/**
	 * Stop PubSocket Server
	 * @access public
	 */
	public async close(): Promise<void> {
		return this.io.close();
	}
}

export default PubSocketServer;