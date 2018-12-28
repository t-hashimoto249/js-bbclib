import * as para from '../parameter.js';
import { Buffer } from 'buffer';
import jseu from 'js-encoding-utils';
import * as helper from '../helper';

export class BBcPointer{
  constructor(transaction_id, asset_id) {
    this.id_length = para.DefaultLength.BBcOne;
    if (transaction_id != null) {
      this.transaction_id = transaction_id;
    } else {
      this.transaction_id = new Uint8Array( this.id_length );
    }

    this.asset_id = asset_id;
    this.asset_id_existence = 0;
    if (asset_id != null) {
      this.asset_id_existence = 1;
    } else {
      this.asset_id_existence = 0;
    }
  }

  show_pointer() {
    console.log('transaction_id', jseu.encoder.arrayBufferToHexString(this.transaction_id));
    if (this.asset_id != null) {
      console.log('asset_id', jseu.encoder.arrayBufferToHexString(this.asset_id));
    }
  }

  set_transaction_id(transaction_id) {
    this.transaction_id = transaction_id;
  }

  set_asset_id(asset_id) {
    this.asset_id = asset_id;
    if(asset_id != null) {
      this.asset_id_existence = 1;
    } else {
      this.asset_id_existence = 0;
    }
  }

  pack() {
    let binary_data = [];
    binary_data = binary_data.concat(Array.from(helper.hbo(this.transaction_id.length, 2)));
    binary_data = binary_data.concat(Array.from(this.transaction_id));
    if (this.asset_id_existence > 0) {
      binary_data = binary_data.concat(Array.from(helper.hbo(this.asset_id_existence, 2)));
      binary_data = binary_data.concat(Array.from(helper.hbo(this.asset_id.length, 2)));
      binary_data = binary_data.concat(Array.from(this.asset_id));
    } else {
      binary_data = binary_data.concat(Array.from(helper.hbo(this.asset_id_existence, 2)));
    }

    return new Uint8Array(binary_data);
  }

  unpack(data) {
    let pos_s = 0;
    let pos_e = 2; // uint16
    let value_length =  helper.hboToInt16(data.slice(pos_s,pos_e));

    pos_s = pos_e;
    pos_e = pos_e + value_length;
    this.transaction_id = data.slice(pos_s,pos_e);

    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    this.asset_id_existence =  helper.hboToInt16(data.slice(pos_s,pos_e));
    if (this.asset_id_existence > 0) {
      pos_s = pos_e;
      pos_e = pos_e + 2; //uint16
      value_length = helper.hboToInt16(data.slice(pos_s, pos_e));

      pos_s = pos_e;
      pos_e = pos_e + value_length;
      this.asset_id = data.slice(pos_s, pos_e);
    }

    return true;
  }

}

