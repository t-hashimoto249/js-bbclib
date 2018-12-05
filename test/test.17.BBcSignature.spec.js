import chai from 'chai';
const expect = chai.expect;
import jscu from 'js-crypto-utils';
import * as para from '../src/parameter.js';
import { Buffer } from 'buffer';

import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcSignature`, () => {

  it('serialize and deserialize', async () => {

    console.log('***********************');
    console.log('Test for BBcSignature Class');

    const bbcSignature = new bbclib.BBcSignature(para.KeyType.ECDSA_P256v1);
    bbcSignature.add_signature(new Buffer(8));

    const key_pair = new bbclib.KeyPair();

    await key_pair.generate();

    const sig = new Buffer(8);
    await bbcSignature.add(sig, key_pair.public_key);
    const signature_serialize = bbcSignature.serialize();
    const signature_deserialize = new bbclib.BBcSignature(2);
    await signature_deserialize.deserialize(signature_serialize);

    //bbcSignature.show_sig();
    //signature_deserialize.show_sig();

    expect(bbcSignature.signature.toString('hex')).to.equal(signature_deserialize.signature.toString('hex'));
    expect(bbcSignature.pubkey['crv']).to.equal(signature_deserialize.pubkey['crv']);
    expect(bbcSignature.pubkey['EC']).to.equal(signature_deserialize.pubkey['EC']);
    expect(bbcSignature.pubkey['x']).to.equal(signature_deserialize.pubkey['x']);
    expect(bbcSignature.pubkey['y']).to.equal(signature_deserialize.pubkey['y']);

  });
});
