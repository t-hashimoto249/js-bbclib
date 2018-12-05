import * as para from '../parameter.js';
import * as helper from '../helper.js';
import { Buffer } from 'buffer';

export class BBcReference{
  constructor(asset_group_id, transaction, ref_transaction, event_index_in_ref) {
    this.id_length = para.DefaultLength.BBcOne;
    this.asset_group_id = asset_group_id;
    this.transaction_id = new Buffer(this.id_length);
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

  serialize() {
    return {
      'asset_group_id': this.asset_group_id,
      'transaction_id': this.transaction_id,
      'event_index_in_ref': this.event_index_in_ref,
      'sig_indices': this.sig_indices
    };
  }

  deserialize(data) {
    this.asset_group_id = data['asset_group_id'];
    this.transaction_id = data['transaction_id'];
    this.event_index_in_ref = data['event_index_in_ref'];
    this.sig_indices = data['sig_indices'];
    return true;
  }

}
