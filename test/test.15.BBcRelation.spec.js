import chai from 'chai';
const expect = chai.expect;
import jscu from 'js-crypto-utils';
import { Buffer } from 'buffer';

import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcRelation`, () => {

  it('pack and unpack', async () => {
    console.log('***********************');
    console.log('Test for BBcRelation Class');
    const asset_id = await jscu.random.getRandomBytes(32);

    const bbcRelation = new bbclib.BBcRelation(asset_id);
    bbcRelation.add_asset_group_id(new Uint8Array(8));

    const user_id = await jscu.random.getRandomBytes(32);
    const bbcAsset = new bbclib.BBcAsset(user_id);

    await bbcAsset.set_random_nonce();

    const asset_file = new Uint8Array(32);
    for(let i = 0; i < 32; i++){
      asset_file[i] = 0xFF & i;
    }

    const asset_body = new Uint8Array(32);
    for(let i = 0; i < 32; i++){
      asset_body[i] = 0xFF & (i + 32);
    }

    await bbcAsset.add_asset(asset_file, asset_body);

    //    let bbcAsset = await helper.create_asset(user_id);

    const transaction_id =await jscu.random.getRandomBytes(32);

    bbcRelation.set_asset(bbcAsset);
    bbcRelation.add_pointer(new bbclib.BBcPointer(transaction_id, asset_id));

    const serialize_bbcrelation = bbcRelation.serialize();
    const bbcRelation_deserialize = new bbclib.BBcRelation(null);
    bbcRelation_deserialize.deserialize(serialize_bbcrelation);

    expect(bbcRelation.asset_group_id).to.equal(bbcRelation_deserialize.asset_group_id);
    expect(bbcRelation.pointers[0].transaction_id).to.be.eq(bbcRelation_deserialize.pointers[0].transaction_id);
    expect(bbcRelation.pointers[0].asset_id).to.be.eq(bbcRelation_deserialize.pointers[0].asset_id);
  });

});
