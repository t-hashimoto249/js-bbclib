import chai from 'chai';
const expect = chai.expect;
import jscu from 'js-crypto-utils';
import { Buffer } from 'buffer';

import {getTestEnv} from './prepare.js';
import jseu from 'js-encoding-utils';
import * as helper from '../src/helper';
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcReference`, () => {

  it('pack and unpack', async () => {
    console.log('***********************');
    console.log('Test for BBcReference Class.');

    const asset_group_id = await jscu.random.getRandomBytes(32);
    const transaction = await jscu.random.getRandomBytes(32);
    const ref_transaction  = await jscu.random.getRandomBytes(32);
    const event_index_in_ref  = await jscu.random.getRandomBytes(32);

    const bbcReference = new bbclib.BBcReference(asset_group_id, transaction, null, 3);
    const unpacked_bbcReference = new bbclib.BBcReference(null, null, null, null);

    const packed_bbcreference = bbcReference.pack();
    unpacked_bbcReference.unpack(packed_bbcreference);

    expect_uint8Array(bbcReference.asset_group_id, unpacked_bbcReference.asset_group_id);
    expect_uint8Array(bbcReference.transaction_id, unpacked_bbcReference.transaction_id);
    expect( bbcReference.event_index_in_ref).to.be.eq(unpacked_bbcReference.event_index_in_ref);

    for (let i = 0 ; i < bbcReference.sig_indices.length; i++){
      expect( bbcReference.sig_indices[i]).to.be.eq(unpacked_bbcReference.sig_indices[i]);
    }
  });

  it('load reference hex string ', async () => {
    const reference_hex_string = '2000c3786b5358bb1e46509c81e75bc1a9726e3be08fcb537910c2f3ad7499cc5f13200078a07ce9ee51c3454e9a71c5b0930a85ed091389970f0804b110204c5ec8bdfe0000020000000100';
    const reference_data = helper.fromHexString(reference_hex_string);

    const unpacked_bbcReference = new bbclib.BBcReference(null, null, null, null);
    await unpacked_bbcReference.unpack(reference_data);

    expect(jseu.encoder.arrayBufferToHexString(unpacked_bbcReference.asset_group_id)).to.be.eq( "c3786b5358bb1e46509c81e75bc1a9726e3be08fcb537910c2f3ad7499cc5f13" );
    expect(jseu.encoder.arrayBufferToHexString(unpacked_bbcReference.transaction_id)).to.be.eq( "78a07ce9ee51c3454e9a71c5b0930a85ed091389970f0804b110204c5ec8bdfe" );

    expect( unpacked_bbcReference.event_index_in_ref).to.be.eq(0);
    expect( unpacked_bbcReference.sig_indices[0]).to.be.eq(0);
    expect( unpacked_bbcReference.sig_indices[1]).to.be.eq(1);
  });

});

function expect_uint8Array(bin1, bin2){
  expect(jseu.encoder.arrayBufferToHexString(bin1)).to.be.eq(jseu.encoder.arrayBufferToHexString(bin2));
}

