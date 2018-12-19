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

describe(`${envName}: Test BBcEvent`, () => {

  it('pack and unpack', async () => {
    console.log('***********************');
    console.log('Test for BBcEvent Class.');

    const asset_group_id = await jscu.random.getRandomBytes(32);
    const bbcEvent = new bbclib.BBcEvent(asset_group_id);
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

    bbcEvent.add_asset(bbcAsset);
    bbcEvent.add_asset_group_id(asset_group_id);
    bbcEvent.add_mandatory_approver(user_id);

    const packed_event = bbcEvent.pack();

    const unpacked_event = new bbclib.BBcEvent(asset_group_id);
    unpacked_event.unpack(packed_event);

    //bbcEvent.show_event();
    //unpacked_event.show_event();

    expect_uint8Array(bbcEvent.asset_group_id,unpacked_event.asset_group_id);
    if (bbcEvent.reference_indices.length > 0) {
      for (let i = 0; i < bbcEvent.reference_indices.length; i++) {
        expect_uint8Array(bbcEvent.reference_indices[i], unpacked_event.reference_indices[i]);
      }
    }
    if (bbcEvent.mandatory_approvers.length > 0){
      for (let i = 0; i < bbcEvent.mandatory_approvers.length; i++ ) {
        expect_uint8Array(bbcEvent.mandatory_approvers[i], unpacked_event.mandatory_approvers[i]);
      }
    }
    expect(bbcEvent.option_approver_num_numerator).to.be.eq(unpacked_event.option_approver_num_numerator);
    expect(bbcEvent.option_approver_num_denominator).to.be.eq(unpacked_event.option_approver_num_denominator);
    if (bbcEvent.option_approvers.length > 0){
      for (let i = 0; i < bbcEvent.option_approvers.length; i++ ){
        expect_uint8Array(bbcEvent.option_approvers[i], unpacked_event.option_approvers[i]);
      }
    }

    expect_uint8Array(bbcEvent.asset.asset_id,unpacked_event.asset.asset_id);
    expect_uint8Array(bbcEvent.asset.user_id,unpacked_event.asset.user_id);
    expect_uint8Array(bbcEvent.asset.nonce,unpacked_event.asset.nonce);
    expect_uint8Array(bbcEvent.asset.asset_file_digest,unpacked_event.asset.asset_file_digest);
    expect_uint8Array(bbcEvent.asset.asset_body,unpacked_event.asset.asset_body);

    expect(bbcEvent.asset.asset_file_size).to.be.eq(unpacked_event.asset.asset_file_size);
    expect(bbcEvent.asset.asset_body_type).to.be.eq(unpacked_event.asset.asset_body_type);
    expect(bbcEvent.asset.asset_body_size).to.be.eq(unpacked_event.asset.asset_body_size);

  });

  it('load event hex string ', async () => {
    const event_hex_string = '2000c3786b5358bb1e46509c81e75bc1a9726e3be08fcb537910c2f3ad7499cc5f13020001000200020020005e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b84765022000b7e70c482105bbbe7182f25e18cc7c363f55420f5e2b9519f598c8d436251c2c0100020020008c10c27d57f94f12ee2aa9599fcefa050626346fcf46276c2c8de6ca76c4fa0e20004d99a455dd570aecaa30672f38c63601788f8f79e5215bb0a80665a00741bf8e8000000020002ce7f058d4ed412453ff193ff2dc453a55cc2e4e3a7a1bd7e3dcbb7913e12e2620005e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b847650220008068d7c1f994f17830b8f477aa25c1147c8b09f96b94613a2a6bdd8b8c37dbee000000000000120074657374537472696e673132333435585858';
    const event_data = helper.fromHexString(event_hex_string);
    const unpacked_event = new bbclib.BBcEvent(new Uint8Array(0));
    unpacked_event.unpack(event_data);

    //unpacked_event.show_event();

    expect(jseu.encoder.arrayBufferToHexString(unpacked_event.asset_group_id)).to.be.eq( "c3786b5358bb1e46509c81e75bc1a9726e3be08fcb537910c2f3ad7499cc5f13" );
    expect(unpacked_event.reference_indices[0]).to.be.eq( 1 );
    expect(unpacked_event.reference_indices[1]).to.be.eq( 2 );

    expect(jseu.encoder.arrayBufferToHexString(unpacked_event.mandatory_approvers[0])).to.be.eq( "5e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b8476502" );
    expect(jseu.encoder.arrayBufferToHexString(unpacked_event.mandatory_approvers[1])).to.be.eq( "b7e70c482105bbbe7182f25e18cc7c363f55420f5e2b9519f598c8d436251c2c" );

    expect(jseu.encoder.arrayBufferToHexString(unpacked_event.option_approvers[0])).to.be.eq( "8c10c27d57f94f12ee2aa9599fcefa050626346fcf46276c2c8de6ca76c4fa0e" );
    expect(jseu.encoder.arrayBufferToHexString(unpacked_event.option_approvers[1])).to.be.eq( "4d99a455dd570aecaa30672f38c63601788f8f79e5215bb0a80665a00741bf8e" );

    expect(unpacked_event.option_approver_num_numerator).to.be.eq( 1 );
    expect(unpacked_event.option_approver_num_denominator).to.be.eq( 2 );

    expect(jseu.encoder.arrayBufferToHexString(unpacked_event.asset.asset_id)).to.be.eq( "2ce7f058d4ed412453ff193ff2dc453a55cc2e4e3a7a1bd7e3dcbb7913e12e26" );
    expect(jseu.encoder.arrayBufferToHexString(unpacked_event.asset.user_id)).to.be.eq( "5e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b8476502" );
    expect(jseu.encoder.arrayBufferToHexString(unpacked_event.asset.nonce)).to.be.eq( "8068d7c1f994f17830b8f477aa25c1147c8b09f96b94613a2a6bdd8b8c37dbee" );
    expect(unpacked_event.asset.asset_file_size).to.be.eq( 0 );
    expect(unpacked_event.asset.asset_body_size).to.be.eq( 18 );
    expect(unpacked_event.asset.asset_body_type).to.be.eq( 0 );

    expect(jseu.encoder.arrayBufferToHexString(unpacked_event.asset.asset_body)).to.be.eq( "74657374537472696e673132333435585858" );

  });


});

function expect_uint8Array(bin1, bin2){
  expect(jseu.encoder.arrayBufferToHexString(bin1)).to.be.eq(jseu.encoder.arrayBufferToHexString(bin2));
}
