import chai from 'chai';
const expect = chai.expect;
import jscu from 'js-crypto-utils';
import { Buffer } from 'buffer';

import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcPointer`, () => {

  it('serialize and deserialize', async () => {
    console.log('***********************');
    console.log('Test for BBcReference Class.');

    const asset_group_id = await jscu.random.getRandomBytes(32);
    const transaction = Buffer.from(await jscu.random.getRandomBytes(32));
    const ref_transaction  = Buffer.from(await jscu.random.getRandomBytes(32));
    const event_index_in_ref  = Buffer.from(await jscu.random.getRandomBytes(32));

    const bbcReference = new bbclib.BBcReference(asset_group_id, transaction, null, 3);
    const bbc_deserialize = new bbclib.BBcReference(null, null, null, null);

    const bbc_reference_serialize = bbcReference.serialize();
    bbc_deserialize.deserialize(bbc_reference_serialize);

    expect(bbcReference.asset_group_id).to.be.eq(bbc_deserialize.asset_group_id);
    expect(bbcReference.transaction_id).to.be.eq(bbc_deserialize.transaction_id);
    expect(bbcReference.event_index_in_ref).to.be.eq(bbc_deserialize.event_index_in_ref);
    expect(bbcReference.sig_indices).to.be.eq(bbc_deserialize.sig_indices);

  });

});
