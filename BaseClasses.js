/****************/
/* Base Classes */
/****************/
import { DBDocument, AllDBDocuments, DBMonad, DBInsert, DBUpdate, DBCollectionCreate, DBCollectionList } from './ActionClasses.js'
import { validateURL } from './DBUtil.js';


/**
 * @throws TypeError if the url is not well formed.
 */
class DBConnection {
    constructor(url, api_key) {
        if (!url || !api_key) throw new Error("Invalid arguments: Must pass a URL and an API key.");
        validateURL(url);

        this.url = url;
        this.api_key = api_key;
    }

    collection(name) {
        if (!name) throw new Error("Invalid argument: Must pass the name of the collection.");
        return new DBCollection(this.url, name, this.api_key);
    }

    async collectionList() {
        return new DBCollectionList(this);
    }

    async createCollection(name) {
        if (!name) throw new Error("Invalid argument: Must pass the name of the collection you wish to create.");
        return new DBCollectionCreate(this, name);
    }
}

class DBCollection {
    // Not meant to be constructed normally, chain off of DBConnection.
    constructor(base_url, name, api_key) {
        this.name = name;
        this.url = `${base_url}/${name}`;
        this.api_key = api_key;
        validateURL(this.url);
    }

    document(document_id) {
        if (!document_id) throw new Error("Invalid argument: Must pass the document id of the document to fetch.");
        return new DBDocument(this, document_id);
    }

    allDocuments() {
        return new AllDBDocuments(this);
    }

    monadic() {
        return new DBMonad(this, []);
    }

    insertDoc(data) {
        return new DBInsert(this, data);
    }

    updateDoc(docID, data) {
        return new DBUpdate(this, docID, data);
    }
}

export { DBConnection, DBCollection };