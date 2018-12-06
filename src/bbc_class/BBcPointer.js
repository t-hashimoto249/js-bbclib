import * as para from '../parameter.js';
import { Buffer } from 'buffer';

export class BBcPointer{
  constructor(transaction_id, asset_id) {
    this.id_length = para.DefaultLength.BBcOne;
    if (transaction_id != null) {
      this.transaction_id = transaction_id;
    } else {
      this.transaction_id = new Buffer( this.id_length );
    }

    if (asset_id != null) {
      this.asset_id = asset_id;
    } else {
      this.asset_id = new Buffer( this.id_length );
    }
  }

  show_pointer() {
    console.log('transaction_id',this.transaction_id.toString('hex'));
    console.log('asset_id',this.asset_id.toString('hex'));
  }

  set_transaction_id(transaction_id) {
    this.transaction_id = transaction_id;
  }

  set_asset_id(asset_id) {
    this.asset_id = asset_id;
  }

  serialize() {
    return {
      'transaction_id': this.transaction_id,
      'asset_id': this.asset_id
    };
  }

  deserialize(data) {
    this.transaction_id = data['transaction_id'];
    this.asset_id = data['asset_id'];
    return true;
  }

}

