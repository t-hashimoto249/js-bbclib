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

    const transaction_id = await jscu.random.getRandomBytes(32);

    bbcRelation.set_asset(bbcAsset);
    bbcRelation.add_pointer(new bbclib.BBcPointer(transaction_id, asset_id));

    const packed_bbcrelation = bbcRelation.pack();

    const unpack_bbcRelation = new bbclib.BBcRelation(null);
    unpack_bbcRelation.unpack(packed_bbcrelation);

    //bbcRelation.show_relation();

    expect_uint8Array(bbcRelation.asset_group_id,unpack_bbcRelation.asset_group_id);
    expect_uint8Array(bbcRelation.pointers[0].transaction_id,unpack_bbcRelation.pointers[0].transaction_id);
    expect_uint8Array(bbcRelation.pointers[0].asset_id,unpack_bbcRelation.pointers[0].asset_id);

    expect_uint8Array(bbcRelation.asset.user_id,unpack_bbcRelation.asset.user_id);
    expect_uint8Array(bbcRelation.asset.nonce,unpack_bbcRelation.asset.nonce);
    expect_uint8Array(bbcRelation.asset.asset_file_digest,unpack_bbcRelation.asset.asset_file_digest);
    expect_uint8Array(bbcRelation.asset.asset_body,unpack_bbcRelation.asset.asset_body);
    expect( bbcRelation.asset.asset_body_size).to.be.eq(unpack_bbcRelation.asset.asset_body_size);
    expect( bbcRelation.asset.asset_body_type).to.be.eq(unpack_bbcRelation.asset.asset_body_type);

  });

  it('load relation hex string ', async () => {
    const relation_hex_string = '2000c3786b5358bb1e46509c81e75bc1a9726e3be08fcb537910c2f3ad7499cc5f130200460020003eb1bd439947eb762998e566ccc2e099c791118b2f40579cc4f7da2b5061b7f9010020008c2f9fd27c0044c83e64bc66162be45810cadb85e774fb9ab5eaf26ea68f7fa824002000e15cf56122ef6612ccf43bb1077f322fe13291c93edab097fe7e99fe6f40285a00008000000020002ca34ba3da69f2af5ddd54fce95ce59df797eff797ed45477e284f03dcfb198c20005e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b84765022000164ab9da6db8f0a877d81e9d1daea26fed15301cdf84a1c6c8ae3265c6f46013000000000000120074657374537472696e673132333435585858';
    const relation_data = helper.fromHexString(relation_hex_string);
    const asset_id = await jscu.random.getRandomBytes(32);

    const bbcRelation_unpack = new bbclib.BBcRelation(asset_id);
    await bbcRelation_unpack.unpack(relation_data);

    expect( jseu.encoder.arrayBufferToHexString(bbcRelation_unpack.asset_group_id)).to.be.eq("c3786b5358bb1e46509c81e75bc1a9726e3be08fcb537910c2f3ad7499cc5f13");
    expect( jseu.encoder.arrayBufferToHexString(bbcRelation_unpack.pointers[0].transaction_id)).to.be.eq("3eb1bd439947eb762998e566ccc2e099c791118b2f40579cc4f7da2b5061b7f9");
    expect( jseu.encoder.arrayBufferToHexString(bbcRelation_unpack.pointers[0].asset_id)).to.be.eq("8c2f9fd27c0044c83e64bc66162be45810cadb85e774fb9ab5eaf26ea68f7fa8");
    expect( jseu.encoder.arrayBufferToHexString(bbcRelation_unpack.pointers[1].transaction_id)).to.be.eq("e15cf56122ef6612ccf43bb1077f322fe13291c93edab097fe7e99fe6f40285a");

    expect( jseu.encoder.arrayBufferToHexString(bbcRelation_unpack.asset.asset_id)).to.be.eq("2ca34ba3da69f2af5ddd54fce95ce59df797eff797ed45477e284f03dcfb198c");
    expect( jseu.encoder.arrayBufferToHexString(bbcRelation_unpack.asset.user_id)).to.be.eq("5e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b8476502");
    expect( jseu.encoder.arrayBufferToHexString(bbcRelation_unpack.asset.nonce)).to.be.eq("164ab9da6db8f0a877d81e9d1daea26fed15301cdf84a1c6c8ae3265c6f46013");
    expect( jseu.encoder.arrayBufferToHexString(bbcRelation_unpack.asset.asset_body)).to.be.eq("74657374537472696e673132333435585858");

    expect( bbcRelation_unpack.asset.asset_body_size).to.be.eq(18);
    expect( bbcRelation_unpack.asset.asset_body_type).to.be.eq(0);



  });




});

function expect_uint8Array(bin1, bin2){
  expect(jseu.encoder.arrayBufferToHexString(bin1)).to.be.eq(jseu.encoder.arrayBufferToHexString(bin2));
}
