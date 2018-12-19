import jscu from 'js-crypto-utils';
import jseu from 'js-encoding-utils';

import * as para from '../parameter.js';
import * as helper from '../helper';

const bson = require('bson');

export class BBcAsset{
  constructor(user_id) {
    this.set_length(para.DefaultLength.BBcOne); // int
    this.add_user_id (user_id); // Uint8Array
    this.asset_id = new Uint8Array(this.id_length); // Uint8Array
    this.nonce = new Uint8Array(this.id_length); // Uint8Array
    this.asset_file_size = 0; // int
    this.asset_file_digest = new Uint8Array(0); // Uint8Array
    this.asset_body_type = 0; // int
    this.asset_body_size = 0; // int
    this.asset_body = new Uint8Array(0); // Uint8Array
  }

  set_length(id_length){
    this.id_length = id_length;
  }

  show_asset() {
    if (this.asset_id != null) {
      console.log('this.asset_id :', jseu.encoder.arrayBufferToHexString(this.asset_id));
    }
    console.log('this.user_id :', jseu.encoder.arrayBufferToHexString(this.user_id));
    console.log('this.nonce :', jseu.encoder.arrayBufferToHexString(this.nonce));
    console.log('this.asset_file_size :', this.asset_file_size);
    console.log('this.asset_file_digest :', jseu.encoder.arrayBufferToHexString(this.asset_file_digest));
    console.log('this.asset_body_type', this.asset_body_type);
    console.log('this.asset_body_size', this.asset_body_size);
    console.log('this.asset_body :', jseu.encoder.arrayBufferToHexString(this.asset_body));
  }

  async set_random_nonce() {
    this.nonce = await jscu.random.getRandomBytes(this.id_length);
  }

  set_nonce(nonce) {
    this.nonce = nonce;
  }

  add_user_id(user_id) {
    if (user_id != null) {
      this.user_id = user_id;
    }
  }

  async add_asset(asset_file, asset_body) {
    if (asset_file !== null) {
      this.asset_file_size = asset_file.length;
      this.asset_file_digest = await jscu.hash.compute(asset_file, 'SHA-256');
    }

    if (asset_body !== null) {
      this.asset_body = asset_body;
      this.asset_body_size = asset_body.length;
    }
    await this.digest();

    return true;
  }

  async digest() {
    const target = this.get_digest();
    const id = await jscu.hash.compute(target, 'SHA-256');
    this.asset_id = id.slice(0, this.id_length);
    return this.asset_id;
  }

  async set_asset_id() {
    const target = this.get_digest();
    this.asset_id = await jscu.hash.compute(target, 'SHA-256');
    return this.asset_id;
  }

  get_asset_file() {
    return this.asset_file;
  }

  get_asset_file_digest() {
    return this.asset_file_digest;
  }

  get_asset_digest() {
    return this.asset_file_digest;
  }

  async check_asset_file(asset_file) {
    const digest = await jscu.hash.compute(asset_file, 'SHA-256');
    return (digest === this.asset_file_digest);
  }

  get_digest() {

    let binary_data = [];
    binary_data = binary_data.concat(Array.from(this.user_id));
    binary_data = binary_data.concat(Array.from(this.nonce));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.asset_file_size)));
    if (this.asset_file_size > 0 && this.asset_file_size != null){
      binary_data = binary_data.concat(Array.from(this.asset_file_digest));
    }
    binary_data = binary_data.concat(Array.from(helper.hbo(this.asset_body_type)));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.asset_body_size)));
    if (this.asset_body_size > 0 && this.asset_body != null){
      binary_data = binary_data.concat(Array.from(this.asset_body));
    }

    return new Uint8Array(binary_data);
  }

  serialize() {

    let binary_data = [];
    binary_data = binary_data.concat(Array.from(helper.hbo(this.asset_id.length, 2)));
    binary_data = binary_data.concat(Array.from(this.asset_id));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.user_id.length, 2)));
    binary_data = binary_data.concat(Array.from(this.user_id));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.nonce.length, 2)));
    binary_data = binary_data.concat(Array.from(this.nonce));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.asset_file_size, 4)));
    if (this.asset_file_size > 0 ){
      binary_data = binary_data.concat(Array.from(this.asset_file_digest));
    }
    binary_data = binary_data.concat(Array.from(helper.hbo(this.asset_body_type, 2)));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.asset_body_size, 2)));
    if (this.asset_body_size > 0 && this.asset_body != null){
      binary_data = binary_data.concat(Array.from(this.asset_body));
    }

    return new Uint8Array(binary_data);
  }

  deserialize(data) {
    let value_length = 0;
    let pos_s = 0;
    let pos_e = 2; // uint16
    value_length =  helper.hboToInt16(data.slice(pos_s,pos_e));

    if (value_length > 0){
      pos_s = pos_e;
      pos_e = pos_e + value_length;
      this.asset_id = data.slice(pos_s,pos_e);

    }

    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    value_length =  helper.hboToInt16(data.slice(pos_s,pos_e));
    if (value_length > 0) {
      pos_s = pos_e;
      pos_e = pos_e + value_length;
      this.user_id = data.slice(pos_s, pos_e);
    }

    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    value_length =  helper.hboToInt16(data.slice(pos_s,pos_e));
    if (value_length > 0) {
      pos_s = pos_e;
      pos_e = pos_e + value_length;
      this.nonce = data.slice(pos_s,pos_e);
    }

    pos_s = pos_e;
    pos_e = pos_e + 4;  // uint32
    this.asset_file_size = helper.hboToInt32(data.slice(pos_s,pos_e));

    if (this.asset_file_size > 0){
      pos_s = pos_e;
      pos_e = pos_e + this.asset_file_size;
      this.asset_file_digest = data.slice(pos_s,pos_e);
    }

    pos_s = pos_e;
    pos_e = pos_e + 2;  // uint16
    this.asset_body_type = helper.hboToInt16(data.slice(pos_s,pos_e));

    pos_s = pos_e;
    pos_e = pos_e + 2;  // uint16
    this.asset_body_size = helper.hboToInt16(data.slice(pos_s,pos_e));

    if (this.asset_body_size > 0) {
      pos_s = pos_e;
      pos_e = pos_e + this.asset_body_size;
      this.asset_body = data.slice(pos_s, pos_e);
    }

    return true;
  }

}


