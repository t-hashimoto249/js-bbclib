Name
=====
BBc-1(Beyond Block-chain One) Library, written in Javascript. 

# Overview
The library is implemented bbclib and bbc-app-rest-api functions on platform of BBc-1.
It provides make transaction function, sign and verify transaction function, serialize and deserialize function for some collection of data on BBc-1 platform. (The data are BBcTransaction, BBcEvent, BBcAsset, BBcSignature, BBcRelation, BBcReference, BBcCrossRef, BBcPointer and BBcWitness).
It works on modern browsers(Firefox, IE, Edge, Chrome and Safari) and Node.js. 
The module is totally written in ES6+ and needed to get transpiled with babel for legacy environments.

※The design and detail of BBc-1 is following.
BBc-1: https://github.com/beyond-blockchain/bbc1
  
# Installation
At your project directory, do the following.

・From GitHub:
```$xslt
$ git clone https://github.com/t-hashimoto249/js-bbclib.git
```

# Usage
First, you set up bbccore(:9000) and bbc-app-rest(:3000) on localhost or anther node.

・Make, serialize and sign transaction.

```$xslt
import * as bbclib from 'js-bbclib.js'

//make transaction
let user = "4d48ba82dc8607c9";
let user_id = new Buffer(user, "hex");
let keypair = new KeyPair();
keypair.generate(); // or keypair.set_key_pair(private_key, public_key)
let tx = await helper.make_transaction(user_id, 1, 0, true); # return BBcTransaction

//sign and add signature in transaction
await helper.sign_and_add_signature(tx, keypair)

//serialize transaction for bson
let bsonobj = await tx.serialize(false, true);

//insert transaction in BBc-1
let xhr = new XMLHttpRequest();
let ip = "127.0.0.1"
xhr.open('POST', 'http://' + ip + ':3000/insert_transaction/' + domain, false);
xhr.setRequestHeader('Content-Type', 'application/json');
let parameter = {
       'source_user_id': user1,
       'transaction_bson': helper.Base64.encode(bsonobj)
};

xhr.addEventListener("load", function (event) {
    //get response from bbc-app-rest
    if( event.target.status == 200 || event.target.status == 304 ) {    
       
    }else{
       
    }
       
});
xhr.send(JSON.stringify(parameter));

```

・Search, deserialize and verify transaction.

```$xslt
import * as bbclib from 'js-bbclib.js'

//make transaction
let user = "4d48ba82dc8607c9";
let user_id = new Buffer(user, "hex");
let keypair = new KeyPair();
keypair.generate(); // or keypair.set_key_pair(private_key, public_key)
let tx = await helper.make_transaction(user_id, 1, 0, true); # return BBcTransaction

//sign and add signature in transaction
await helper.sign_and_add_signature(tx, keypair)

//serialize transaction for bson
let bsonobj = await tx.serialize(false, true);

//insert transaction in BBc-1
let xhr = new XMLHttpRequest();
let ip = "127.0.0.1"
xhr.open('POST', 'http://' + ip + ':3000/insert_transaction/' + domain, false);
xhr.setRequestHeader('Content-Type', 'application/json');
let parameter = {
       'source_user_id': user1,
       'transaction_bson': helper.Base64.encode(bsonobj)
};

xhr.addEventListener("load", function (event) {
    //get response from bbc-app-rest
    if( event.target.status == 200 || event.target.status == 304 ) {    
       
    }else{
       
    }
       
});
xhr.send(JSON.stringify(parameter));

```


# License
Licensed under the MIT license, see LICENSE file.

## keyword
BBc-1, Block-Chain, 
