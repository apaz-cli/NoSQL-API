
/********************/
/* Helper Functions */
/********************/

// Ensures that a property mapping is valid.
// The regex for one valid JS identifier:  /^([a-zA-Z_$][a-zA-Z\d_$]*)$/;

// One or more valid JS identifiers (Exactly one identifier or strictly more than one identifier)
const js_identifier_chain_ge1 = /^([a-zA-Z_$][a-zA-Z\d_$]*$)|(([a-zA-Z_$][a-zA-Z\d_$]*)(\.[a-zA-Z_$][a-zA-Z\d_$]*))+$/
// Strictly more than one identifier
const js_identifier_chain_g1 = /^([a-zA-Z_$][a-zA-Z\d_$]*)(\.[a-zA-Z_$][a-zA-Z\d_$]*)+$/

function attrBasics(attrs) {
    if (attrs === undefined || attrs === null) throw new Error(`The attribute chain must be defined. Got: ${attrs}`);
    if (!"attrs".split) throw new Error(`The attribute chain must be a string. Got: ${attrs}`);
}

function validateAttrs(attrs) {
    attrBasics(attrs);
    if (!js_identifier_chain_g1.test(attrs)) throw new Error(`Must be a valid CHAIN of JS identifiers. The active field, then at least one property. Got: ${attrs}`);

    // Split it into an array and cut off the irrelevant first comment item.
    return attrs.split('.').slice(1);
}

function validateAttr(attrs) {
    attrBasics(attrs);
    if (!js_identifier_chain_ge1.test(attrs)) throw new Error(`Must be a valid CHAIN of JS identifiers. The active field, then at least one property. Got: ${attrs}`);
    return attrs.split('.');
}

const comparators = ["==", "<", "<=", ">", ">="];
function validateComparator(cmp) {
    if (!comparators.includes(cmp)) throw new Error(`The valid comparators are: ${comparators}. Got: ${cmp}`);
    return cmp;
}

/************************/
/* Monad Implementation */
/************************/

class DBMonad {
    // Constructor private, chain off of DBCollection.
    constructor(collection, operations) {
        this.collection = collection;
        if (!operations) this.operations = [];
        else this.operations = operations;
    }

    // "private"
    addOp(name, data) { this.operations.push({ op: name, data: data }); }

    async get(flag) {
        const reqObj = createRequest(this.collection, "Monadic", flag === "debug", {
            operations: this.operations
        });
        return await sendRequest("GET", reqObj);
    }


    /********************/
    /* Monadic Functors */
    /********************/

    mapAttrs(attrs) {
        attrs = validateAttrs(attrs); // To array of validated attributes
        this.addOp("mapAttrs", attrs);
    }

    mapIDToCollection(collection) {
        this.addOp("mapIDToCollection", collection.name);
    }

    where(attrs, comparator, val) {
        attrs = validateAttrs(attrs);
        comparator = validateComparator(comparator);
        this.addOp("where", { attrs: attrs, cmp: comparator, val: val });
    }

    flatMapArr() {
        this.addOp("flatMapArr", undefined);
    }

    limit(num) {
        if (isNaN(num) || num <= 0) throw new Error(`The argument of limit() must be a number greater than zero. Got: ${num}.`);
        this.addOp("limit", num);
    }

    withID() {
        this.addOp("withID", undefined);
    }
}

export { DBMonad };