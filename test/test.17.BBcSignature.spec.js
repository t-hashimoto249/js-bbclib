import chai from 'chai';
const expect = chai.expect;
import jscu from 'js-crypto-utils';
import * as para from '../src/parameter.js';
import { Buffer } from 'buffer';

import {getTestEnv} from './prepare.js';
import jseu from 'js-encoding-utils';
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcSignature`, () => {

  it('serialize and deserialize', async () => {

    console.log('***********************');
    console.log('Test for BBcSignature Class');

    const bbcSignature = new bbclib.BBcSignature(para.KeyType.ECDSA_P256v1);
    bbcSignature.add_signature(new Uint8Array(8));
    const key_pair = new bbclib.KeyPair();
    await key_pair.generate();

    const sig = new Uint8Array(8);
    await bbcSignature.add(sig, key_pair.public_key['_jwk']);
    const signature_serialize = bbcSignature.serialize();
    const signature_deserialize = new bbclib.BBcSignature(2);
    await signature_deserialize.deserialize(signature_serialize);

    console.log("---------");
    bbcSignature.show_sig();
    console.log("---------");
    signature_deserialize.show_sig();

    expect_uint8Array(bbcSignature.signature,signature_deserialize.signature)
    expect(bbcSignature.pubkey['crv']).to.equal(signature_deserialize.pubkey['crv']);
    expect(bbcSignature.pubkey['EC']).to.equal(signature_deserialize.pubkey['EC']);
    expect(bbcSignature.pubkey['x']).to.equal(signature_deserialize.pubkey['x']);
    expect(bbcSignature.pubkey['y']).to.equal(signature_deserialize.pubkey['y']);

  });


});

function expect_uint8Array(bin1, bin2){
  expect(jseu.encoder.arrayBufferToHexString(bin1)).to.be.eq(jseu.encoder.arrayBufferToHexString(bin2));
}