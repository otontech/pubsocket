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
declare class DataPipeline {
    /**
     * Middlewares array.
     * @access private
     * @member {Array<Function>} Middlewares
     * @memberof DataPipeLine
     */
    private middlewares;
    /**
     * Represents if all middleware has been dispatched.
     * @access private
     * @member {boolean} Finished
     * @memberof DataPipeLine
     */
    private finished;
    /**
     * Represents whether a middleware has rejected a situation.
     * @access private
     * @member {boolean} Rejected
     * @memberof DataPipeLine
     */
    rejected: boolean;
    /**
     * Data to be passed to all middlewares.
     * @access private
     * @member {any} Data
     * @memberof DataPipeLine
     */
    data: any;
    /**
     * Create a data pipe line to process.
     * @constructor
     * @param {any} data - Data to be passed
     * @param {Array<Function>} middlewares - List of middlewares
     */
    constructor(data: any, ...middlewares: Array<Function>);
    /**
     * Dispatch all middlewares and process the data.
     * @access public
     */
    dispatch(): void;
}
export default DataPipeline;
