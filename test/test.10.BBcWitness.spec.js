import chai from 'chai';
const expect = chai.expect;

import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcWitness`, () => {

  it('serialize and deserialize ', () => {
    console.log('***********************');
    console.log('Test for BBcWitness Class');

    const witness = new bbclib.BBcWitness();
    const witness_load = new bbclib.BBcWitness();
    witness.add_sig_indices('1111');
    witness.add_sig_indices('2222');

    const s_witness = witness.serialize();
    witness_load.deserialize(s_witness);
    expect(witness_load.sig_indices[0]).to.be.eq('1111');
    expect(witness_load.sig_indices[1]).to.be.eq('2222');
  });
});
