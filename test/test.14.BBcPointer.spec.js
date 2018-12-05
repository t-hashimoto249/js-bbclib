import chai from 'chai';
const expect = chai.expect;
import jscu from 'js-crypto-utils';
import { Buffer } from 'buffer';

import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcReference`, () => {

  it('serialize and deserialize', async () => {
    console.log('***********************');
    console.log('Test for BBcPointer Class');

    const transaction_id = Buffer.from(await jscu.random.getRandomBytes(32));
    const asset_id = Buffer.from(await jscu.random.getRandomBytes(32));

    const bbcPointer = new bbclib.BBcPointer(transaction_id, asset_id);
    bbcPointer.set_asset_id(new Buffer(8));
    bbcPointer.set_transaction_id(new Buffer(8));

    const serialize_bbcPointer = bbcPointer.serialize();
    const bbcPointer_deserialize = new bbclib.BBcPointer(null, null);
    bbcPointer_deserialize.deserialize(serialize_bbcPointer);

    expect(bbcPointer.transaction_id).to.equal(bbcPointer_deserialize.transaction_id);
    expect(bbcPointer.asset_id).to.equal(bbcPointer_deserialize.asset_id);

  });

});
