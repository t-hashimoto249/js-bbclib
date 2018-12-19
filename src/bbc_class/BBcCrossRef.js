import jseu from 'js-encoding-utils';
import * as helper from '../helper';

export class BBcCrossRef{
  constructor(domain_id, transaction_id) {
    this.domain_id = domain_id; // Uint8Array
    this.transaction_id = transaction_id; // Uint8Array
  }

  show_cross_rf() {
    // eslint-disable-next-line no-console
    console.log('domain_id :', jseu.encoder.arrayBufferToHexString(this.domain_id));
    // eslint-disable-next-line no-console
    console.log('transaction_id :',jseu.encoder.arrayBufferToHexString(this.transaction_id));
  }

  set_domain_id(domain_id) {
    this.domain_id = domain_id;
  }

  set_transaction_id(transaction_id) {
    this.transaction_id = transaction_id;
  }

  pack() {
    let binary_data = [];
    binary_data = binary_data.concat(Array.from(helper.hbo(this.domain_id.length, 2)));
    binary_data = binary_data.concat(Array.from(this.domain_id));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.transaction_id.length, 2)));
    binary_data = binary_data.concat(Array.from(this.transaction_id));
    return new Uint8Array(binary_data);
  }

  unpack(data) {
    let value_length;

    let pos_s = 0;
    let pos_e = 2;
    value_length =  helper.hboToInt16(data.slice(pos_s,pos_e));
    pos_s = pos_e;
    pos_e = pos_e + value_length;
    this.domain_id = data.slice(pos_s,pos_e);

    pos_s = pos_e;
    pos_e = pos_e + 2;
    value_length =  helper.hboToInt16(data.slice(pos_s,pos_e));
    pos_s = pos_e;
    pos_e = pos_e + value_length;
    this.transaction_id = data.slice(pos_s,pos_e);
  }
}
