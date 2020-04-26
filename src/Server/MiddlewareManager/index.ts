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

import DataPipeline from "../DataPipeline";

/** Middlewares Manager */
class MiddlewareManager {
	/**
	 * Middlewares Array.
	 * @access private
	 * @member {Array<Function>} Middlewares
	 * @memberof MiddlewareManager
	 */
	private middlewares: Array<Function>;

	/**
	 * Create a MiddlewareManager instance.
	 * 
	 * Use this class to manager middlewares
	 * using the middleware pattern.
	 * 
	 * @constructor
	 */
	public constructor() {
		this.middlewares = [];
	}

	/**
	 * Process all middlewares.
	 * @access public
	 * @param {any} data - Data to be processed. 
	 * @returns {Object} - Returns if is rejected and the processed data
	 */
	public process(data: any) {
		const dataPipeline = new DataPipeline(data, ...this.middlewares);
		dataPipeline.dispatch();
		return { rejected: dataPipeline.rejected, data: dataPipeline.data };
	}

	/**
	 * Add middleware to use list.
	 * @access public
	 * @param {Function} middleware - Middleware function to be added.
	 */
	public use(middleware: Function) {
		this.middlewares.push(middleware);
	}
}

export default MiddlewareManager;