"use strict";
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
var config_1 = require("../PubSocket/config");
var MiddlewareManager_1 = __importDefault(require("../MiddlewareManager"));
/** Channel handle */
var Channel = /** @class */ (function () {
    /**
     * Create a channel instance.
     * @constructor
     * @param {String} name - String Representation for this channel
     * @param {SocketIO.Server} socket - Current Socket Server
     * @todo - Create new name for connection middlewares
     * @todo - implements publish middlewares
     */
    function Channel(name, socket) {
        var _this = this;
        var middlewares = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            middlewares[_i - 2] = arguments[_i];
        }
        /**
         * Add channel event listener.
         * @access public
         * @param {Function} fn - Listener function
         * @todo Implements multi events channels
         * @return {Array<Function>} - All Listeners
         */
        this.addListener = function (fn) {
            _this.clients.forEach(function (_a) {
                var socket = _a.socket;
                socket.on(config_1.EVENT, fn);
            });
            _this.listeners.push(fn);
            return _this.listeners;
        };
        /**
         * Remove channel event listener.
         * @access public
         * @param {Function} fn - Listener function
         * @todo Implements multi events channels
         * @return {Array<Function>} - All Listeners
         */
        this.removeListener = function (fn) {
            _this.clients.forEach(function (_a) {
                var socket = _a.socket;
                socket.off(config_1.EVENT, fn);
            });
            _this.listeners = _this.listeners.filter(function (listener) { return listener !== fn; });
            return _this.listeners;
        };
        this.clients = new Map();
        this.listeners = [];
        this.name = name;
        this.socket = socket.of("/CHANNEL_" + name);
        this.registerEvents.apply(this, middlewares);
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
    Channel.prototype.registerEvents = function () {
        var _this = this;
        var middlewares = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            middlewares[_i] = arguments[_i];
        }
        this.socket.on('connection', function (socket) {
            var _a = _this.manageMiddlewares.apply(_this, __spreadArrays([{ id: socket.id }], middlewares)), rejected = _a.rejected, data = _a.data;
            if (rejected) {
                socket.emit('connection_refused', data.reason);
                socket.disconnect();
            }
            else {
                _this.clients.set(socket.id, { data: data, socket: socket });
                _this.listeners.forEach(function (listener) { socket.on(config_1.EVENT, listener); });
                socket.on(config_1.EVENT, function (data) { _this.publish(data); });
                socket.emit('connected', data);
            }
        });
    };
    /**
     * Middlewares Manager.
     * @access private
     * @param {any} initialData - Initial Data for the middleware
     * @param {Array<Function>} middlewares - Connection Middlewares
     */
    Channel.prototype.manageMiddlewares = function (initialData) {
        var middlewares = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            middlewares[_i - 1] = arguments[_i];
        }
        var middlewareManager = new MiddlewareManager_1.default();
        this.registerMiddlewares.apply(this, __spreadArrays([middlewareManager], middlewares));
        return middlewareManager.process(initialData);
    };
    /**
     * Register Middlewares.
     *
     * For Each middleware register to use.
     *
     * @access private
     * @param {Array<Function>} middlewares - Connection Middlewares
     */
    Channel.prototype.registerMiddlewares = function (middlewareManager) {
        var middlewares = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            middlewares[_i - 1] = arguments[_i];
        }
        middlewares.forEach(function (fn) { return middlewareManager.use(fn); });
    };
    /**
     * Channel's name Getter.
     * @access public
     * @return {String} - Channel's name
     */
    Channel.prototype.getName = function () {
        return this.name;
    };
    /**
     * Set all clients to another channel
     * - Move all clients if client id is not defined
     * @param {string} channelName - The new channel name
     * @param {string} clientId - Client to move
     */
    Channel.prototype.moveToChannel = function (channelName, clientId) {
        if (clientId) {
            var socket = (this.clients.get(clientId) || {}).socket;
            if (socket) {
                socket.emit('set_channel', channelName);
                socket.disconnect();
                this.clients.delete(clientId);
            }
            else {
                throw new Error("The client id is incorrect.");
            }
        }
        else {
            this.socket.emit('set_channel', channelName);
        }
    };
    /**
     * Disconnect client by id.
     * - For disconnect all clients don't pass the client id
     * @access public
     * @param {String} clientId - The client id
     * @returns {Map<string, ClientData>} - Clients Map
     */
    Channel.prototype.disconnect = function (clientId) {
        if (clientId) {
            var socket = (this.clients.get(clientId) || {}).socket;
            if (socket) {
                socket.disconnect();
                this.clients.delete(clientId);
            }
            else {
                throw new Error("The client id is incorrect.");
            }
        }
        else {
            this.clients.forEach(function (_a) {
                var socket = _a.socket;
                return socket.disconnect();
            });
            this.clients = new Map();
        }
        return this.clients;
    };
    /**
     * Publish message.
     * @access public
     * @param {string} event - Event to broadcast
     * @param {any} data - Data to broadcast
     */
    Channel.prototype.publish = function (data) {
        return this.socket.emit(config_1.EVENT, data);
    };
    /**
     * Close channel
     * @access public
     */
    Channel.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.clients.forEach(function (_a) {
                            var socket = _a.socket;
                            socket.disconnect();
                        });
                        this.clients = new Map();
                        this.listeners = [];
                        this.socket.removeAllListeners();
                        return [4 /*yield*/, this.socket.server.close()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Channel;
}());
exports.default = Channel;
