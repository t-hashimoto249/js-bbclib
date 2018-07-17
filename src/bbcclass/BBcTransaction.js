import jscu from "js-crypto-utils";
import BBcWitness from './BBcWitness.js';
import BBcReference from './BBcReference.js';
import BBcSignature from './BBcSignature.js';
import BBcRelation from './BBcRelation.js';
import BBcEvent from './BBcEvent.js';
import BBcCrossRef from './BBcCrossRef';
import KeyPair from "./KeyPair.js";
import * as para from './Parameter.js';

let BSON = require('bson');
let bson = new BSON();

let date = new Date() ;

export default class {

    constructor(version){
        this.format_type = para.BBcFormat.FORMAT_BSON;
        this.id_length = para.DefaultLength.BBcSimple;
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
                console.log(this.events[i].show_event());
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
            console.log(this.signatures[0].show_sig());
        }else{
            console.log(this.signatures);
        }
        console.log("userid_sigidx_mapping");
        console.log(this.userid_sigidx_mapping);
        console.log("transaction_id");
        console.log(this.transaction_id);
        console.log("transaction_base_digest");
        console.log(this.transaction_base_digest);
        console.log("transaction_data");
        console.log(this.transaction_data);
        console.log("asset_group_ids");
        console.log(this.asset_group_ids);
    }

    add_parts(event, reference, relation, witness, cross_ref){
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

    add_reference(reference){
        if (Array.isArray(reference)){
            if (reference.length > 0){
                for(let i = 0; i < reference.length; i++){
                    this.references =　reference;
                }
            }
        }
    }

    add_relation(relation){
        if (Array.isArray(relation)){
            if (relation.length > 0){
                for(let i = 0; i < relation.length; i++){
                    this.relations =　relation;
                }
            }
        }
    }

    add_cross_ref(cross_ref){
        if (cross_ref != null){
            this.cross_ref = cross_ref;
        }
    }

    get_sig_index(user_id){
        if (this.userid_sigidx_mapping[user_id] == null) {
            let sig_index_obj = Object.keys(this.userid_sigidx_mapping);
            this.userid_sigidx_mapping[user_id] = sig_index_obj.length;
            this.signatures.push(new BBcSignature(para.KeyType.ECDSA_P256v1));
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

    async serialize(for_id, no_header){
        let witness = null;
        if (this.witness != null){
            witness = this.witness.serialize();
        }
        let event_list = [];
        for (let i = 0; i < this.events.length; i++){
            event_list.push(this.events[i].serialize());
            para.print_bin(this.events[i].serialize());

        }
        let ref_list = [];
        for (let i = 0; i < this.references.length; i++){
            ref_list.push(this.references[i].serialize());
        }
        let relation_list = [];
        for (let i = 0; i < this.relations.length; i++){
            relation_list.push(this.relations[i].serialize());
        }
        let tx_cross_ref = null;
        if(this.cross_ref != null){
            tx_cross_ref = this.cross_ref.serialize();
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

        let target = bson.serialize(tx_base,{});
        this.transaction_base_digest = new Buffer(await jscu.crypto.hash.getHash('SHA-256', target));

        if (for_id === true){
            return bson.serialize({
                "tx_base": this.transaction_base_digest,
                "cross_ref": cross_ref
            },{});
        }

        tx_base["cross_ref"] = tx_cross_ref;

        let signature_list = [];
        for (let i = 0; i < this.signatures.length; i++){
            signature_list.push(this.signatures[i].serialize());
        }

        let dat = bson.serialize({
            "transaction_base": tx_base,
            "signatures": signature_list
        },{});

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
        let bson_data = bson.deserialize(data,{});
        let tx_base = bson_data["transaction_base"];
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
        if (bson_data["signatures"]){
            for (let i = 0 ; i < bson_data["signatures"].length ; i++){
                let sig = new BBcSignature(2);
                await sig.deserialize( bson_data["signatures"][i]);
                this.signatures.push(sig);
            }
        }

        await this.set_transaction_id();
        return true;
    }

    async sign(private_key, public_key, key_pair){

        if (key_pair == null){
            if (private_key.length !== 32 || public_key.length <= 32) {

                return null;
            }

            key_pair = new KeyPair();
            key_pair.set_key_pair(private_key, public_key);
            if (key_pair == null){

                return null;
            }
        }

        let sig = new BBcSignature(para.KeyType.ECDSA_P256v1);
        let s = await key_pair.sign( await this.digest());
        if (s == null) {
            return null;
        }

        await sig.add(s, key_pair.public_key);
        return sig
    }

}


