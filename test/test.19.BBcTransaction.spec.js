import chai from 'chai';

const expect = chai.expect;
import jscu from 'js-crypto-utils';
import {Buffer} from 'buffer';

import {getTestEnv} from './prepare.js';

const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcTransaction`, () => {

  it('serialize and deserialize', async () => {
    console.log('***********************');
    console.log('Test for BBcTransaction Class.');

    const bbctransaction = new bbclib.BBcTransaction(0);
    const refs = [];
    for (let i = 0; i < 2; i++) {
      const ref = new bbclib.BBcReference(null, null, null, null);
      refs.push(ref);
    }

    const witness = new bbclib.BBcWitness();
    witness.add_sig_indices(0);
    witness.add_user(new Buffer(2));
    bbctransaction.add_parts([], refs, [], witness, null);
    //event reference relation witness cross_ref

    const transaction_serialize = await bbctransaction.serialize(false);
    const transaction_deserialize = new bbclib.BBcTransaction(0);
    await transaction_deserialize.deserialize(transaction_serialize);

    expect(bbctransaction.version).to.be.eq(transaction_deserialize.version);
    expect(bbctransaction.timestamp).to.be.eq(transaction_deserialize.timestamp);
    expect(bbctransaction.id_length).to.be.eq(transaction_deserialize.id_length);
    for (let i = 0; i < bbctransaction.events.length; i++) {
      expect(bbctransaction.events[i]).to.be.eq(transaction_deserialize.events[i]);
    }
    for (let i = 0; i < bbctransaction.references.length; i++) {
      //expect(bbctransaction.references[i]).to.be.eq(transaction_deserialize.references[i]);
    }
    for (let i = 0; i < bbctransaction.relations.length; i++) {
      const serialize_relations = bbctransaction.relations[i];
      const deserialize_relations = transaction_deserialize.relations[i];

      expect(serialize_relations['id_length']).to.be.eq(deserialize_relations['id_length']);
      expect(serialize_relations['asset_group_id']).to.be.eq(deserialize_relations['asset_group_id']);
      expect(serialize_relations['asset']).to.be.eq(deserialize_relations['asset']);
      expect(serialize_relations['pointers']).to.be.eq(deserialize_relations['pointers']);

    }

    for (let i = 0; i < bbctransaction.witness.sig_indices.length; i++) {
      const serialize_witness = bbctransaction.witness;
      const deserialize_witness = transaction_deserialize.witness;
      expect(serialize_witness.sig_indices[i]).to.be.eq(deserialize_witness.sig_indices[i]);
      expect(serialize_witness.user_ids[i].toString('hex')).to.be.eq(deserialize_witness.user_ids[i].toString('hex'));
    }

    expect(bbctransaction.cross_ref).to.be.eq(transaction_deserialize.cross_ref);
    //expect(bbctransaction.signatures).to.be.eq(transaction_deserialize.signatures);

  });
});
