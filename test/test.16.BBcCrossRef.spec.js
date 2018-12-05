import chai from 'chai';
const expect = chai.expect;
import jscu from 'js-crypto-utils';
import { Buffer } from 'buffer';

import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcCrossRef`, () => {

  it('serialize and deserialize', async () => {
    console.log('***********************');
    console.log('Test for BBcCrossRef Class');

    const bbcCrossRef = new bbclib.BBcCrossRef(null, null);
    bbcCrossRef.set_domain_id(new Buffer(8));
    bbcCrossRef.set_transaction_id(new Buffer(8));

    const serialize_bbcCrossRef = bbcCrossRef.serialize();
    const bbcCrossRef_deserialize = new bbclib.BBcCrossRef(null, null);
    bbcCrossRef_deserialize.deserialize(serialize_bbcCrossRef);

    expect(bbcCrossRef.domain_id).to.equal(bbcCrossRef_deserialize.domain_id);
    expect(bbcCrossRef.transaction_id).to.equal(bbcCrossRef_deserialize.transaction_id);
  });
});
