import BBcEvent from "./bbcclass/BBcEvent";
import BBcAsset from "./bbcclass/BBcAsset";
import BBcTransaction from "./bbcclass/BBcTransaction";
import BBcWitness from "./bbcclass/BBcWitness";
import BBcRelation from "./bbcclass/BBcRelation";

export async function make_transaction(user_id, keypair1, event_num, ref_num, witness){
    let txobj = await get_new_transaction(user_id, event_num, ref_num, witness);
    if(event_num > 0 ){
        for (let i = 0; i < event_num; i++){
            txobj.events[i].add_reference_indices(i);
            txobj.events[i].add_mandatory_approver(hexStringToByte("0"));
        }
    }

    txobj.witness.add_witness(user_id);
    let sig = await txobj.sign(null, null, keypair1);
    await txobj.set_transaction_id();
    txobj.add_signature(user_id, sig);
    await txobj.digest();
    return txobj
}

export async function get_new_transaction(user_id, event_num, relation_num, witness){
    let transaction = new BBcTransaction(0);
    if (event_num > 0){
        for (let i = 0 ; i < event_num; i++){
            let evt = new BBcEvent(null);
            let ast = new BBcAsset(null);
            ast.add_user_id(user_id);
            await ast.digest();
            evt.add_asset(ast);
            evt.add_asset_group_id(new Buffer(8));
            transaction.add_event(evt);
        }
    }

    if (relation_num > 0){
        for (let i = 0; i < relation_num; i++){
            transaction.add(new BBcRelation());
        }
    }
    if (witness){
        transaction.add_witness(new BBcWitness());
    }
    return transaction
}

function hexStringToByte(str) {
    if (!str) {
        return new Buffer();
    }

    let a = [];
    for (let i = 0, len = str.length; i < len; i+=2) {
        a.push(parseInt(str.substr(i,2),16));
    }

    return new Buffer(a);
}