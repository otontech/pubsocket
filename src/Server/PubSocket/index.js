"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = __importDefault(require("socket.io"));
var url_1 = __importDefault(require("url"));
var Channel_1 = __importDefault(require("../Channel"));
/** The entry point for PubSocket Server Application */
var PubSocketServer = /** @class */ (function () {
    /**
     * Create a PubSocket Server instance.
     * - You can connect with another http server
     * @constructor
     * @param {Server} server - The http server
     * @param {number} port - Port to run the server
     */
    function PubSocketServer(server, port) {
        var _this = this;
        /**
         * Get socket
         * @return {SocketIO.Server} - Socket instance
         */
        this.get_socket = function () {
            return _this._io;
        };
        /**
         * Create a new Channel instance.
         * - The name must be unique
         * @access public
         * @param {String} channel_name - Name for the channel
         * @return {Array<Channels> | null} - Created Channel
         */
        this.create_channel = function (channel_name) {
            var middlewares = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                middlewares[_i - 1] = arguments[_i];
            }
            var channel = new (Channel_1.default.bind.apply(Channel_1.default, __spreadArrays([void 0, channel_name, _this.get_socket()], middlewares)))();
            try {
                _this.add_channel(channel);
                return channel;
            }
            catch (e) {
                return null;
            }
        };
        /**
         * Verify if channel is valid.
         * @access public
         * @param {Channel} channel - The channel to be verified
         */
        this.is_valid_channel = function (channel) {
            if (_this.get_channels_names().includes(channel.get_name()))
                throw new Error('Already exist a channel with this name.');
            else if (_this._channels.includes(channel))
                throw new Error('This channel already exists.');
        };
        /**
         * Get all channels names
         * @access public
         * @return {Array<String>} - All channels names
         */
        this.get_channels_names = function () {
            return _this._channels.map(function (v) { return v.get_name(); });
        };
        this._channels = [];
        this._io = socket_io_1.default(server);
        this._io.sockets.on('connection', function (socket) {
            var ns = url_1.default.parse(socket.handshake.url, true).query.ns;
            _this._io.of("/CHANNEL_" + ns).on('connection', function (socket) {
                if (!_this.get_channels_names().includes(ns.toString())) {
                    socket.emit('connection_refused', 'This channel does not exits');
                    socket.disconnect();
                }
            });
        });
        if (!server)
            this._io.listen(port || 3000);
    }
    /**
     * Get channels list
     * @return {Array<Channel>} - All channels list
     */
    PubSocketServer.prototype.get_channels = function () {
        return this._channels;
    };
    /**
     * Get channel by name
     * @access public
     * @param {String} channel_name - The channel name
     * @return {Channel | null} - Channel instance
     */
    PubSocketServer.prototype.get_channel = function (channel_name) {
        var channels = this._channels.filter(function (channel) { return channel.get_name() === channel_name; });
        if (channels.length <= 0)
            return null;
        else
            return channels[0];
    };
    /**
     * Clear all channels
     * @access public
     * @return {boolean} - It's clear
     */
    PubSocketServer.prototype.clear_channels = function () {
        this._channels.forEach(function (v) { return v.close(); });
        this._channels = new Array();
        return this._channels.length === 0;
    };
    /**
     * Add new channel in channels list.
     * - The channel must be unique.
     * - The channel's name must be unique.
     * @param {Channel} channel - The channel to be added
     * @access public
     * @return {Array<Channels> | null} - All Channel's list
     */
    PubSocketServer.prototype.add_channel = function (channel) {
        try {
            this.is_valid_channel(channel);
            this._channels.push(channel);
            console.log("PubSocket: The channel (" + channel.get_name() + ") is added successfully.");
            return this._channels;
        }
        catch (e) {
            return null;
        }
    };
    /**
     * Stop PubSocket Server
     * @access public
     */
    PubSocketServer.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._io.close()];
            });
        });
    };
    return PubSocketServer;
}());
exports.default = PubSocketServer;
