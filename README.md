# How to use this API:

## The Structure of the database:

This NoSQL database works by changing and performing operations on an active field. It supports the usual Collection/Document Key-Value store features of other NoSQL databases, but also more uniquely supports the power, convenience, and efficiency of map-filter through the monadic API.


The fundamental idea behind the monadic API is that it allows you to traverse your data. Behind the scenes, the monadic API writes and sends the database bytecode describing all the operations to be performed. Building a monadic query is equivalent to writing bytecode to traverse your JSON across fields, documents, and collections, filtering and saving what's important. This means that knowing how your database is structured is important. 


Please see the examples below, and everything will make more sense.


&nbsp;
# Use cases supported:

&nbsp;
## How to declare Connections and Collections
```js
import { DBConnection } from 'BaseClasses.js';

// How to declare connections and collections
const conn = new DBConnection("http://localhost:8080/", apiKey);
const coll = conn.collection("CollectionName");

// Every single action that can be taken in the entire API chains off 
// of a DBConnection object.

// For the sake of speed, declaring the collection as above does not 
// make a call out to the database to create it or even check if it 
// exists. You'll get that error when you run the query, or you can 
// get the list of collections, and if the one you want isn't in it, 
// create it (and catch an error in case you lose a race to create it).
// atomics).

// Whenever any IO is done between the database and this API you'll 
// know, because a chain ends in .get() for queries and .send() for 
// other operations. The distinction is not particularly relevant, 
// but the ones ending in .get() send GET requests, while the ones 
// ending in .send() do POST requests.
```


&nbsp;
## How to create a Collection
```js
// Creates a document with name CollectionName
const coll = await conn.createCollection("CollectionName").send();
// Now you can use the collection object to insert and retrieve. 
// Throws Errors when the collection already exists or cannot be 
// created.
```

&nbsp;
## How to insert/modify data
```js
// Returns the ID of the document that was just created.
const docID = await coll.insertDoc(data).send();
const update = await coll.updateDoc(docID, data).send();

// Similarly, send() can be given the additional argument send('debug').
``` 

&nbsp;
## Ways to query the database:
```js

// Returns an array of collection names: Ex. ["coll", "coll2"].
const collList = await conn.collectionList().get();

// Returns the json that was previously stuffed into the database.
// If the document is not found, this returns undefined.
const oneDoc   = await coll.document(docID).get(); 

// Efficient equivalent to calling coll.document(docID).get() multiple times.
// Document IDs that are not found are dropped. If none are found, returns 
// an empty array.
const manyDocs = await coll.documents([docID1, docID2, docID3]).get();

// Returns the whole collection as a Map() from docID to data.
const docMap   = await coll.allDocuments().get(); 

// With the monadic API, you can compose as many operations as you wish.
const monads   = await coll.monadic()

                         // Maps the active field "obj" to obj.key, 
                         // or whatever the given attribute name is. 
                         // If it would be undefined, those documents 
                         // are dropped from the query. What you call 
                         // the active field  (the first one, "obj" in 
                         // this case) doesn't matter. Also works for 
                         // multiple attributes, 
                         // Ex: "obj.key.value.thing".
                         .mapAttrs("obj.key")

                         // This is much like a join. It assumes that 
                         // the active field is a docID for the given 
                         // collection, and sets the active field to be
                         // all the document data from given collection 
                         // that that matches the docID. Like before, 
                         // non-matches are dropped.
                         .mapIDToCollection(coll2)

                         // Filters the given field by the given
                         // condition. Behaves like arr.filter().
                         // The name of the first thing ("active" here)
                         // doesn't matter, but the rest should be 
                         // correct property names.
                         .where("active.prop.thing.numbers", "<", 5)

                         // Assumes that the active field is an array, 
                         // then changes that active field to all its
                         // members.
                         .flatMapArr()

                         // Limits active field to a given number.
                         // This can be done anywhere in the chain.
                         .limit(2)

                         // Maps the currently active field to an object 
                         // containing the document it came from. Cannot 
                         // be used multiple times successively. Instead of the normal data, returns an 
                         // array of [[docID, data]...]. This must be
                         // done just before get().
                         .withID()

                         // Retrieve the results of the chain, the 
                         // current active field.
                         .get();

// Database operation chains like this can get complicated. So, wherever
// you see ".get()" you can replace it with ".get('debug')". Instead of your 
// data, this will return a detailed synopisis of everything that happens 
// at every step of the way, and what exactly what the active field is, 
// which is what you would recieve if you were to end the chain there. 
// This also happens by default on errors, where the database would try 
// to do something that it cannot, such as map an array to a collection.
```



### Please read the source code for all of the monadic operations.
