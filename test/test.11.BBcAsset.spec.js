import chai from 'chai';
const expect = chai.expect;
import jscu from 'js-crypto-utils';
import jseu from 'js-encoding-utils';
import { Buffer } from 'buffer';
import * as helper from '../src/helper';

import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcAsset`, () => {
  console.log('***********************');
  console.log('Test for BBcAsset Class.');

  it('pack and unpack with file and body', async () => {
    const user_id = await jscu.random.getRandomBytes(32);
    const bbcAsset = await helper.create_asset(user_id);
    const asset_pack = await bbcAsset.pack();
    const asset_unpack = new bbclib.BBcAsset(user_id);
    await asset_unpack.unpack(asset_pack);

    //console.log("----------");
    //bbcAsset.show_asset();
    //console.log("----------");
    //asset_unpack.show_asset();

    expect_uint8Array(bbcAsset.asset_id,asset_unpack.asset_id);
    expect_uint8Array(bbcAsset.user_id,asset_unpack.user_id);
    expect_uint8Array(bbcAsset.nonce,asset_unpack.nonce);
    expect_uint8Array(bbcAsset.asset_file_digest,asset_unpack.asset_file_digest);
    expect_uint8Array(bbcAsset.asset_body,asset_unpack.asset_body);
    expect( bbcAsset.asset_file_size).to.be.eq(asset_unpack.asset_file_size);
    expect( bbcAsset.asset_body_size).to.be.eq(asset_unpack.asset_body_size);
    expect( bbcAsset.asset_body_type).to.be.eq(asset_unpack.asset_body_type);

  });

  it('serialize and deserialize without file', async () => {
    const user_id = await jscu.random.getRandomBytes(32);
    const bbcAsset = await helper.create_asset_without_file(user_id);
    const asset_pack = await bbcAsset.pack();
    const asset_unpack = new bbclib.BBcAsset(user_id);
    await asset_unpack.unpack(asset_pack);

    expect_uint8Array(bbcAsset.asset_id,asset_unpack.asset_id);
    expect_uint8Array(bbcAsset.user_id,asset_unpack.user_id);
    expect_uint8Array(bbcAsset.nonce,asset_unpack.nonce);
    expect_uint8Array(bbcAsset.asset_file_digest,asset_unpack.asset_file_digest);
    expect_uint8Array(bbcAsset.asset_body,asset_unpack.asset_body);
    expect( bbcAsset.asset_file_size).to.be.eq(asset_unpack.asset_file_size);
    expect( bbcAsset.asset_body_size).to.be.eq(asset_unpack.asset_body_size);
    expect( bbcAsset.asset_body_type).to.be.eq(asset_unpack.asset_body_type);

  });

  it('get digest ', async () => {
    const user_id = new Uint8Array(8);
    for (let i = 0; i < 1; i++) {
      user_id[i] = 0xFF & 0x00;
    }
    user_id[0] = 0x00;

    const asset_body = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
      asset_body[i] = 0xFF & 0x00;
    }
    asset_body[0] = 0x00;

    const bbcAsset = new bbclib.BBcAsset(user_id);

    const nonce = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
      nonce[i] = 0xFF & 0x00;
    }

    bbcAsset.set_nonce(nonce);

    await bbcAsset.add_asset(null, asset_body);
    const digest = await bbcAsset.digest();

    expect(jseu.encoder.arrayBufferToHexString(digest)).to.be.eq('5feda19fb60af18c8c1d0e4af7d613726ec71cc9f6067c924ce2d081a61aa6d1');
  });

  it('load asset hex string ', async () => {
    const asset_hex_string = '200036335a38ca83d7594d96d00f50288644cc180c47d870eae291185bf8a111dbba20005e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b84765022000a3bc8fa47aed0ab75817e516a52a17df27c1233c0eab5a97bc1049b8285481b7000000000000120074657374537472696e673132333435585858';
    const asset_data = helper.fromHexString(asset_hex_string);
    const user_id = await jscu.random.getRandomBytes(32);
    const asset_unpack = new bbclib.BBcAsset(user_id);
    await asset_unpack.unpack(asset_data);

    const digest = await asset_unpack.digest();
    //asset_unpack.show_asset();

    expect(jseu.encoder.arrayBufferToHexString(digest)).to.be.eq( "36335a38ca83d7594d96d00f50288644cc180c47d870eae291185bf8a111dbba" );
    expect(jseu.encoder.arrayBufferToHexString(asset_unpack.asset_id)).to.be.eq( "36335a38ca83d7594d96d00f50288644cc180c47d870eae291185bf8a111dbba" );
    expect(jseu.encoder.arrayBufferToHexString(asset_unpack.user_id)).to.be.eq( "5e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b8476502" );
    expect(jseu.encoder.arrayBufferToHexString(asset_unpack.nonce)).to.be.eq( "a3bc8fa47aed0ab75817e516a52a17df27c1233c0eab5a97bc1049b8285481b7" );
    expect(jseu.encoder.arrayBufferToHexString(asset_unpack.asset_file_digest)).to.be.eq( "" );
    expect(jseu.encoder.arrayBufferToHexString(asset_unpack.asset_body)).to.be.eq( "74657374537472696e673132333435585858" );

    expect( asset_unpack.asset_file_size).to.be.eq(0);
    expect( asset_unpack.asset_body_size).to.be.eq(18);
    expect( asset_unpack.asset_body_type).to.be.eq(0);

  });

});

function expect_uint8Array(bin1, bin2){
  expect(jseu.encoder.arrayBufferToHexString(bin1)).to.be.eq(jseu.encoder.arrayBufferToHexString(bin2));
}
