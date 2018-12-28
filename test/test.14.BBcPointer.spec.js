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

  it('pack and unpack', async () => {
    console.log('***********************');
    console.log('Test for BBcPointer Class');

    const transaction_id = await jscu.random.getRandomBytes(32);
    const asset_id = await jscu.random.getRandomBytes(32);

    const bbcPointer = new bbclib.BBcPointer(transaction_id, asset_id);

    const pack_bbcPointer = bbcPointer.pack();
    const bbcPointer_unpack = new bbclib.BBcPointer(null, null);
    bbcPointer_unpack.unpack(pack_bbcPointer);

    expect_uint8Array(bbcPointer.transaction_id,bbcPointer_unpack.transaction_id);
    expect(bbcPointer.asset_id_existence,bbcPointer_unpack.asset_id_existence);
    expect_uint8Array(bbcPointer.asset_id,bbcPointer_unpack.asset_id);

  });

  it('pack and unpack have not asset id', async () => {
    console.log('***********************');
    console.log('Test for BBcPointer Class');

    const transaction_id = await jscu.random.getRandomBytes(32);

    const bbcPointer = new bbclib.BBcPointer(transaction_id, null);

    const pack_bbcPointer = bbcPointer.pack();
    const bbcPointer_unpack = new bbclib.BBcPointer(null, null);
    bbcPointer_unpack.unpack(pack_bbcPointer);

    expect_uint8Array(bbcPointer.transaction_id,bbcPointer_unpack.transaction_id);
    expect(bbcPointer.asset_id_existence,bbcPointer_unpack.asset_id_existence);

  });

  it('load pointer hex string ', async () => {
    const pointer_hex_string = '20003eb1bd439947eb762998e566ccc2e099c791118b2f40579cc4f7da2b5061b7f9010020008c2f9fd27c0044c83e64bc66162be45810cadb85e774fb9ab5eaf26ea68f7fa8';
    const pointer_data = helper.fromHexString(pointer_hex_string);

    const bbcPointer_unpack = new bbclib.BBcPointer(null, null);
    await bbcPointer_unpack.unpack(pointer_data);

    expect(jseu.encoder.arrayBufferToHexString(bbcPointer_unpack.asset_id)).to.be.eq( "8c2f9fd27c0044c83e64bc66162be45810cadb85e774fb9ab5eaf26ea68f7fa8" );
    expect(jseu.encoder.arrayBufferToHexString(bbcPointer_unpack.transaction_id)).to.be.eq( "3eb1bd439947eb762998e566ccc2e099c791118b2f40579cc4f7da2b5061b7f9" );

  });

});

function expect_uint8Array(bin1, bin2){
  expect(jseu.encoder.arrayBufferToHexString(bin1)).to.be.eq(jseu.encoder.arrayBufferToHexString(bin2));
}
