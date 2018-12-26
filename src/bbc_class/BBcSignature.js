import { KeyPair } from './KeyPair.js';
import jseu from 'js-encoding-utils';
import * as helper from '../helper.js';

import { Buffer } from 'buffer';

export class BBcSignature{
  constructor(key_type) {
    this.key_type = key_type;
    this.signature = new Uint8Array(0);
    this.pubkey = null;
    this.pubkey_byte = new Uint8Array(0);;
    this.keypair = null;
    this.not_initialized = true;
  }

  show_sig() {
    console.log('key_type :',this.key_type);
    console.log('signature :', jseu.encoder.arrayBufferToHexString(this.signature));
    if (this.pubkey != null){
      console.log('pubkey :', this.pubkey);
    }
    console.log('pubkey_byte :', jseu.encoder.arrayBufferToHexString(this.pubkey_byte));
    if (this.keypair != null) {
      console.log('keypair :', this.keypair);
    }
    console.log('not_initialized :',this.not_initialized);
  }

  async add(signature, pub_key) {
    if (signature != null) {
      this.not_initialized = false;
      this.signature = signature;
    }

    if (pub_key != null) {
      this.pubkey = pub_key;
      this.pubkey_byte = await helper.create_pubkey_byte(pub_key);
      this.keypair = new KeyPair();
      this.keypair.set_key_pair(null, pub_key);
    }

    return true;
  }

  add_signature(signature) {
    this.signature = signature;
  }

  pack() {

    let binary_data = [];

    binary_data = binary_data.concat(Array.from(helper.hbo(this.key_type,4)));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.pubkey_byte.length * 8, 4)));
    binary_data = binary_data.concat(Array.from(this.pubkey_byte));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.signature.length * 8, 4)));
    binary_data = binary_data.concat(Array.from(this.signature));

    return new Uint8Array(binary_data);
  }

  async unpack(data) {
    let pos_s = 0;
    let pos_e = 4; // uint32
    this.key_type =  helper.hboToInt32(data.slice(pos_s,pos_e));

    pos_s = pos_e;
    pos_e = pos_e + 4; // uint32
    let value_length =  helper.hboToInt32(data.slice(pos_s,pos_e));

    if (value_length > 0) {
      pos_s = pos_e;
      pos_e = pos_e + (value_length / 8);
      this.pubkey_byte = data.slice(pos_s, pos_e);
    }

    pos_s = pos_e;
    pos_e = pos_e + 4; // uint32
    value_length =  helper.hboToInt32(data.slice(pos_s,pos_e));

    if (value_length > 0) {
      pos_s = pos_e;
      pos_e = pos_e + (value_length / 8 );
      this.signature = data.slice(pos_s, pos_e);
    }

    //65byteの鍵形式からJwkへ変換してinput
    await this.add(this.signature, this.convertRawHexKeyToJwk(this.pubkey_byte, 'P-256'));
    return true;
  }

  async verify(digest) {
    if (this.keypair === null) {
      return false;
    }
    return await this.keypair.verify(digest, this.signature);
  }

  convertRawHexKeyToJwk(hexKeyObj, algorithm) {
    const len = 16;
    const offset = 1;
    const hexX = hexKeyObj.slice(offset, offset + len * 2);
    const hexY = hexKeyObj.slice(offset + len * 2, offset + len * 4);
    const b64uX = jseu.encoder.encodeBase64Url(hexX);
    const b64uY = jseu.encoder.encodeBase64Url(hexY);

    return { // https://www.rfc-editor.org/rfc/rfc7518.txt
      crv: algorithm,
      ext: true,
      kty: 'EC', // or "RSA", "oct"
      x: b64uX, // hex to base64url
      y: b64uY
    };
  }

}

