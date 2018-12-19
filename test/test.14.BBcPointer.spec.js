import chai from 'chai';
const expect = chai.expect;
import jscu from 'js-crypto-utils';
import { Buffer } from 'buffer';

import {getTestEnv} from './prepare.js';
import * as helper from '../src/helper';
import jseu from 'js-encoding-utils';
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcPointer`, () => {

  it('serialize and deserialize', async () => {
    console.log('***********************');
    console.log('Test for BBcPointer Class');

    const transaction_id = await jscu.random.getRandomBytes(32);
    const asset_id = await jscu.random.getRandomBytes(32);

    const bbcPointer = new bbclib.BBcPointer(transaction_id, asset_id);

    const serialize_bbcPointer = bbcPointer.serialize();
    const bbcPointer_deserialize = new bbclib.BBcPointer(null, null);
    bbcPointer_deserialize.deserialize(serialize_bbcPointer);

    expect_uint8Array(bbcPointer.asset.transaction_id,bbcPointer_deserialize.transaction_id.asset_id);
    expect_uint8Array(bbcPointer.asset.asset_id,bbcPointer_deserialize.asset.asset_id);

  });

  it('load pointer hex string ', async () => {
    const pointer_hex_string = '20003eb1bd439947eb762998e566ccc2e099c791118b2f40579cc4f7da2b5061b7f9010020008c2f9fd27c0044c83e64bc66162be45810cadb85e774fb9ab5eaf26ea68f7fa8';
    const pointer_data = helper.fromHexString(pointer_hex_string);

    const bbcPointer_deserialize = new bbclib.BBcPointer(null, null);
    await bbcPointer_deserialize.deserialize(pointer_data);

    expect(jseu.encoder.arrayBufferToHexString(bbcPointer_deserialize.domain_id)).to.be.eq( "3eb1bd439947eb762998e566ccc2e099c791118b2f40579cc4f7da2b5061b7f9" );
    expect(jseu.encoder.arrayBufferToHexString(bbcPointer_deserialize.transaction_id)).to.be.eq( "8c2f9fd27c0044c83e64bc66162be45810cadb85e774fb9ab5eaf26ea68f7fa8" );

  });

});

function expect_uint8Array(bin1, bin2){
  expect(jseu.encoder.arrayBufferToHexString(bin1)).to.be.eq(jseu.encoder.arrayBufferToHexString(bin2));
}
