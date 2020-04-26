"use strict";
/**
 * MiddlewareManager.
 *
 * Use this class to use middleware pattern.
 *
 * This code is inspired in this pattern.
 * <https://github.com/waldemarnt/node-design-patterns/tree/master/examples/middleware>
 *
 * @link   <http://www.otontech.com.br>
 * @file   This files defines the MiddlewareManager class.
 * @author Antônio Vinicius.
 * @since  1.0.0
 */
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
var DataPipeline_1 = __importDefault(require("../DataPipeline"));
/** Middlewares Manager */
var MiddlewareManager = /** @class */ (function () {
    /**
     * Create a MiddlewareManager instance.
     *
     * Use this class to manager middlewares
     * using the middleware pattern.
     *
     * @constructor
     */
    function MiddlewareManager() {
        this.middlewares = [];
    }
    /**
     * Process all middlewares.
     * @access public
     * @param {any} data - Data to be processed.
     * @returns {Object} - Returns if is rejected and the processed data
     */
    MiddlewareManager.prototype.process = function (data) {
        var dataPipeline = new (DataPipeline_1.default.bind.apply(DataPipeline_1.default, __spreadArrays([void 0, data], this.middlewares)))();
        dataPipeline.dispatch();
        return { rejected: dataPipeline.rejected, data: dataPipeline.data };
    };
    /**
     * Add middleware to use list.
     * @access public
     * @param {Function} middleware - Middleware function to be added.
     */
    MiddlewareManager.prototype.use = function (middleware) {
        this.middlewares.push(middleware);
    };
    return MiddlewareManager;
}());
exports.default = MiddlewareManager;
