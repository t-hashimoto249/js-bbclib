import { BBcAsset } from './BBcAsset.js';
import * as para from '../parameter.js';
import jseu from 'js-encoding-utils';
import * as helper from '../helper';

export class BBcEvent{
  constructor(asset_group_id) {
    this.id_length = para.DefaultLength.BBcOne;
    this.asset_group_id = asset_group_id;
    this.reference_indices = [];
    this.mandatory_approvers = [];
    this.option_approver_num_numerator = 0;
    this.option_approver_num_denominator = 0;
    this.option_approvers = [];
    this.asset = null;
  }

  show_event() {
    console.log('------show_event-------');

    console.log('id_length :',this.id_length);
    console.log('asset_group_id :', jseu.encoder.arrayBufferToHexString(this.asset_group_id));

    console.log('this.reference_indices.length  :',this.reference_indices.length );
    if (this.reference_indices.length > 0) {
      for (let i = 0; i < this.reference_indices.length; i++) {
        console.log('reference_indices[', i, '] :', this.reference_indices[i]);
      }
    }
    console.log('this.mandatory_approvers.length  :',this.mandatory_approvers.length );
    if (this.mandatory_approvers.length > 0) {
      for (let i = 0; i < this.mandatory_approvers.length; i++) {
        console.log('mandatory_approvers[', i, '] :', jseu.encoder.arrayBufferToHexString(this.mandatory_approvers[i]));
      }
    }

    console.log('option_approver_num_numerator :',this.option_approver_num_numerator);
    console.log('option_approver_num_denominator :',this.option_approver_num_denominator);
    if (this.option_approver_num_denominator.length > 0) {
      for (let i = 0; i < this.option_approver_num_denominator.length; i++) {
        console.log('option_approvers [', i, ']',  jseu.encoder.arrayBufferToHexString(this.option_approvers[i]));
      }
    }
    if (this.asset != null) {
      console.log('asset :');
      this.asset.show_asset()
    }
    console.log('------show_event end-------');
  }

  add_asset_group_id(asset_group_id) {
    this.asset_group_id = asset_group_id;
  }

  add_reference_indices(reference_indices) {
    this.reference_indices.push(reference_indices);
  }

  add_mandatory_approver(mandatory_approver) {
    this.mandatory_approvers.push(mandatory_approver);
  }

  add_option_approver_num_numerator(option_approver_num_numerator) {
    this.option_approver_num_numerator = option_approver_num_numerator;
  }

  add_option_approver_num_denominator(option_approver_num_denominator) {
    this.option_approver_num_denominator = option_approver_num_denominator;
  }

  add_option_approver(option_approver) {
    this.option_approver = option_approver;
  }

  add_asset(asset) {
    this.asset = asset;
  }

  pack() {
    let asset = null;
    if (this.asset != null) {
      asset = this.asset.pack();
    }

    let binary_data = [];
    binary_data = binary_data.concat(Array.from(helper.hbo(this.asset_group_id.length, 2)));
    binary_data = binary_data.concat(Array.from(this.asset_group_id));

    binary_data = binary_data.concat(Array.from(helper.hbo(this.reference_indices.length,2)));
    if(this.reference_indices.length > 0){
      for (let i = 0; i < this.reference_indices.length; i++){
        binary_data = binary_data.concat(Array.from(helper.hbo(this.reference_indices[i],2)));
      }
    }

    binary_data = binary_data.concat(Array.from(helper.hbo(this.mandatory_approvers.length,2)));
    if(this.mandatory_approvers.length > 0){
      for (let i = 0; i < this.mandatory_approvers.length; i++){
        binary_data = binary_data.concat(Array.from(helper.hbo(this.mandatory_approvers[i].length, 2)));
        binary_data = binary_data.concat(Array.from(this.mandatory_approvers[i]));
      }
    }

    binary_data = binary_data.concat(Array.from(helper.hbo(this.option_approver_num_numerator.length,2)));
    binary_data = binary_data.concat(Array.from(helper.hbo(this.option_approver_num_denominator,2)));
    if(this.option_approver_num_denominator > 0){
      for (let i = 0; i < this.option_approver_num_denominator; i++){
        binary_data = binary_data.concat(Array.from(helper.hbo(this.option_approvers[i].length, 2)));
        binary_data = binary_data.concat(Array.from(this.option_approvers[i]));
      }
    }
    binary_data = binary_data.concat(Array.from(helper.hbo(asset.length, 4)));
    binary_data = binary_data.concat(Array.from(asset));
    return new Uint8Array(binary_data);

  }

  unpack(data) {
    let pos_s = 0;
    let pos_e = 2; // uint16
    let value_length =  helper.hboToInt16(data.slice(pos_s,pos_e));
    if (value_length > 0){
      pos_s = pos_e;
      pos_e = pos_e + value_length;
      this.asset_group_id = data.slice(pos_s,pos_e);
    }

    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    const reference_indices_size  = helper.hboToInt16(data.slice(pos_s,pos_e));

    if (reference_indices_size > 0) {
      for (let i = 0 ; i < reference_indices_size; i++){
        pos_s = pos_e;
        pos_e = pos_e + 2;
        this.reference_indices.push(helper.hboToInt16(data.slice(pos_s, pos_e)));
      }
    }

    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    const mandatory_approvers_size = helper.hboToInt16(data.slice(pos_s,pos_e));

    if (mandatory_approvers_size > 0) {
      for (let i = 0; i < mandatory_approvers_size; i++){
        pos_s = pos_e;
        pos_e = pos_e + 2;
        value_length = helper.hboToInt16(data.slice(pos_s,pos_e));

        pos_s = pos_e;
        pos_e = pos_e + value_length;
        this.mandatory_approvers.push(data.slice(pos_s, pos_e));
      }
    }

    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    this.option_approver_num_numerator = helper.hboToInt16(data.slice(pos_s,pos_e));

    pos_s = pos_e;
    pos_e = pos_e + 2; // uint16
    this.option_approver_num_denominator = helper.hboToInt16(data.slice(pos_s,pos_e));

    if(this.option_approver_num_denominator > 0){
      for (let i = 0; i < this.option_approver_num_denominator; i++) {
        pos_s = pos_e;
        pos_e = pos_e + 2;
        value_length = helper.hboToInt16(data.slice(pos_s, pos_e));

        pos_s = pos_e;
        pos_e = pos_e + value_length;
        this.option_approvers.push(data.slice(pos_s, pos_e));
      }
    }

    pos_s = pos_e;
    pos_e = pos_e + 4; // uint32
    value_length = helper.hboToInt32(data.slice(pos_s,pos_e));
    if(value_length > 0){
      pos_s = pos_e;
      pos_e = pos_e + value_length; // uint32

      const asset_bin = data.slice(pos_s, pos_e);
      this.asset = new BBcAsset(new Uint8Array(0));
      this.asset.unpack(asset_bin);
    }

    return true;
  }

}
