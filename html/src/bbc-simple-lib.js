import jscu from "js-crypto-utils";
import bbc from "bbcclass/bbc-class.js"
import {BBcTransaction, BBcWitness} from "bbcclass/bbc-class";

var BSON = require('bson');
let bson = new BSON();

function handler_search_transaction(){
    console.log("handler_search_transaction");
    if( xhr.status == 200 || xhr.status == 304 ) {
        var data = xhr.responseText; // responseXML もあり
        console.log( 'COMPLETE! :'+data );
        let json = JSON.parse(data);

        let bson_data = Buffer.from(Base64.decode(json["transaction_bson"]));

        let json_data = bson.deserialize(bson_data);
        console.log(json_data);

    }
    else {
        console.log('Failed. HttpStatus: ' + xhr.statusText);
    }

}

export function generate_witness(){
    let witness = new BBcWitness();
    return witness;
}



/*
var tls = require('tls');
var fs = require('fs');
var winston = require('winston');


var logger = require('fluent-logger').createFluentSender('sample', {
    host: 'localhost',
    port: 24224,
    timeout: 3.0,
    reconnectInterval: 600000 // 10 minutes
});

// send an event record with 'tag.label'
logger.emit('sample', {record: 'this is a log'});

*/
/*
function create_transaction(event_num, relation_num, witness, id_length)
{
    let transaction = BBcTransaction(format_type = format_type, id_length = id_length)
    if event_num > 0:
    for i in range(event_num):
    evt = BBcEvent(format_type = format_type, id_length = id_length)
    ast = BBcAsset(format_type = format_type, id_length = id_length)
    evt.add(asset = ast)
    transaction.add(event = evt)
    if relation_num > 0:
    for i in range(relation_num):
    transaction.add(relation = BBcRelation(format_type = format_type, id_length = id_length))
    if witness:
    transaction.add(witness = BBcWitness(format_type = format_type, id_length = id_length))
    return transaction
}

function make_transaction( ){
    let event_num = 2;
    let relation_num = 2;
    let witness = true;
    let id_length = DEFAULT_ID_LEN;

    let txobj = create_transaction(event_num, relation_num, witness, id_length);
    txobj.events[0].add(reference_index=0, mandatory_approver=user_id1)
    bbclib.add_event_asset(txobj, event_idx=0, asset_group_id=asset_group_id,
        user_id=user_id1, asset_body=b'123456')
    bbclib.add_event_asset(txobj, event_idx=1, asset_group_id=asset_group_id,
        user_id=user_id1, asset_body=b'abcdefg')
    txobj.witness.add_witness(user_id1)
    sig = txobj.sign(keypair=keypair1)
    txobj.add_signature(user_id=user_id1, signature=sig)
    global txid, asid
    txid = txobj.digest()
    asid = txobj.events[0].asset.asset_id
    return txobj

}
*/



