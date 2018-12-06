import * as para from '../parameter.js';

export class BBcWitness{
  constructor() {
    this.id_length = para.DefaultLength.BBcOne;
    this.transaction = null;
    this.user_ids = [];
    this.sig_indices = [];
  }

  show_str() {
    console.log('this.transaction :',this.transaction);
    for (let i = 0; i < this.user_ids.length; i++) {
      console.log('this.user_ids[', i, '] :',this.user_ids[i].toString('hex'));
    }
    for (let i = 0; i < this.sig_indices.length; i++) {
      console.log('this.sig_indices[', i, '] :',this.sig_indices[i]);
    }
  }

  add_witness(user_id) {
    if (this.user_ids.indexOf(user_id) === -1) {
      this.user_ids.push(user_id);
      this.sig_indices.push(this.transaction.get_sig_index(user_id));
    }
  }

  add_signature(user_id, signature) {
    this.transaction.add_signature(user_id, signature);
  }

  add_user(user) {
    if (user != null) {
      this.user_ids.push(user);
      return true;
    }
    return false;
  }

  add_sig_indices(index) {
    if (index != null) {
      this.sig_indices.push(index);
      return true;
    }
    return false;
  }

  serialize() {
    return {
      'user_ids': this.user_ids,
      'sig_indices': this.sig_indices
    };
  }

  deserialize(json_data) {
    this.user_ids = json_data['user_ids'];
    this.sig_indices = json_data['sig_indices'];
    if (this.user_ids.length > 0) {
      for (let i = 0; i < this.user_ids.length; i++) {
        this.transaction.get_sig_index(this.user_ids[i]);
      }
    }
    return true;
  }

}
