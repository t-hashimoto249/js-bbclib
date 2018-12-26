import jscu from 'js-crypto-utils';
import { BBcWitness } from './BBcWitness.js';
import { BBcReference } from './BBcReference.js';
import { BBcSignature } from './BBcSignature.js';
import { BBcRelation } from './BBcRelation.js';
import { BBcEvent } from './BBcEvent.js';
import { BBcCrossRef } from './BBcCrossRef';
import { KeyPair } from './KeyPair.js';
import * as para from '../parameter.js';
import * as helper from '../helper.js';
import jseu from 'js-encoding-utils';

const date = new Date();

export class BBcTransaction{

  constructor(version) {
    this.format_type = para.BBcFormat.FORMAT_BSON_COMPRESS_ZLIB;
    this.id_length = para.DefaultLength.BBcOne;
    this.version = version;
    this.timestamp = date.getTime(); //nano秒単位で記載
    //this.timestamp = 1545288535676620000;

    this.events = [];
    this.references = [];
    this.relations = [];
    this.witness = null;
    this.cross_ref = null;
    this.signatures = [];
    this.userid_sigidx_mapping = {};
    this.transaction_id = new Uint8Array(0);
    this.transaction_base_digest =  new Uint8Array(0);
    this.transaction_data = null;
    this.asset_group_ids = {};
    this.target_serialize = null;
  }

  show_str() {
    console.log('**************show_str*************** :');

    console.log('format_type :',this.format_type);
    console.log('id_length :', this.id_length);
    console.log('version :',this.version);
    console.log('timestamp :',this.timestamp);

    if (this.events.length > 0) {
      console.log('events');
      for (let i = 0; i < this.events.length; i++) {
        console.log('event[', i, '] :', this.events[i].show_event());
      }
    }

    console.log('references :',this.references);
    console.log('relations :',this.relations);
    if (this.witness !== null) {
      console.log(this.witness.show_str());
    } else {
      console.log(this.witness);
    }

    console.log('cross_ref :',this.cross_ref);
    console.log('signatures :',this.signatures);

    if (this.signatures != null && this.signatures.length > 0) {
      console.log('signatures length :',this.signatures.length);
      console.log(this.signatures[0].show_sig());
    } else {
      console.log(this.signatures);
    }
    console.log('userid_sigidx_mapping :',this.userid_sigidx_mapping);
    console.log('transaction_id :', jseu.encoder.arrayBufferToHexString(this.transaction_id));
    console.log('transaction_base_digest :', jseu.encoder.arrayBufferToHexString(this.transaction_base_digest));
    console.log('transaction_data :',this.transaction_data);
    console.log('asset_group_ids :',this.asset_group_ids);

  }

  add_parts(event, reference, relation, witness, cross_ref) {
    if (Array.isArray(event)) {
      if (event.length > 0) {
        for (let i = 0; i < event.length; i++) {
          this.events = event;
        }
      }
    }

    if (Array.isArray(reference)) {
      if (reference.length > 0) {
        for (let i = 0; i < reference.length; i++) {
          this.references = reference;
        }
      }
    }

    if (Array.isArray(relation)) {
      if (relation.length > 0) {
        for (let i = 0; i < relation.length; i++) {
          this.relations = relation;
        }
      }
    }

    if (witness != null) {
      this.witness = witness;
    }

    if (cross_ref != null) {
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

  add_event(event) {
    if (event != null) {
      this.events.push(event);
    }
  }

  add_reference(reference) {
    if (Array.isArray(reference)) {
      if (reference.length > 0) {
        for (let i = 0; i < reference.length; i++) {
          this.references = reference;
        }
      }
    }
  }

  add_relation(relation) {
    if (Array.isArray(relation)) {
      if (relation.length > 0) {
        for (let i = 0; i < relation.length; i++) {
          this.relations = relation;
        }
      }
    }
  }

  add_cross_ref(cross_ref) {
    if (cross_ref != null) {
      this.cross_ref = cross_ref;
    }
  }

  get_sig_index(user_id) {
    if (this.userid_sigidx_mapping[user_id] == null) {
      const sig_index_obj = Object.keys(this.userid_sigidx_mapping);
      this.userid_sigidx_mapping[user_id] = sig_index_obj.length;
      this.signatures.push(new BBcSignature(para.KeyType.ECDSA_P256v1));
    }
    return this.userid_sigidx_mapping[user_id];
  }

  add_signature(user_id, signature) {
    if (user_id in this.userid_sigidx_mapping) {
      const idx = this.userid_sigidx_mapping[user_id];
      this.signatures[idx] = signature;
      return true;
    } else {
      return false;
    }
  }

  async digest() {
    this.target_serialize = await this.get_digest_for_transaction_id();
    return this.target_serialize;
  }

  async set_transaction_id() {
    this.target_serialize = await this.get_digest_for_transaction_id();
    const id = await jscu.hash.compute(this.target_serialize, 'SHA-256');
    this.transaction_id = id.slice(0, this.id_length);
    return this.transaction_id;
  }

  async get_digest_for_transaction_id(){

    let binary_data = [];

    binary_data = binary_data.concat(Array.from(helper.hbo(this.version, 4)));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.timestamp, 8)));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.id_length, 2)));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.events.length, 2)));

    for (let i = 0; i < this.events.length; i++) {
      const packed_data = this.events[i].pack();
      binary_data = binary_data.concat(Array.from(helper.hbo(packed_data.length,4)));
      binary_data = binary_data.concat(Array.from(packed_data));
    }

    binary_data = binary_data.concat(Array.from(helper.hbo(this.references.length, 2)));
    for (let i = 0; i < this.references.length; i++) {
      const packed_data = this.references[i].pack();
      binary_data = binary_data.concat(Array.from(helper.hbo(packed_data.length,4)));
      binary_data = binary_data.concat(Array.from(packed_data));
    }

    binary_data = binary_data.concat(Array.from(helper.hbo(this.relations.length, 2)));
    for (let i = 0; i < this.relations.length; i++) {
      const packed_data = this.relations[i].pack();
      binary_data = binary_data.concat(Array.from(helper.hbo(packed_data.length,4)));
      binary_data = binary_data.concat(Array.from(packed_data));
    }

    if (this.witness !== null){
      binary_data = binary_data.concat(Array.from(helper.hbo(1, 2)));
      const packed_data = this.witness.pack();
      binary_data = binary_data.concat(Array.from(helper.hbo(packed_data.length,4)));
      binary_data = binary_data.concat(Array.from(packed_data));
    } else {
      binary_data = binary_data.concat(Array.from(helper.hbo(0, 2)));
    }
    return new Uint8Array(binary_data);
  }

  async pack() {

    let binary_data = [];

    binary_data = binary_data.concat(Array.from(helper.hbo(this.version, 4)));
    console.log("timestamp:::::::",this.timestamp);
    console.log("timestamp:::::::",typeof(this.timestamp));
    binary_data = binary_data.concat(Array.from(helper.hbo2(this.timestamp, 8)));
    //console.log("timestamp:::::::",typeof(this.timestamp));
    console.log("timestamp hbo:::::::",jseu.encoder.arrayBufferToHexString(helper.hbo(this.timestamp, 8)));
    console.log("timestamp hbo:::::::",helper.hbo(this.timestamp, 8));

    binary_data = binary_data.concat(Array.from(helper.hbo(this.id_length, 2)));

    binary_data = binary_data.concat(Array.from(helper.hbo(this.events.length, 2)));
    for (let i = 0; i < this.events.length; i++) {
      const packed_data = this.events[i].pack();
      binary_data = binary_data.concat(Array.from(helper.hbo(packed_data.length,4)));
      binary_data = binary_data.concat(Array.from(packed_data));
    }

    binary_data = binary_data.concat(Array.from(helper.hbo(this.references.length, 2)));
    for (let i = 0; i < this.references.length; i++) {
      const packed_data = this.references[i].pack();
      binary_data = binary_data.concat(Array.from(helper.hbo(packed_data.length,4)));
      binary_data = binary_data.concat(Array.from(packed_data));
    }

    binary_data = binary_data.concat(Array.from(helper.hbo(this.relations.length, 2)));
    for (let i = 0; i < this.relations.length; i++) {
      const packed_data = this.relations[i].pack();
      binary_data = binary_data.concat(Array.from(helper.hbo(packed_data.length,4)));
      binary_data = binary_data.concat(Array.from(packed_data));
    }

    if (this.witness !== null){
      binary_data = binary_data.concat(Array.from(helper.hbo(1, 2)));
      const packed_data = this.witness.pack();
      binary_data = binary_data.concat(Array.from(helper.hbo(packed_data.length,4)));
      binary_data = binary_data.concat(Array.from(packed_data));
    } else {
      binary_data = binary_data.concat(Array.from(helper.hbo(0, 2)));
    }

    if (this.cross_ref !== null){
      binary_data = binary_data.concat(Array.from(helper.hbo(1, 2)));
      const packed_data = this.cross_ref[i].pack();
      binary_data = binary_data.concat(Array.from(helper.hbo(packed_data.length,4)));
      binary_data = binary_data.concat(Array.from(packed_data));
    } else {
      binary_data = binary_data.concat(Array.from(helper.hbo(0, 2)));
    }

    binary_data = binary_data.concat(Array.from(helper.hbo(this.signatures.length, 2)));
    for (let i = 0; i < this.signatures.length; i++) {
      const packed_data = this.signatures[i].pack();
      binary_data = binary_data.concat(Array.from(packed_data.length));
      binary_data = binary_data.concat(Array.from(packed_data));
    }

    return new Uint8Array(binary_data);

  }

  async unpack(data) {

    let pos_s = 0;
    let pos_e = 4; // uint32
    this.version = helper.hboToInt32(data.slice(pos_s, pos_e));

    console.log('unpack version :',this.version);
    console.log('bin:', jseu.encoder.arrayBufferToHexString(data.slice(pos_s, pos_e)));

    pos_s = pos_e;
    pos_e = pos_e + 8;
    this.timestamp = helper.hboToInt64(data.slice(pos_s, pos_e));
    console.log('unpack timestamp :',this.timestamp);
    console.log('unpack timestamp :',typeof(this.timestamp));
    console.log('bin:', jseu.encoder.arrayBufferToHexString(data.slice(pos_s, pos_e)));

    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    this.id_length = helper.hboToInt16(data.slice(pos_s, pos_e));
    //console.log('unpack id_length :', this.id_length);
    //console.log('bin:', jseu.encoder.arrayBufferToHexString(data.slice(pos_s, pos_e)));


    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    const num_events = helper.hboToInt16(data.slice(pos_s, pos_e));

    //console.log("de num_events:",num_events );
    //console.log('bin:', jseu.encoder.arrayBufferToHexString(data.slice(pos_s, pos_e)));

    if(num_events > 0){
      for (let i =0; i < num_events; i++){
        pos_s = pos_e;
        pos_e = pos_e + 4; // uint16
        const event_length = helper.hboToInt32(data.slice(pos_s, pos_e));

        pos_s = pos_e;
        pos_e = pos_e + event_length; // uint16
        const event_bin = data.slice(pos_s, pos_e);
        const event = new BBcEvent();
        event.unpack(event_bin);
        this.events.push(event);
      }
    }

    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    const num_reference = helper.hboToInt16(data.slice(pos_s, pos_e));

    //console.log("de num_reference:",num_reference );
    //console.log('bin:', jseu.encoder.arrayBufferToHexString(data.slice(pos_s, pos_e)));

    if(num_reference > 0){
      for (let i =0; i < num_reference; i++){
        pos_s = pos_e;
        pos_e = pos_e + 4; // uint16
        const reference_length = helper.hboToInt32(data.slice(pos_s, pos_e));
        //console.log("de reference_length:",reference_length );
        //console.log('bin:', jseu.encoder.arrayBufferToHexString(data.slice(pos_s, pos_e)));

        pos_s = pos_e;
        pos_e = pos_e + reference_length; // uint16
        const reference_bin = data.slice(pos_s, pos_e);
        const ref = new BBcReference(null, null, null, null);
        ref.unpack(reference_bin);
        this.references.push(ref);
      }
    }

    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    const num_relation = helper.hboToInt16(data.slice(pos_s, pos_e));

    //console.log("de num relation:",num_relation );
    //console.log('bin:', jseu.encoder.arrayBufferToHexString(data.slice(pos_s, pos_e)));

    if(num_relation > 0){
      for (let i =0; i < num_relation; i++){
        pos_s = pos_e;
        pos_e = pos_e + 4; // uint16
        const relation_length = helper.hboToInt32(data.slice(pos_s, pos_e));
        //console.log("de relations length:", relation_length );
        //console.log('bin:', jseu.encoder.arrayBufferToHexString(data.slice(pos_s, pos_e)));

        pos_s = pos_e;
        pos_e = pos_e + relation_length; // uint16
        const relation_bin = data.slice(pos_s, pos_e);
        const rtn = new BBcRelation();
        rtn.unpack(relation_bin);
        //console.log("de relations --------------------:",relation_length );
        //console.log('bin:', jseu.encoder.arrayBufferToHexString(data.slice(pos_s, pos_e)));

        //rtn.show_relation();

        this.relations.push(rtn);
      }
    }

    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    const num_witness = helper.hboToInt16(data.slice(pos_s, pos_e));
    //console.log("de num num_witness:",num_witness );
    //console.log("de num num_witness:", data.slice(pos_s, pos_e ));

    if(num_witness > 0){
      for (let i =0; i < num_witness; i++){
        pos_s = pos_e;
        pos_e = pos_e + 4; // uint16

        const witness_length = helper.hboToInt32(data.slice(pos_s, pos_e));
        pos_s = pos_e;
        pos_e = pos_e + witness_length; // uint16

        const witness_bin = data.slice(pos_s, pos_e);
        this.witness = new BBcWitness();
        this.witness.unpack(witness_bin);
        this.witness.show_str();
        this.witness.transaction = this;
      }
    }

    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    const num_crossref = helper.hboToInt16(data.slice(pos_s, pos_e));

    //console.log("de num num_crossref:",num_crossref );
    //console.log('bin:', jseu.encoder.arrayBufferToHexString(data.slice(pos_s, pos_e)));

    if(num_crossref > 0){
      for (let i =0; i < num_crossref; i++){
        pos_s = pos_e;
        pos_e = pos_e + 4; // uint16
        const crossref_length = helper.hboToInt32(data.slice(pos_s, pos_e));

        pos_s = pos_e;
        pos_e = pos_e + crossref_length; // uint16
        const crossref_bin = data.slice(pos_s, pos_e);

        this.cross_ref = new BBcCrossRef();
        this.cross_ref.unpack(crossref_bin);
      }
    }

    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    const num_signature = helper.hboToInt16(data.slice(pos_s, pos_e));

    //console.log("de num num_signature:",num_signature );
    //console.log('bin:', jseu.encoder.arrayBufferToHexString(data.slice(pos_s, pos_e)));
    if(num_signature > 0){
      for (let i =0; i < num_signature; i++){
        pos_s = pos_e;
        pos_e = pos_e + 4; // uint16
        const signature_length = helper.hboToInt32(data.slice(pos_s, pos_e));
        //console.log("de num signature_length:",signature_length );
        //console.log('bin:', jseu.encoder.arrayBufferToHexString(data.slice(pos_s, pos_e)));

        pos_s = pos_e;
        pos_e = pos_e + signature_length; // uint16
        const signature_bin = data.slice(pos_s, pos_e);
        //console.log("de signature_bin:",signature_bin );
        //console.log('bin:', jseu.encoder.arrayBufferToHexString(data.slice(pos_s, pos_e)));
        const sig = new BBcSignature(2);
        await sig.unpack(signature_bin);
        this.signatures.push(sig);
      }
    }

    return true;
  }

  async sign(private_key, public_key, key_pair) {

    if (key_pair === null) {
      if (private_key.length !== 32 || public_key.length <= 32) {

        return null;
      }

      key_pair = new KeyPair();
      key_pair.set_key_pair(private_key, public_key);
      if (key_pair == null) {

        return null;
      }
    }

    const sig = new BBcSignature(para.KeyType.ECDSA_P256v1);
    const s = await key_pair.sign(await this.digest());
    if (s === null) {
      return null;
    }

    await sig.add(s, key_pair.public_key);
    return sig;
  }

}


