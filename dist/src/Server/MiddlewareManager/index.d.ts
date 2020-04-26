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
/** Middlewares Manager */
declare class MiddlewareManager {
    /**
     * Middlewares Array.
     * @access private
     * @member {Array<Function>} Middlewares
     * @memberof MiddlewareManager
     */
    private middlewares;
    /**
     * Create a MiddlewareManager instance.
     *
     * Use this class to manager middlewares
     * using the middleware pattern.
     *
     * @constructor
     */
    constructor();
    /**
     * Process all middlewares.
     * @access public
     * @param {any} data - Data to be processed.
     * @returns {Object} - Returns if is rejected and the processed data
     */
    process(data: any): {
        rejected: boolean;
        data: any;
    };
    /**
     * Add middleware to use list.
     * @access public
     * @param {Function} middleware - Middleware function to be added.
     */
    use(middleware: Function): void;
}
export default MiddlewareManager;
