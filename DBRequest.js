// Comment out this line if not running on node, browsers 
// support fetch but node doesn't.
import fetch from 'isomorphic-fetch';

/**
 * 
 * @param {String} coll_conn The collection or connection (either work) that this query is about (or begins with)
 * @param {String} action The name of the database operation to perform
 * @param {Boolean} debug Whether or not to save each step for debugging
 * @param {Object} action_body The information that the backend will need to 
 *                        complete the request. For the monadic API this is 
 *                        bytecode, and for the others these are additional 
 *                        parameters depending on what is required.
 * @returns request_obj to be passed to DBRequest::sendRequest().
 */
function createRequest(coll_conn, action, debug, action_body) {
    return {
        url: coll_conn.url,
        api_key: coll_conn.api_key,
        action: action,
        action_body: action_body,
        debug: debug,
    };
};

/**
 * 
 * @param {String} method POST or GET depending on the database action
 * @param {DBCollection} collection The DBCollection to perform the query on
 * @param {Object} req_obj The details of the request created by DBRequest::createRequest().
 * @returns A promise that when resolved contains the result of the query or a 
 *          sequence of states and steps if reqObj.debug is true.
 */
async function sendRequest(method, req_obj) {

    // Make the request await the promise
    return await fetch(`${req_obj.url}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': req_obj.api_key
        },
        body: JSON.stringify({
            action: req_obj.action,
            action_body: req_obj.action_body,
            debug: req_obj.debug,
        })
    });
};

export { createRequest, sendRequest };