import chai from 'chai';
const expect = chai.expect;
import jscu from 'js-crypto-utils';
import { Buffer } from 'buffer';
import * as helper from '../src/helper';

import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcAsset`, () => {

  it('serialize and deserialize', async () => {
    console.log('***********************');
    console.log('Test for BBcAsset Class.');
    const user_id = Buffer.from(await jscu.random.getRandomBytes(32));

    const bbcAsset = await helper.create_asset(user_id);

    const asset_serialize = await bbcAsset.serialize();
    const asset_deserialise = new bbclib.BBcAsset(user_id);
    await asset_deserialise.deserialize(asset_serialize);

    //bbcAsset.show_asset()
    expect(bbcAsset.asset_id.toString('hex')).to.be.eq(asset_deserialise.asset_id.toString('hex'));
    expect(bbcAsset.user_id.toString('hex')).to.be.eq(asset_deserialise.user_id.toString('hex'));
    expect(bbcAsset.nonce.toString('hex')).to.be.eq(asset_deserialise.nonce.toString('hex'));
    expect(bbcAsset.asset_file_digest.toString('hex')).to.be.eq(asset_deserialise.asset_file_digest.toString('hex'));
    expect(bbcAsset.asset_body_size).to.be.eq(asset_deserialise.asset_body_size);
    expect(bbcAsset.asset_body.toString('hex')).to.be.eq(asset_deserialise.asset_body.toString('hex'));

  });

  it('get digest ', async () => {
    console.log('***********************');
    console.log('calc digest ');
    const user_id = new Buffer(8);
    for (let i = 0; i < 1; i++) {
      user_id[i] = 0xFF & 0x00;
    }
    user_id[0] = 0x00;

    const asset_body = new Buffer(8);
    for (let i = 0; i < 8; i++) {
      asset_body[i] = 0xFF & 0x00;
    }
    asset_body[0] = 0x00;

    const bbcAsset = new bbclib.BBcAsset(user_id);

    const nonce = new Buffer(8);
    for (let i = 0; i < 8; i++) {
      nonce[i] = 0xFF & 0x00;
    }

    bbcAsset.set_nonce(nonce);

    await bbcAsset.add_asset(null, asset_body);
    const digest = await bbcAsset.digest();

    expect(digest.toString('hex')).to.be.eq('7ae12ba60738f9d5e555c0006e5ef19a001c3273d65f873808e3506fe232bbb4');
  });
});
