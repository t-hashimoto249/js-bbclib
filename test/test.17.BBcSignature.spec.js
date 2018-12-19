import chai from 'chai';
const expect = chai.expect;
import jscu from 'js-crypto-utils';
import * as para from '../src/parameter.js';
import { Buffer } from 'buffer';

import {getTestEnv} from './prepare.js';
import jseu from 'js-encoding-utils';
import * as helper from '../src/helper';
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
    const signature_pack = bbcSignature.pack();
    const signature_unpack = new bbclib.BBcSignature(para.KeyType.ECDSA_P256v1);
    await signature_unpack.unpack(signature_pack);

    //console.log("---------");
    //bbcSignature.show_sig();
    //console.log("---------");
    //signature_unpack.show_sig();

    expect_uint8Array(bbcSignature.signature,signature_unpack.signature)
    expect(bbcSignature.pubkey['crv']).to.equal(signature_unpack.pubkey['crv']);
    expect(bbcSignature.pubkey['EC']).to.equal(signature_unpack.pubkey['EC']);
    expect(bbcSignature.pubkey['x']).to.equal(signature_unpack.pubkey['x']);
    expect(bbcSignature.pubkey['y']).to.equal(signature_unpack.pubkey['y']);

  });

  it('load signature hex string ', async () => {
    const signature_hex_string = '0200000008020000043750d6dcb679608cb533e93cfb22ec2df17e10a61c79f113bc1651d02caed51640121e53e4ec83effe9804df5f39521a28a1ba1f41d3198ffd54999fbcb60dd700020000e98b77e2f1bba5c65645aaa9aa7cc7b057240cc49f7e47c09a1a2a93b5cbf249d2c85fb4cb674670369a484d4e3c1e51680a22b8b95caaebdada752bf16e9675';
    const signature_data = helper.fromHexString(signature_hex_string);
    const signature_unpack = new bbclib.BBcSignature(para.KeyType.ECDSA_P256v1);

    await signature_unpack.unpack(signature_data);

    signature_unpack.show_sig();
    expect(jseu.encoder.arrayBufferToHexString(signature_unpack.signature)).to.be.eq( "e98b77e2f1bba5c65645aaa9aa7cc7b057240cc49f7e47c09a1a2a93b5cbf249d2c85fb4cb674670369a484d4e3c1e51680a22b8b95caaebdada752bf16e9675" );
    expect(jseu.encoder.arrayBufferToHexString(signature_unpack.pubkey_byte)).to.be.eq( "043750d6dcb679608cb533e93cfb22ec2df17e10a61c79f113bc1651d02caed51640121e53e4ec83effe9804df5f39521a28a1ba1f41d3198ffd54999fbcb60dd7" );

  });
});

function expect_uint8Array(bin1, bin2){
  expect(jseu.encoder.arrayBufferToHexString(bin1)).to.be.eq(jseu.encoder.arrayBufferToHexString(bin2));
}