/**
 * Data Pipe Line.
 *
 * Use this class to support middleware pattern.
 *
 * This code is inspired in this pattern.
 * <https://github.com/waldemarnt/node-design-patterns/tree/master/examples/middleware>
 * 
 * @link   <http://www.otontech.com.br>
 * @file   This files defines the DataPipeline class.
 * @author Antônio Vinicius.
 * @since  1.0.0
 */

/** DataPipeLine class */
class DataPipeline {
	/**
	 * Middlewares array.
	 * @access private
	 * @member {Array<Function>} Middlewares
	 * @memberof DataPipeLine
	 */
	private middlewares: Array<Function>;

	/**
	 * Represents if all middleware has been dispatched.
	 * @access private
	 * @member {boolean} Finished
	 * @memberof DataPipeLine
	 */
	private finished: boolean;

	/**
	 * Represents whether a middleware has rejected a situation.
	 * @access private
	 * @member {boolean} Rejected
	 * @memberof DataPipeLine
	 */
	public rejected: boolean;

	/**
	 * Data to be passed to all middlewares.
	 * @access private
	 * @member {any} Data
	 * @memberof DataPipeLine
	 */
	public data: any;

	/**
	 * Create a data pipe line to process.
	 * @constructor
	 * @param {any} data - Data to be passed 
	 * @param {Array<Function>} middlewares - List of middlewares 
	 */
	public constructor(data: any, ...middlewares: Array<Function>) {
		this.middlewares = middlewares;
		this.finished = false;
		this.rejected = false;

		data.end = () => {
			this.finished = true;
		}

		this.data = data;
	}

	/**
	 * Dispatch all middlewares and process the data.
	 * @access public
	 */
	public dispatch() {
		let iterator = 0;
		if (iterator < this.middlewares.length) {
			const firstMiddleware = this.middlewares[iterator];

			/**
			 * Function to pass to the next middleware.
			 */
			const next = () => {
				iterator++;
				if (!this.finished && (iterator < this.middlewares.length)) {
					const nextMiddleware = this.middlewares[iterator];
					nextMiddleware(this.data, next, reject);
				} else {
					this.data.end();
				}
			}

			/**
			 * Function to reject the pipe line.
			 * @param {string} reason - Reason to reject
			 */
			const reject = (reason: String) => {
				this.data.end();
				this.rejected = true;
				this.data.reason = reason;
			}

			firstMiddleware(this.data, next, reject);
		}
	}
}

export default DataPipeline;