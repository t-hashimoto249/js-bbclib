import chai from 'chai';
import {getTestEnv} from './prepare.js';
import { Buffer } from 'buffer';
import jscu from 'js-crypto-utils';
import * as helper from '../src/helper';
const expect = chai.expect;
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcWitness`, () => {
  it('pack and unpack', async () => {
    // eslint-disable-next-line no-console
    console.log('***********************');
    // eslint-disable-next-line no-console
    console.log('Test for BBcWitness Class');

    const witness = new bbclib.BBcWitness();

    const witness_load = new bbclib.BBcWitness();

    witness.add_sig_indices(0);

    const user_id_0 = await jscu.random.getRandomBytes(32);

    witness.add_user(user_id_0);

    witness.add_sig_indices(1);

    const user_id_1 = await jscu.random.getRandomBytes(32);

    witness.add_user(user_id_1);
    const s_witness = witness.pack();

    await witness_load.unpack(s_witness);

    witness.show_str();
    console.log("+++++++++++++++++++");
    witness_load.show_str();

    expect(witness_load.sig_indices[0]).to.be.eq(0);
    expect(witness_load.user_ids[0]).to.be.eql(user_id_0);
    expect(witness_load.sig_indices[1]).to.be.eq(1);
    expect(witness_load.user_ids[1]).to.be.eql(user_id_1);
  });

  it('load witness hex string ', async () => {
    const witness_hex_string = '020020005e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b847650200002000d7b571c2e4e2e2c18b73ae78e522b542c7964d8a29728cca906099089b76e7850100';
    const witness_data = helper.fromHexString(witness_hex_string);
    const bbcWitness_deserialize = new bbclib.BBcWitness();
    await bbcWitness_deserialize.unpack(witness_data);

    bbcWitness_deserialize.show_str();


    expect(bbcWitness_deserialize.sig_indices[0]).to.be.eq(0);
    const user_id_0_hex_string = '5e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b8476502';
    const user_id_0_data = helper.fromHexString(user_id_0_hex_string);
    expect(bbcWitness_deserialize.user_ids[0]).to.be.eql(user_id_0_data);
    expect(bbcWitness_deserialize.sig_indices[1]).to.be.eq(1);
    const user_id_1_hex_string = 'd7b571c2e4e2e2c18b73ae78e522b542c7964d8a29728cca906099089b76e785';
    const user_id_1_data = helper.fromHexString(user_id_1_hex_string);
    expect(bbcWitness_deserialize.user_ids[1]).to.be.eql(user_id_1_data);
  });

});
