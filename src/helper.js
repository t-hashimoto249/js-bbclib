import BBcEvent from "./bbcclass/BBcEvent";
import BBcAsset from "./bbcclass/BBcAsset";
import BBcTransaction from "./bbcclass/BBcTransaction";
import BBcWitness from "./bbcclass/BBcWitness";
import BBcRelation from "./bbcclass/BBcRelation";
import jscu from "js-crypto-utils";
import jseu from "js-encoding-utils";

export async function make_transaction(user_id, event_num, ref_num, witness){
    let txobj = await get_new_transaction(user_id, event_num, ref_num, witness);
    if(event_num > 0 ){
        for (let i = 0; i < event_num; i++){
            txobj.events[i].add_reference_indices(i);
            txobj.events[i].add_mandatory_approver(hexStringToByte("0"));
        }
    }
    txobj.witness.add_witness(user_id);
    await txobj.set_transaction_id();
    return txobj
}

export async function sign_and_add_signature( transaction, key_pair){
    let sig = await transaction.sign(null, null, key_pair);
    transaction.add_signature(transaction.user_id, sig);
    return
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

export async function get_random_value(length){
    const msg = await jscu.random.getRandomBytes(length);
    const d = await jscu.hash.compute( msg,'SHA-256');
    return d;
}

export async function create_pubkey_byte(pubkey){
    let byte_x = await jseu.encoder.decodeBase64Url(pubkey['x']);
    let byte_y = await jseu.encoder.decodeBase64Url(pubkey['y']);

    let pubkey_byte = new Buffer(65);
    pubkey_byte[0]= 0x04;
    for(let i = 0; i < 32; i++){
        pubkey_byte[i+1] = byte_x[i];
        pubkey_byte[i+1+32] = byte_y[i];
    }

    return pubkey_byte;
}

export async function create_asset(user_id){

  let bbcAsset = new BBcAsset(user_id);

  await bbcAsset.set_random_nonce();

  let asset_file = new Buffer(32);
  for(let i = 0; i < 32; i++){
    asset_file[i] = 0xFF & i;
  }

  let asset_body = new Buffer(32);
  for(let i = 0; i < 32; i++){
    asset_body[i] = 0xFF & (i + 32);
  }

  await bbcAsset.add_asset(asset_file, asset_body);

  return bbcAsset;
}
