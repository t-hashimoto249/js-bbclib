import jscu from "js-crypto-utils";
import BBcWitness from './BBcWitness.js';
import BBcReference from './BBcReference.js';
import BBcSignature from './BBcSignature.js';
import BBcRelation from './BBcRelation.js';
import BBcEvent from './BBcEvent.js';
import KeyPair from "./KeyPair.js";


var BSON = require('bson');
let bson = new BSON();

let date = new Date() ;

var BBcFormat = {
    FORMAT_BINARY : 0,
    FORMAT_BSON : 1,
    FORMAT_BSON_COMPRESS_BZ2 : 2
};

var DefaultLength ={
    BBcSimple : 8,
    BBcOne: 32
};

const KeyType = {
    NOT_INITIALIZED: 0,
    ECDSA_SECP256k1: 1,
    ECDSA_P256v1: 2
};

export default class {

    constructor(version){
        this.format_type = BBcFormat.FORMAT_BSON;
        this.id_length = DefaultLength.BBcSimple;
        this.version = version;
        this.timestamp = Math.floor(date.getTime() / 1000); //秒単位で記載
        this.events = [];
        this.references = [];
        this.relations = [];
        this.witness = null;
        this.cross_ref = null;
        this.signatures = [];
        this.userid_sigidx_mapping = {};
        this.transaction_id = null;
        this.transaction_base_digest = null;
        this.transaction_data = null;
        this.asset_group_ids = {};
        this.target_serialize = null;
    }

    show_str(){
        console.log("show_str");

        console.log("format_type");
        console.log(this.format_type);
        console.log("id_length");
        console.log(this.id_length);
        console.log("version");
        console.log(this.version);
        console.log("timestamp");
        console.log(this.timestamp);
        if(this.events != null && this.events.length > 0){
            console.log("events");
            for (let i = 0; i < this.events.length; i++){
                console.log(this.events[i].showEvent());
            }
        }
        console.log("references");
        console.log(this.references);
        console.log("relations");
        console.log(this.relations);
        console.log("witness");
        if(this.witness !== null){
            console.log(this.witness.show_str());
        }else{
            console.log(this.witness);
        }

        console.log("cross_ref");
        console.log(this.cross_ref);
        console.log("signatures");
        console.log(this.signatures);

        if(this.signatures != null && this.signatures.length > 0){
            console.log("signatures length");
            console.log(this.signatures.length);
            console.log(this.signatures[0].showSig());
        }else{
            console.log(this.signatures);
        }
        console.log("userid_sigidx_mapping");
        console.log(this.userid_sigidx_mapping);
        console.log("transaction_id");
        //this.print_bin(this.transaction_id);
        console.log(this.transaction_id);
        console.log("transaction_base_digest");
        console.log(this.transaction_base_digest);
        //this.print_bin(this.transaction_base_digest);
        console.log("transaction_data");
        console.log(this.transaction_data);
        console.log("asset_group_ids");
        console.log(this.asset_group_ids);
    }

    add_parts(event, reference, relation, witness, cross_ref){
        //"""Add parts"""
        if (Array.isArray(event)){
            if (event.length > 0){
                for(let i = 0; i < event.length; i++){
                    this.events =　event;
                }
            }
        }

        if (Array.isArray(reference)){
            if (reference.length > 0){
                for(let i = 0; i < reference.length; i++){
                    this.references =　reference;
                }
            }
        }

        if (Array.isArray(relation)){
            if (relation.length > 0){
                for(let i = 0; i < relation.length; i++){
                    this.relations =　relation;
                }
            }
        }

        if (witness != null){
            this.witness = witness;
        }

        if (cross_ref != null){
            this.cross_ref = cross_ref;
        }

        return true;
    }

    add_witness(witness) {
        if (witness != null) {
            witness.transaction = this;
            this.witness = witness;
        }
    }

    add_event(event){
        if (event != null) {
            this.events.push(event);
        }
    }

    get_sig_index(user_id){

        if (this.userid_sigidx_mapping[user_id] == null) {
            let sig_index_obj = Object.keys(this.userid_sigidx_mapping);
            this.userid_sigidx_mapping[user_id] = sig_index_obj.length;
            this.signatures.push(new BBcSignature(KeyType.ECDSA_P256v1));
        }
        return this.userid_sigidx_mapping[user_id];
    }

    add_signature(user_id, signature){
        if (user_id in this.userid_sigidx_mapping) {
            let idx = this.userid_sigidx_mapping[user_id];
            this.signatures[idx] = signature;
            return true;
        } else {
            return false;
        }
    }

    async digest(){
        this.target_serialize = await this.serialize(true, false);
        return this.target_serialize;
    }

    async set_transaction_id(){
        this.target_serialize = new Uint8Array(await this.serialize(true, false));
        let id = await jscu.crypto.hash.getHash('SHA-256', this.target_serialize);
        this.transaction_id = id.slice(0,this.id_length);
        return this.transaction_id;
    }

    print_bin(bin){
        let d = "";
        for (let i = 0; i < bin.length ; i++){
            if (bin[i] < 16){
                d += "0";
            }
            d += bin[i].toString(16);
        }
        console.log(d);
    }

    async serialize(for_id, no_header){
        let witness = null;
        if (this.witness != null){
            witness = this.witness.serialize();
        }
        let event_list = [];
        for (let i = 0; i < this.events.length; i++){
            event_list.push(this.events[i].serialize());
            console.log("Event Serialize");
            this.events[i].showEvent();
            print_bin(this.events[i].serialize());

        }
        let ref_list = [];
        for (let i = 0; i < this.references.length; i++){
            ref_list.push(this.references[i].serialize());
        }
        let relation_list = [];
        for (let i = 0; i < this.relations.length; i++){
            relation_list.push(this.relations[i].serialize());
        }
        let tx_crossref = null;
        if(this.cross_ref != null){
            tx_crossref = this.cross_ref.serialize();
        }

        let tx_base = {
            "header": {
                "version": this.version,
                "timestamp": this.timestamp,
                "id_length": this.id_length
            },
            "events": event_list,
            "references": ref_list,
            "relations": relation_list,
            "witness": witness
        };

        let cross_ref = null;
        if (this.cross_ref != null){
            cross_ref = this.cross_ref.serialize();
        }

        let target = bson.serialize(tx_base);
        this.transaction_base_digest = new Buffer(await jscu.crypto.hash.getHash('SHA-256', target));

        if (for_id === true){
            return bson.serialize({
                "tx_base": this.transaction_base_digest,
                "cross_ref": cross_ref
            });
        }

        tx_base["cross_ref"] = tx_crossref;

        let signature_list = [];
        for (let i = 0; i < this.signatures.length; i++){
            signature_list.push(this.signatures[i].serialize());
        }

        let dat = bson.serialize({
            "transaction_base": tx_base,
            "signatures": signature_list
        });

        if (no_header === true) {
            return dat;
        }

        let format_type_buffer = new Buffer(2);
        format_type_buffer[1] = 0xff & 0x00;
        format_type_buffer[0] = 0xff & this.format_type;

        this.transaction_data = new Uint8Array(format_type_buffer.length + dat.length);
        this.transaction_data.set(format_type_buffer);
        this.transaction_data.set(dat,format_type_buffer.length);

        return this.transaction_data;
    }

    async deserialize(data){
        let bsondata = bson.deserialize(data);
        let tx_base = bsondata["transaction_base"];
        this.version = tx_base["header"]["version"];
        this.timestamp = tx_base["header"]["timestamp"];
        this.id_length = tx_base["header"]["id_length"];
        this.events = [];

        if (tx_base["events"].length > 0){
            for (let i = 0; i < tx_base["events"].length; i++){
                let event = new BBcEvent();
                event.deserialize(tx_base["events"][i]);
                this.events.push(event);
            }
        }

        this.references = [];
        if (tx_base["references"].length > 0){
            for (let i = 0; i < tx_base["references"].length; i++){
                let ref = new BBcReference(null,null,null,null);
                ref.deserialize(tx_base["references"][i]);
                this.references.push(ref);
            }
        }

        this.relations = [];
        if (tx_base["relations"].length > 0){
            for (let i = 0; i < tx_base["relations"].length; i++){
                let rtn = new BBcRelation();
                rtn.deserialize(tx_base["relations"][i]);
                this.relations.push(rtn);
            }
        }

        if (tx_base["witness"]){
            this.witness = new BBcWitness();
            this.witness.transaction = this;
            this.witness.deserialize(tx_base["witness"]);
        } else {
            this.witness = null;
        }

        if (tx_base["cross_ref"]){
            this.cross_ref = new BBcCrossRef();
            this.cross_ref.deserialize(cross_ref);
        }else{
            this.cross_ref = null;
        }

        this.signatures = [];
        if (bsondata["signatures"]){
            for (let i = 0 ; i < bsondata["signatures"].length ; i++){
                let sig = new BBcSignature(2);
                await sig.deserialize( bsondata["signatures"][i]);
                this.signatures.push(sig);
            }
        }

        await this.set_transaction_id();
        return true;
    }

    async sign(private_key, public_key, keypair){

        if (keypair == null){
            if (private_key.length != 32 || public_key.length <= 32) {

                return null;
            }

            keypair = new KeyPair();
            keypair.setKeyPair(private_key, public_key);
            if (keypair == null){

                return null;
            }
        }

        let sig = new BBcSignature(2);
        let s = await keypair.sign( await this.digest());
        if (s == null) {
            return null;
        }

        await sig.add(s, keypair.public_key);
        return sig
    }

}

var Base64 = {
    encode: (function(i, tbl) {
        for(i=0,tbl={64:61,63:47,62:43}; i<62; i++) {tbl[i]=i<26?i+65:(i<52?i+71:i-4);} //A-Za-z0-9+/=
        return function(arr) {
            var len, str, buf;
            if (!arr || !arr.length) {return "";}
            for(i=0,len=arr.length,buf=[],str=""; i<len; i+=3) { //6+2,4+4,2+6
                str += String.fromCharCode(
                    tbl[arr[i] >>> 2],
                    tbl[(arr[i]&3)<<4 | arr[i+1]>>>4],
                    tbl[i+1<len ? (arr[i+1]&15)<<2 | arr[i+2]>>>6 : 64],
                    tbl[i+2<len ? (arr[i+2]&63) : 64]
                );
            }
            return str;
        };
    }()),
    decode: (function(i, tbl) {
        for(i=0,tbl={61:64,47:63,43:62}; i<62; i++) {tbl[i<26?i+65:(i<52?i+71:i-4)]=i;} //A-Za-z0-9+/=
        return function(str) {
            var j, len, arr, buf;
            if (!str || !str.length) {return [];}
            for(i=0,len=str.length,arr=[],buf=[]; i<len; i+=4) { //6,2+4,4+2,6
                //for(i=0,len=str.length,arr=[],buf=[]; i<len; i+=4) { //6,2+4,4+2,6
                for(j=0; j<4; j++) {buf[j] = tbl[str.charCodeAt(i+j)||0];}
                arr.push(
                    buf[0]<<2|(buf[1]&63)>>>4,
                    (buf[1]&15)<<4|(buf[2]&63)>>>2,
                    (buf[2]&3)<<6|buf[3]&63
                );
            }
            if (buf[3]===64) {arr.pop();if (buf[2]===64) {arr.pop();}}
            return arr;
        };
    }())
};

async function create_pubkey_byte(pubkey){
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

function print_bin(bin){
    let d = "";
    for (let i = 0; i < bin.length ; i++){
        if (bin[i] < 16){
            d += "0";
        }
        d += bin[i].toString(16);
    }
    console.log(d);
}

