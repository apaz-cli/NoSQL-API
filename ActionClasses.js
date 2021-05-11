
import { DBMonad } from './MonadicOperations.js';
import { createRequest, sendRequest } from './DBRequest.js';

/***********************************************************************/
/* All of the classes in this file are not meant to be constructed by  */
/* the user of the API. Instead, they are constructed by factory       */
/* methods of the DBConnection and DBCollection classes to store the   */
/* intermediate state of queries, where each mutation of the query     */
/* state is actually a factory method. Since they are not to be used   */
/* directly the classes here are not fully documented.                 */
/***********************************************************************/


/****************************/
/* Chains from DBCollection */
/****************************/

class DBDocument {
    // Constructor private, chain off of DBCollection.
    constructor(collection, document_id) {
        this.collection = collection;
        this.document_id = document_id;
    }

    async get(flag) {
        const reqObj = createRequest(this.collection, "Document", flag === "debug", {
            doc_id: this.document_id
        });

        return await sendRequest("GET", reqObj);
    }
}


class DBInsert {
    // Constructor private, chain off of DBCollection.
    constructor(collection, data) {
        this.collection = collection;
        this.doc_data = data;
    }

    async send() {
        const reqObj = createRequest(this.collection, "Insert", false, {
            doc_data: this.doc_data
        });
        return await sendRequest("POST", reqObj);
    }
}

class DBUpdate {
    // Constructor private, chain off of DBCollection.
    constructor(collection, doc_id, doc_data) {
        this.collection = collection;
        this.doc_id = doc_id;
        this.doc_data = doc_data;
    }

    async send() {
        const reqObj = createRequest(this.collection, "Update", false, {
            doc_id: this.doc_id,
            doc_data: this.doc_data
        });

        return await sendRequest("POST", reqObj);
    }
}

/****************************/
/* Chains from DBConnection */
/****************************/

class AllDBDocuments {
    // Constructor private, chain off of DBConnection.
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * Returns a map of all Document IDs to all Document data for this collection.
     * 
     * @param {String} flag "debug" to retrieve the results of the query 
     *                      step by step, or undefined (or any other value) 
     *                      to return the result normally.
     * @returns A promise containing the result of the query or debug trace.
     */
    async get(flag) {
        const dbg = flag === "debug";
        const reqObj = createRequest(this.connection, "AllDocuments", dbg, {});
        const result_obj = await sendRequest("GET", reqObj);
        return wrapMap(result_obj, dbg);
    }

    // "private/undocumented helper to wrap response in map. This works though."
    wrapMap(result_obj, dbg) { return dbg ? result_obj : Map(result_obj); }
}

class DBCollectionList {
    // Constructor private, chain off of DBConnection.
    constructor(connection) {
        this.connection = connection;
    }

    async get() {
        const reqObj = createRequest(this.connection, "CollectionList", false, {
            doc_data: this.doc_data
        });
        return await sendRequest("GET", reqObj);
    }
}

class DBCollectionCreate {
    // Constructor private, chain off of DBConnection.
    constructor(connection) {
        this.connection = connection;
    }

    async send() {
        const reqObj = createRequest(this.connection, "CollectionCreate", false, {
            doc_data: this.doc_data
        });
        return await sendRequest("POST", reqObj);
    }
}


export { DBDocument, AllDBDocuments, DBMonad, DBInsert, DBUpdate, DBCollectionList, DBCollectionCreate };