import * as para from '../parameter.js';
import * as helper from '../helper.js';

export class BBcReference{
  constructor(asset_group_id, transaction, ref_transaction, event_index_in_ref) {
    this.id_length = para.DefaultLength.BBcOne;
    this.asset_group_id = asset_group_id;
    this.transaction_id = new Uint8Array(this.id_length);
    this.transaction = transaction;
    this.ref_transaction = ref_transaction;
    this.event_index_in_ref = event_index_in_ref;
    this.sig_indices = [];
    this.mandatory_approvers = null;
    this.option_approvers = null;
    this.option_sig_ids = [];
    if (ref_transaction == null) {
      return;
    }
    this.prepare_reference(ref_transaction);
  }

  prepare_reference(ref_transaction) {
    this.ref_transaction = ref_transaction;
    try {

      const evt = ref_transaction.events[this.event_index_in_ref];
      for (let i = 0; i < evt.mandatory_approvers.length; i++) {
        this.sig_indices.append(this.transaction.get_sig_index(evt.mandatory_approvers[i]));
      }

      for (let i = 0; i < evt.option_approver_num_numerator.length(); i++) {
        const dummy_id = helper.get_random_value(4);
        this.option_sig_ids.append(dummy_id);
        this.sig_indices.append(this.transaction.get_sig_index(dummy_id));
        this.mandatory_approvers = evt.mandatory_approvers;
        this.option_approvers = evt.option_approvers;
        this.transaction_id = ref_transaction.digest();
      }
    } catch (e) {
      //print(e);
    }

  }

  add_signature(user_id, signature) {
    if (user_id === true) {
      if (this.option_sig_ids.length === 0) {
        return;
      }
      // TODO: ここの動作をきく
      //user_id = this.option_sig_ids.pop(0);

    }
    this.transaction.add_signature(user_id, signature);
  }

  get_referred_transaction() {
    return {key: this.ref_transaction.serialize()};
  }

  get_destinations() {
    return this.mandatory_approvers + this.option_approvers;
  }

  pack() {
    let binary_data = [];

    binary_data = binary_data.concat(Array.from(helper.hbo(this.asset_group_id.length, 2)));
    binary_data = binary_data.concat(Array.from(this.asset_group_id));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.transaction_id.length, 2)));
    binary_data = binary_data.concat(Array.from(this.transaction_id));

    binary_data = binary_data.concat(Array.from(helper.hbo(this.event_index_in_ref, 2)));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.sig_indices.length, 2)));

    for (let i = 0; i < this.sig_indices.length; i++){
      binary_data = binary_data.concat(Array.from(helper.hbo(this.sig_indices[i], 2)));
    }

    return new Uint8Array(binary_data);

  }

  unpack(data) {
    let pos_s = 0;
    let pos_e = 2; // uint16
    let value_length = helper.hboToInt16(data.slice(pos_s, pos_e));

    pos_s = pos_e;
    pos_e = pos_e + value_length;
    this.asset_group_id = data.slice(pos_s, pos_e);

    pos_s = pos_e;
    pos_e = pos_e + 2;
    value_length = helper.hboToInt16(data.slice(pos_s, pos_e));

    pos_s = pos_e;
    pos_e = pos_e + value_length;
    this.transaction_id = data.slice(pos_s, pos_e);

    pos_s = pos_e;
    pos_e = pos_e + 2;
    this.event_index_in_ref = helper.hboToInt16(data.slice(pos_s, pos_e));

    pos_s = pos_e;
    pos_e = pos_e + 2;
    const num_sig_indices = helper.hboToInt16(data.slice(pos_s, pos_e));

    if (num_sig_indices > 0){
      for (let i =0; i < num_sig_indices; i++){
        pos_s = pos_e;
        pos_e = pos_e + 2;
        const sig_indice = helper.hboToInt16(data.slice(pos_s, pos_e));
        this.sig_indices.push(sig_indice);
      }
    }

    return true;
  }

}
