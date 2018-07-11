import chai from 'chai';
import assertArrays from 'chai-arrays';
import cbytes from 'chai-bytes';
import cjson from 'chai-json-schema';

chai.use(assertArrays);
chai.use(cbytes);
chai.use(cjson);
//const expect = assertArrays.expect;
const expect = chai.expect;

import BBcWitness from '../html/src/bbcclass/BBcWitness.js';
import BBcTransaction from '../html/src/bbcclass/BBcTransaction.js';
import BBcAsset from '../html/src/bbcclass/BBcAsset.js';
import BBcReference from '../html/src/bbcclass/BBcReference.js';
import BBcRelation from '../html/src/bbcclass/BBcRelation.js';
import BBcPointer from '../html/src/bbcclass/BBcPointer.js';
import BBcSignature from '../html/src/bbcclass/BBcSignature.js';
import KeyPair from '../html/src/bbcclass/KeyPair.js';

import jscu from "js-crypto-utils";
import BBcEvent from "../html/src/bbcclass/BBcEvent";


const KeyType = {
    NOT_INITIALIZED: 0,
    ECDSA_SECP256k1: 1,
    ECDSA_P256v1: 2
};

var BSON = require('bson');
let bson = new BSON();

describe('test', () => {

    it('Test for BBcWitness Class.', () => {
        console.log("***********************");
        console.log("Test for BBcWitness Class");

        let witness = new BBcWitness();
        let witness_load = new BBcWitness();
        //witness.add_user("aaa");
        //witness.add_user("bbb");
        witness.add_sig_indices("1111");
        witness.add_sig_indices("2222");
        let s_witness = witness.serialize();
        witness_load.deserialize(s_witness);
        expect(witness_load.sig_indices[0]).to.be.eq('1111');
        //expect(witness_load.user_ids[0]).to.be.eq('aaa');
        //expect(witness_load.user_ids[1]).to.be.eq('bbb');
        expect(witness_load.sig_indices[1]).to.be.eq('2222');
    });

    it('Test for BBcTransaction Class.', async () => {
        console.log("***********************");
        console.log("Test for BBcTransaction Class.");

        let bbctransaction = new BBcTransaction(0);
        let refs = [];
        for (let i = 0; i < 2 ; i++){
            let ref = new BBcReference(null, null, null, null);

            refs.push(ref);
        }

        let witness = new BBcWitness();
        bbctransaction.add_parts([],refs,[],witness,null);
        //event reference relation witness cross_ref

        let transaction_serialize = await bbctransaction.serialize(false,true);
        let transaction_deserialize = new BBcTransaction(0);
        await transaction_deserialize.deserialize(transaction_serialize);

        expect(bbctransaction.version).to.be.eq(transaction_deserialize.version);
        expect(bbctransaction.timestamp).to.be.eq(transaction_deserialize.timestamp);
        expect(bbctransaction.id_length).to.be.eq(transaction_deserialize.id_length);
        expect(bbctransaction.events).to.be.equalTo(transaction_deserialize.events);
        // TODO: クラス間の比較ができていない
        //expect(bbctransaction.references).to.be.equalTo(transaction_deserialize.references);
        expect(bbctransaction.relations).to.be.equalTo(transaction_deserialize.relations);
        //expect(bbctransaction.witness).to.be.eq(transaction_deserialize.witness);
        expect(bbctransaction.cross_ref).to.be.eq(transaction_deserialize.cross_ref);
        expect(bbctransaction.signatures).to.be.equalTo(transaction_deserialize.signatures);

    });

    it('Test for BBcAsset Class.', async () => {
        console.log("***********************");
        console.log("Test for BBcAsset Class.");

        const user_id = await jscu.crypto.random.getRandomBytes(32);
        let bbcAsset = new BBcAsset(user_id);

        await bbcAsset.setRandomNonce();

        let asset_file = new Buffer(32);
        for(let i = 0; i < 32; i++){
            asset_file[i] = 0xFF & i;
        }

        let asset_body = new Buffer(32);
        for(let i = 0; i < 32; i++){
            asset_body[i] = 0xFF & (i + 32);
        }

        await bbcAsset.add_asset(asset_file, asset_body);
        let asset_serialize = await bbcAsset.serialize(false);
        let asset_deserialise = new BBcAsset(user_id);
        await asset_deserialise.deserialize(asset_serialize);

        expect(bbcAsset.asset_id).to.be.eq(asset_deserialise.asset_id);
        expect(bbcAsset.user_id).to.be.eq(asset_deserialise.user_id);
        expect(bbcAsset.nonce).to.be.eq(asset_deserialise.nonce);
        expect(bbcAsset.asset_file_size).to.be.eq(asset_deserialise.asset_file_size);
        expect(bbcAsset.asset_file_digest).to.be.eq(asset_deserialise.asset_file_digest);
        expect(bbcAsset.asset_body_size).to.be.eq(asset_deserialise.asset_body_size);
        expect(bbcAsset.asset_body).to.be.eq(asset_deserialise.asset_body);

    });

    it('Test for BBcEvent Class.', async () => {
        console.log("***********************");
        console.log("Test for BBcEvent Class.");

        let bbcEvent = new BBcEvent(null);
        let event_deserialise = new BBcEvent(null);

        const user_id = await jscu.crypto.random.getRandomBytes(8);
        const asset_group_id = await jscu.crypto.random.getRandomBytes(8);
        let asset = new BBcAsset(user_id);
        asset.add_user_id(user_id);
        asset.add_asset(null, hexStringToByte("123456"));

        bbcEvent.add_asset(asset);
        bbcEvent.add_asset_group_id(asset_group_id);
        bbcEvent.add_mandatory_approver(user_id);

        let serialize_event = bbcEvent.serialize();
        event_deserialise.deserialize(serialize_event);
        expect(bbcEvent.asset_group_id).to.be.eq(event_deserialise.asset_group_id);
        expect(bbcEvent.reference_indices).to.be.eq(event_deserialise.reference_indices);
        expect(bbcEvent.mandatory_approvers).to.be.eq(event_deserialise.mandatory_approvers);
        expect(bbcEvent.option_approver_num_numerator).to.be.eq(event_deserialise.option_approver_num_numerator);
        expect(bbcEvent.option_approver_num_denominator).to.be.eq(event_deserialise.option_approver_num_denominator);
        expect(bbcEvent.option_approvers).to.be.eq(event_deserialise.option_approvers);
        expect(bbcEvent.asset.asset_id).to.be.eq(event_deserialise.asset.asset_id);
        expect(bbcEvent.asset.user_id).to.be.eq(event_deserialise.asset.user_id);
        expect(bbcEvent.asset.nonce).to.be.eq(event_deserialise.asset.nonce);
        expect(bbcEvent.asset.asset_file_size).to.be.eq(event_deserialise.asset.asset_file_size);
        expect(bbcEvent.asset.asset_file_digest).to.be.eq(event_deserialise.asset.asset_file_digest);
        expect(bbcEvent.asset.asset_body_size).to.be.eq(event_deserialise.asset.asset_body_size);
        expect(bbcEvent.asset.asset_body).to.be.eq(event_deserialise.asset.asset_body);


    });

    it('calc digest ', async () => {
        console.log("***********************");
        console.log("calc digest ");
        const user_id = new Buffer(8);
        for(let i = 0; i < 1; i++){
            user_id[i] = 0xFF & 0x00;
        }
        user_id[0] = 0x00;

        let asset_body = new Buffer(8);
        for(let i = 0; i < 8; i++){
            asset_body[i] = 0xFF & 0x00;
        }
        asset_body[0] = 0x00;

        let bbcAsset = new BBcAsset(user_id);

        let nonce = new Buffer(8);
        for(let i = 0; i < 8; i++){
            nonce[i] = 0xFF & 0x00;
        }

        bbcAsset.setNonce(nonce);

        await bbcAsset.add_asset(null, asset_body);
        let digest = await bbcAsset.digest();

        expect(digest[0].toString(16)).to.be.eq("72");
        expect(digest[1].toString(16)).to.be.eq("85");
        expect(digest[2].toString(16)).to.be.eq("bc");
        expect(digest[3].toString(16)).to.be.eq("3c");
        expect(digest[4].toString(16)).to.be.eq("bc");
        expect(digest[5].toString(16)).to.be.eq("28");
        expect(digest[6].toString(16)).to.be.eq("f2");
        expect(digest[7].toString(16)).to.be.eq("33");

    });

    it('Test for BBcReference Class.', () => {
        console.log("***********************");
        console.log("Test for BBcReference Class.");
        let bbcReference = new BBcReference(0,1,null,3);
        let bbc_deserialize = new BBcReference(null,null,null,null);

        let bbc_reference_serialize = bbcReference.serialize();
        bbc_deserialize.deserialize(bbc_reference_serialize);

        expect(bbcReference.asset_group_id).to.be.eq(bbc_deserialize.asset_group_id);
        expect(bbcReference.transaction_id).to.be.eq(bbc_deserialize.transaction_id);
        expect(bbcReference.event_index_in_ref).to.be.eq(bbc_deserialize.event_index_in_ref);
        expect(bbcReference.sig_indices).to.be.eq(bbc_deserialize.sig_indices);

    });

    it('Test for BBcSignature Class.', async () => {
        console.log("***********************");
        console.log("Test for BBcSignature Class");

        let bbcSignature = new BBcSignature(KeyType.ECDSA_P256v1);

        let keypair = new KeyPair();
        await keypair.generate();
        const sig = new Buffer(8);

        let ref = await bbcSignature.add(sig, keypair.public_key);

        let signature_serialize = bbcSignature.serialize();

        let signature_deserialize = new BBcSignature();
        let sig_serialize_bson = bson.serialize(signature_serialize);
        let sig_deserialize_bson = bson.deserialize(sig_serialize_bson);
        await signature_deserialize.deserialize(sig_deserialize_bson);

        expect(bbcSignature.signature).to.equalBytes(signature_deserialize.signature);
        expect(bbcSignature.pubkey).to.be.jsonSchema(signature_deserialize.pubkey);

    });

    it('Test for BBcRelation Class.', async () => {
        console.log("***********************");
        console.log("Test for BBcRelation Class");

        let bbcRelation = new BBcRelation(null);
        bbcRelation.add_asset_group_id(new Buffer(8));
        bbcRelation.set_asset(new BBcAsset(null));
        bbcRelation.add_pointer(new BBcPointer());

        let serialize_bbcrelation = bbcRelation.serialize();
        let bbcRelation_deserialize = new BBcRelation(null);
        bbcRelation_deserialize.deserialize(serialize_bbcrelation);

        expect(bbcRelation.asset_group_id).to.equalBytes(bbcRelation_deserialize.asset_group_id);
        expect(bbcRelation.pointers[0].transaction_id).to.be.eq(bbcRelation_deserialize.pointers[0].transaction_id);
        expect(bbcRelation.pointers[0].asset_id).to.be.eq(bbcRelation_deserialize.pointers[0].asset_id);
    });


    it('Test for BBcPointer Class.', async () => {
        console.log("***********************");
        console.log("Test for BBcPointer Class");

        let bbcPointer = new BBcPointer(null,null);
        bbcPointer.set_asset_id(new Buffer(8));
        bbcPointer.set_transaction_id(new Buffer(8));

        let serialize_bbcPointer = bbcPointer.serialize();
        let bbcPointer_deserialize = new BBcPointer(null,null);
        bbcPointer_deserialize.deserialize(serialize_bbcPointer);

        expect(bbcPointer.transaction_id).to.equalBytes(bbcPointer_deserialize.transaction_id);
        expect(bbcPointer.asset_id).to.equalBytes(bbcPointer_deserialize.asset_id);

    });


    it('Test for KeyPair Class.', async () => {
        console.log("***********************");
        console.log("Test for KeyPair Class.");
        let keypair = new KeyPair();
        let ret = await keypair.generate();
        expect(keypair.public_key).to.not.equal(null);
        expect(keypair.private_key).to.not.equal(null);

        const msg = new Buffer(32);
        for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;

        let sig = await keypair.sign(msg);
        let result = await keypair.verify(msg,sig);
        expect(ret).to.be.eq(result);

    });

    it('Test for jscu module.', async () => {
        console.log("***********************");
        //b'6e 34 0b 9c ff b3 7a 98 9c a5 44 e6 bb 78 0a 2c 78 90 1d 3f b3 37 38 76 85 11 a3 06 17 af a0 1d'
        //b'\x00'

        const msg = new Buffer(1);
        for(let i = 0; i < 1; i++) msg[i] = 0xFF & 0x00;

        const digest = await jscu.crypto.hash.getHash('SHA-256', msg);

        expect(digest[0].toString(16)).to.be.eq("6e");
        expect(digest[1].toString(16)).to.be.eq("34");
        expect(digest[2].toString(16)).to.be.eq("b"); //"0b"
        expect(digest[3].toString(16)).to.be.eq("9c");
        expect(digest[4].toString(16)).to.be.eq("ff");
        expect(digest[5].toString(16)).to.be.eq("b3");
        expect(digest[6].toString(16)).to.be.eq("7a");
        expect(digest[7].toString(16)).to.be.eq("98");
        expect(digest[8].toString(16)).to.be.eq("9c");
        expect(digest[9].toString(16)).to.be.eq("a5");
        expect(digest[10].toString(16)).to.be.eq("44");
        expect(digest[11].toString(16)).to.be.eq("e6");
        expect(digest[12].toString(16)).to.be.eq("bb");
        expect(digest[13].toString(16)).to.be.eq("78");
        expect(digest[14].toString(16)).to.be.eq("a");//"0a"
        expect(digest[15].toString(16)).to.be.eq("2c");
        expect(digest[16].toString(16)).to.be.eq("78");
        expect(digest[17].toString(16)).to.be.eq("90");
        expect(digest[18].toString(16)).to.be.eq("1d");
        expect(digest[19].toString(16)).to.be.eq("3f");
        expect(digest[20].toString(16)).to.be.eq("b3");
        expect(digest[21].toString(16)).to.be.eq("37");
        expect(digest[22].toString(16)).to.be.eq("38");
        expect(digest[23].toString(16)).to.be.eq("76");
        expect(digest[24].toString(16)).to.be.eq("85");
        expect(digest[25].toString(16)).to.be.eq("11");
        expect(digest[26].toString(16)).to.be.eq("a3");
        expect(digest[27].toString(16)).to.be.eq("6");//"06"
        expect(digest[28].toString(16)).to.be.eq("17");
        expect(digest[29].toString(16)).to.be.eq("af");
        expect(digest[30].toString(16)).to.be.eq("a0");
        expect(digest[31].toString(16)).to.be.eq("1d");

    });


});

async function create_pubkey_byte(pubkey){
    console.log("***********************");
    console.log("bbclib test create_pubkey ");

    let byte_x = await jscu.helper.encoder.decodeBase64Url(pubkey['x']);
    let byte_y = await jscu.helper.encoder.decodeBase64Url(pubkey['y']);

    let pubkey_byte = new Buffer(65);
    pubkey_byte[0]= 0x04;
    for(let i = 0; i < 32; i++){
        pubkey_byte[i+1] = byte_x[i];
        pubkey_byte[i+1+32] = byte_y[i];
    }
    return pubkey_byte;
}



function hexStringToByte(str) {
    if (!str) {
        return new Buffer();
    }

    var a = [];
    for (var i = 0, len = str.length; i < len; i+=2) {
        a.push(parseInt(str.substr(i,2),16));
    }

    return new Buffer(a);
};