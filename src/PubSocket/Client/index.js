"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_client_1 = __importDefault(require("socket.io-client"));
var config_1 = require("../config");
/** PubSocket Client Application */
var PubSocketClient = /** @class */ (function () {
    /**
     * Create a PubSocket Client instance.
     * @constructor
     * @param {String} server_url - The PubSocket Server url
     * @param {String} channel_name - Channel to connect
     */
    function PubSocketClient() {
        var _this = this;
        /**
         * Publish a message.
         * @access public
         * @param {String} event - Event to broadcast
         * @param {any} data - Data to broadcast
         * @returns {boolean} - Published
         */
        this.publish = function (data) {
            var _a;
            if (!_this.is_connected())
                return false;
            (_a = _this.socket) === null || _a === void 0 ? void 0 : _a.emit(config_1.EVENT, data);
            return true;
        };
        /**
         * Connect the client.
         * @access public
         * @param {String} server_url - The server url
         * @param {String} channel_name - The channels name
         * @returns {Promise<string>} - Returns connection state as promise
         */
        this.connect = function (server_url, channel_name) { return __awaiter(_this, void 0, void 0, function () {
            var socket;
            var _this = this;
            return __generator(this, function (_a) {
                socket = socket_io_client_1.default.connect(server_url + "/CHANNEL_" + channel_name, { forceNew: true, query: "ns=" + channel_name });
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        socket.on('disconnect', function () {
                            reject("Disconnected from: " + channel_name);
                        });
                        socket.on('connection_refused', function (reason) {
                            reject("Connection refused, reason: " + reason);
                        });
                        socket.on('set_channel', function (channel_name) { return __awaiter(_this, void 0, void 0, function () {
                            var success;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.set_channel(channel_name)];
                                    case 1:
                                        success = _a.sent();
                                        this._listeners.forEach(function (v) { var _a; return (_a = _this.socket) === null || _a === void 0 ? void 0 : _a.on(config_1.EVENT, v); });
                                        this._set_channel_listener(success, channel_name);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        socket.on('connected', function (data) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        socket.off('connect');
                                        if (!this.is_connected()) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.disconnect()];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        this.socket = socket;
                                        this.data = data;
                                        this.server_url = server_url;
                                        resolve();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            });
        }); };
        this._listeners = new Array();
        this._set_channel_listener = function () { };
    }
    /**
     * Add Listener to the client.
     * @access public
     * @param {Function} fn - Listener function
     * @returns {Array<Function> | boolean} - Listeners list
     */
    PubSocketClient.prototype.add_listener = function (fn) {
        var _a;
        if (!this.is_connected())
            return false;
        this._listeners.push(fn);
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.on(config_1.EVENT, fn);
        return this._listeners;
    };
    /**
     * Remove Listener to the client
     * @access public
     * @param {Function} fn - Listener function
     * @returns {Array<Function> | null} - Listeners list
     */
    PubSocketClient.prototype.remove_listener = function (fn) {
        var _a;
        if (!this.is_connected())
            return null;
        this._listeners = this._listeners.filter(function (l) { return l !== fn; });
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.off(config_1.EVENT, fn);
        return this._listeners;
    };
    /**
     * Clear all client event listener.
     * @access public
     * @returns {Array<Function> | null} - Listeners list
     */
    PubSocketClient.prototype.clear_listeners = function () {
        var _a;
        if (!this.is_connected())
            return null;
        this._listeners = new Array();
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.off(config_1.EVENT);
        return this._listeners;
    };
    /**
     * Change the client channel.
     * @access public
     * @param {String} channel_name - Channel to be connected
     * @returns {Promise<boolean>} - Set channel successfully
     */
    PubSocketClient.prototype.set_channel = function (channel_name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.is_connected())
                    return [2 /*return*/, false];
                return [2 /*return*/, this.connect(this.server_url || '', channel_name)
                        .then(function () {
                        return true;
                    }).catch(function () {
                        return false;
                    })];
            });
        });
    };
    /**
     * Add on set channel listener
     * @access public
     * @param {Function} fn - Listener function
     */
    PubSocketClient.prototype.on_set_channel = function (fn) {
        this._set_channel_listener = fn;
    };
    /**
     * Is connected.
     * @access public
     * @returns {boolean} - Client is connected
     */
    PubSocketClient.prototype.is_connected = function () {
        return this.socket ? this.socket.connected : false;
    };
    /**
     * Disconnect Client
     * @access public
     * @returns {Promise<boolean>} - is Disconnected
     */
    PubSocketClient.prototype.disconnect = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.is_connected())
                            return [2 /*return*/, false];
                        this.clear_listeners();
                        return [4 /*yield*/, ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.disconnect())];
                    case 1:
                        _b.sent();
                        this.socket = null;
                        this.data = null;
                        this.server_url = null;
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return PubSocketClient;
}());
exports.default = PubSocketClient;
