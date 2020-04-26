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
/// <reference types="node" />
import socket from 'socket.io';
import { Server } from 'http';
import Channel from '../Channel';
/** The entry point for PubSocket Server Application */
declare class PubSocketServer {
    /**
     * Channels string array
     * @access private
     * @member {Channel} Channels
     * @memberof PubSocketServer
     */
    private channels;
    /**
     * PubSocket Server Socket instance
     * @access private
     * @member {SocketIO.Server} IO
     * @memberof PubSocketServer
     */
    io: SocketIO.Server;
    /**
     * Create a PubSocket Server instance.
     * - You can connect with another http server
     * @constructor
     * @param {Server} server - The http server
     * @param {number} port - Port to run the server
     */
    constructor(server?: Server, port?: number);
    /**
     * Get channels list
     * @return {Array<Channel>} - All channels list
     */
    getChannels(): Array<Channel>;
    /**
     * Get channel by name
     * @access public
     * @param {String} channelName - The channel name
     * @return {Channel | null} - Channel instance
     */
    getChannel(channelName: String): Channel | null;
    /**
     * Get socket
     * @return {SocketIO.Server} - Socket instance
     */
    getSocket: () => socket.Server;
    /**
     * Clear all channels
     * @access public
     * @return {boolean} - It's clear
     */
    clearChannels(): boolean;
    /**
     * Add new channel in channels list.
     * - The channel must be unique.
     * - The channel's name must be unique.
     * @param {Channel} channel - The channel to be added
     * @access public
     * @return {Array<Channels> | null} - All Channel's list
     */
    addChannel(channel: Channel): Array<Channel> | null;
    /**
     * Create a new Channel instance.
     * - The name must be unique
     * @access public
     * @param {String} channelName - Name for the channel
     * @param {Array<Function>} middlewares
     * @return {Array<Channels> | null} - Created Channel
     */
    createChannel: (channelName: String, ...middlewares: Function[]) => Channel | null;
    /**
     * Verify if channel is valid.
     * @access public
     * @param {Channel} channel - The channel to be verified
     */
    isValidChannel: (channel: Channel) => void;
    /**
     * Get all channels names
     * @access public
     * @return {Array<String>} - All channels names
     */
    getChannelsNames: () => String[];
    /**
     * Stop PubSocket Server
     * @access public
     */
    close(): Promise<void>;
}
export default PubSocketServer;
