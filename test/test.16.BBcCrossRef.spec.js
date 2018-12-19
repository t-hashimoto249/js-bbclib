import chai from 'chai';
import {getTestEnv} from './prepare.js';
import * as helper from '../src/helper';
import jseu from 'js-encoding-utils';
const expect = chai.expect;
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcCrossRef`, () => {

  it('pack and unpack', async () => {
    // eslint-disable-next-line no-console
    console.log('***********************');
    // eslint-disable-next-line no-console
    console.log('Test for BBcCrossRef Class');

    const bbcCrossRef = new bbclib.BBcCrossRef(null, null);
    const domain_id = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
      domain_id[i] = 0xFF & (i + 8);
    }

    const transaction_id = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
      transaction_id[i] = 0xFF & (i + 16);
    }

    bbcCrossRef.set_domain_id(domain_id);
    bbcCrossRef.set_transaction_id(transaction_id);

    const serialize_bbcCrossRef = bbcCrossRef.pack();
    const bbcCrossRef_deserialize = new bbclib.BBcCrossRef(null, null);
    bbcCrossRef_deserialize.unpack(serialize_bbcCrossRef);

    expect_uint8Array(bbcCrossRef.domain_id, bbcCrossRef_deserialize.domain_id);
    expect_uint8Array(bbcCrossRef.transaction_id, bbcCrossRef_deserialize.transaction_id);
  });

  it('load crossref hex string ', async () => {
    const crossref_hex_string = '200016347198acdeed2b6e90715e6f50ba6e8e2728135c7af36aa9903a2b8b834c33200070bad87b2799a237a1144cc6e898b2a29c3a27c0761cf7b9438d27d4d47a65af';
    const crossref_data = helper.fromHexString(crossref_hex_string);

    const bbcCrossRef_deserialize = new bbclib.BBcCrossRef(null, null);
    await bbcCrossRef_deserialize.unpack(crossref_data);

    expect(jseu.encoder.arrayBufferToHexString(bbcCrossRef_deserialize.domain_id)).to.be.eq('16347198acdeed2b6e90715e6f50ba6e8e2728135c7af36aa9903a2b8b834c33');
    expect(jseu.encoder.arrayBufferToHexString(bbcCrossRef_deserialize.transaction_id)).to.be.eq('70bad87b2799a237a1144cc6e898b2a29c3a27c0761cf7b9438d27d4d47a65af');
  });
});

function expect_uint8Array(bin1, bin2){
  expect(jseu.encoder.arrayBufferToHexString(bin1)).to.be.eq(jseu.encoder.arrayBufferToHexString(bin2));
}

