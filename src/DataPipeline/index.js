"use strict";
/**
 * Data Pipe Line.
 *
 * Use this class to support middleware pattern.
 *
 * @link   <http://www.otontech.com.br>
 * @file   This files defines the DataPipeline class.
 * @author Antônio Vinicius.
 * @since  1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** DataPipeLine class */
var DataPipeline = /** @class */ (function () {
    /**
     * Create a data pipe line to process.
     * @constructor
     * @param {any} data - Data to be passed
     * @param {Array<Function>} middlewares - List of middlewares
     */
    function DataPipeline(data) {
        var _this = this;
        var middlewares = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            middlewares[_i - 1] = arguments[_i];
        }
        this._middlewares = middlewares;
        this._finished = false;
        this.rejected = false;
        data.end = function () {
            _this._finished = true;
        };
        this.data = data;
    }
    /**
     * Dispatch all middlewares and process the data.
     * @access public
     */
    DataPipeline.prototype.dispatch = function () {
        var _this = this;
        var iterator = 0;
        if (iterator < this._middlewares.length) {
            var firstMiddleware = this._middlewares[iterator];
            /**
             * Function to pass to the next middleware.
             */
            var next_1 = function () {
                iterator++;
                if (!_this._finished && iterator < _this._middlewares.length) {
                    var nextMiddleware = _this._middlewares[iterator];
                    nextMiddleware(_this.data, next_1, reject_1);
                }
                else {
                    _this.data.end();
                }
            };
            /**
             * Function to reject the pipe line.
             * @param {string} reason - Reason to reject
             */
            var reject_1 = function (reason) {
                _this.data.end();
                _this.rejected = true;
                _this.data.reason = reason;
            };
            firstMiddleware(this.data, next_1, reject_1);
        }
    };
    return DataPipeline;
}());
exports.default = DataPipeline;
