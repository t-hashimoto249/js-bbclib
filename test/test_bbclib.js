import chai from 'chai';
import jscu from 'js-crypto-utils';

import * as para from '../src/parameter.js';
import * as helper from '../src/helper';

import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;
const expect = chai.expect;

const BSON = require('bson');
const bson = new BSON();

const key_pair = new bbclib.KeyPair();


describe(`${envName}: Test bbclib 1`, () => {

  it('Test for BBcWitness Class.', () => {
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

  //TODO: Signatureを入れたテストBBcWitnessのテストを入れる
  it('Test for BBcAsset Class.', async () => {
    console.log('***********************');
    console.log('Test for BBcAsset Class.');
    const user_id = Buffer.from(await jscu.random.getRandomBytes(32));

    const bbcAsset = await helper.create_asset(user_id);

    const asset_serialize = await bbcAsset.serialize(false);
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

  it('Test for BBcEvent Class.', async () => {
    console.log('***********************');
    console.log('Test for BBcEvent Class.');

    const bbcEvent = new bbclib.BBcEvent(null);
    const event_deserialise = new bbclib.BBcEvent(null);

    const user_id = Buffer.from(await jscu.random.getRandomBytes(32));

    const bbcAsset = new bbclib.BBcAsset(user_id);

    await bbcAsset.set_random_nonce();

    const asset_file = new Buffer(32);
    for(let i = 0; i < 32; i++){
      asset_file[i] = 0xFF & i;
    }

    const asset_body = new Buffer(32);
    for(let i = 0; i < 32; i++){
      asset_body[i] = 0xFF & (i + 32);
    }

    await bbcAsset.add_asset(asset_file, asset_body);


    //let bbcAsset = await helper.create_asset(user_id);

    const asset_group_id = Buffer.from(await jscu.random.getRandomBytes(8));
    bbcEvent.add_asset(bbcAsset);
    bbcEvent.add_asset_group_id(asset_group_id);
    bbcEvent.add_mandatory_approver(user_id);

    const serialize_event = bbcEvent.serialize();
    event_deserialise.deserialize(serialize_event);

    //bbcEvent.show_event();

    expect(bbcEvent.asset_group_id).to.be.eq(event_deserialise.asset_group_id);
    expect(bbcEvent.reference_indices).to.be.eq(event_deserialise.reference_indices);
    expect(bbcEvent.mandatory_approvers).to.be.eq(event_deserialise.mandatory_approvers);
    expect(bbcEvent.option_approver_num_numerator).to.be.eq(event_deserialise.option_approver_num_numerator);
    expect(bbcEvent.option_approver_num_denominator).to.be.eq(event_deserialise.option_approver_num_denominator);
    expect(bbcEvent.option_approvers).to.be.eq(event_deserialise.option_approvers);
    expect(bbcEvent.asset.asset_id).to.be.eq(event_deserialise.asset.asset_id);
    expect(bbcEvent.asset.user_id).to.be.eq(event_deserialise.asset.user_id);
    expect(bbcEvent.asset.nonce).to.be.eq(event_deserialise.asset.nonce);
    expect(bbcEvent.asset.asset_file_size).to.be.eq(event_deserialise.asset.asset_file_size);
    expect(bbcEvent.asset.asset_file_digest).to.be.eq(event_deserialise.asset.asset_file_digest);
    expect(bbcEvent.asset.asset_body_size).to.be.eq(event_deserialise.asset.asset_body_size);
    expect(bbcEvent.asset.asset_body).to.be.eq(event_deserialise.asset.asset_body);

  });

  it('calc digest ', async () => {
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

    expect(digest[0].toString(16)).to.be.eq('72');
    expect(digest[1].toString(16)).to.be.eq('85');
    expect(digest[2].toString(16)).to.be.eq('bc');
    expect(digest[3].toString(16)).to.be.eq('3c');
    expect(digest[4].toString(16)).to.be.eq('bc');
    expect(digest[5].toString(16)).to.be.eq('28');
    expect(digest[6].toString(16)).to.be.eq('f2');
    expect(digest[7].toString(16)).to.be.eq('33');

  });

  it('Test for BBcReference Class.', () => {
    console.log('***********************');
    console.log('Test for BBcReference Class.');
    const bbcReference = new bbclib.BBcReference(0, 1, null, 3);
    const bbc_deserialize = new bbclib.BBcReference(null, null, null, null);

    const bbc_reference_serialize = bbcReference.serialize();
    bbc_deserialize.deserialize(bbc_reference_serialize);

    expect(bbcReference.asset_group_id).to.be.eq(bbc_deserialize.asset_group_id);
    expect(bbcReference.transaction_id).to.be.eq(bbc_deserialize.transaction_id);
    expect(bbcReference.event_index_in_ref).to.be.eq(bbc_deserialize.event_index_in_ref);
    expect(bbcReference.sig_indices).to.be.eq(bbc_deserialize.sig_indices);

  });

  it('Test for BBcPointer Class.', async () => {
    console.log('***********************');
    console.log('Test for BBcPointer Class');

    const bbcPointer = new bbclib.BBcPointer(null, null);
    bbcPointer.set_asset_id(new Buffer(8));
    bbcPointer.set_transaction_id(new Buffer(8));

    const serialize_bbcPointer = bbcPointer.serialize();
    const bbcPointer_deserialize = new bbclib.BBcPointer(null, null);
    bbcPointer_deserialize.deserialize(serialize_bbcPointer);

    expect(bbcPointer.transaction_id).to.equal(bbcPointer_deserialize.transaction_id);
    expect(bbcPointer.asset_id).to.equal(bbcPointer_deserialize.asset_id);

  });


  it('Test for BBcRelation Class.', async () => {
    console.log('***********************');
    console.log('Test for BBcRelation Class');

    const bbcRelation = new bbclib.BBcRelation(null);
    bbcRelation.add_asset_group_id(new Buffer(8));

    const user_id = Buffer.from(await jscu.random.getRandomBytes(32));
    const bbcAsset = new bbclib.BBcAsset(user_id);

    await bbcAsset.set_random_nonce();

    const asset_file = new Buffer(32);
    for(let i = 0; i < 32; i++){
      asset_file[i] = 0xFF & i;
    }

    const asset_body = new Buffer(32);
    for(let i = 0; i < 32; i++){
      asset_body[i] = 0xFF & (i + 32);
    }

    await bbcAsset.add_asset(asset_file, asset_body);

    //    let bbcAsset = await helper.create_asset(user_id);

    const transaction_id = Buffer.from(await jscu.random.getRandomBytes(32));
    const asset_id = Buffer.from(await jscu.random.getRandomBytes(32));

    bbcRelation.set_asset(bbcAsset);
    bbcRelation.add_pointer(new bbclib.BBcPointer(transaction_id, asset_id));

    const serialize_bbcrelation = bbcRelation.serialize();
    const bbcRelation_deserialize = new bbclib.BBcRelation(null);
    bbcRelation_deserialize.deserialize(serialize_bbcrelation);

    expect(bbcRelation.asset_group_id).to.equal(bbcRelation_deserialize.asset_group_id);
    expect(bbcRelation.pointers[0].transaction_id).to.be.eq(bbcRelation_deserialize.pointers[0].transaction_id);
    expect(bbcRelation.pointers[0].asset_id).to.be.eq(bbcRelation_deserialize.pointers[0].asset_id);
  });


  it('Test for BBcCrossRef Class.', async () => {
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


  it('Test for BBcSignature Class.', async () => {
    //it('Test for BBcSignature Class.', async () => {

    console.log('***********************');
    console.log('Test for BBcSignature Class');

    const bbcSignature = new bbclib.BBcSignature(para.KeyType.ECDSA_P256v1);
    bbcSignature.add_signature(new Buffer(8));

    await key_pair.generate();

    const sig = new Buffer(8);
    await bbcSignature.add(sig, key_pair.public_key);
    const signature_serialize = bbcSignature.serialize();
    const signature_deserialize = new bbclib.BBcSignature(2);
    await signature_deserialize.deserialize(signature_serialize);

    bbcSignature.show_sig();
    //expect(bbcSignature.signature).to.be.a(signature_deserialize.signature);
    expect(bbcSignature.pubkey['crv']).to.equal(signature_deserialize.pubkey['crv']);
    //expect(bbcSignature.pubkey["ext"]).to.be.a(signature_deserialize.pubkey["ext"]);
    expect(bbcSignature.pubkey['EC']).to.equal(signature_deserialize.pubkey['EC']);
    expect(bbcSignature.pubkey['x']).to.equal(signature_deserialize.pubkey['x']);
    expect(bbcSignature.pubkey['y']).to.equal(signature_deserialize.pubkey['y']);

  });

  it('Test for BBcTransaction Class.', async () => {
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

  it('Test for KeyPair Class.', async () => {
    console.log('***********************');
    console.log('Test for KeyPair Class.');
    const keypair = new bbclib.KeyPair();
    const ret = await keypair.generate();
    expect(keypair.public_key).to.not.equal(null);
    expect(keypair.private_key).to.not.equal(null);

    const msg = new Buffer(32);
    for (let i = 0; i < 32; i++) msg[i] = 0xFF & i;

    const sig = await bbclib.keypair.sign(msg);
    const result = await bbclib.keypair.verify(msg, sig);
    expect(ret).to.be.eq(result);

  });

  it('Test for jscu module.', async () => {
    console.log('***********************');
    //b'6e 34 0b 9c ff b3 7a 98 9c a5 44 e6 bb 78 0a 2c 78 90 1d 3f b3 37 38 76 85 11 a3 06 17 af a0 1d'
    //b'\x00'

    const msg = new Buffer(1);
    for (let i = 0; i < 1; i++) msg[i] = 0xFF & 0x00;

    const digest = await jscu.hash.compute(msg, 'SHA-256');

    expect(digest[0].toString(16)).to.be.eq('6e');
    expect(digest[1].toString(16)).to.be.eq('34');
    expect(digest[2].toString(16)).to.be.eq('b'); //"0b"
    expect(digest[3].toString(16)).to.be.eq('9c');
    expect(digest[4].toString(16)).to.be.eq('ff');
    expect(digest[5].toString(16)).to.be.eq('b3');
    expect(digest[6].toString(16)).to.be.eq('7a');
    expect(digest[7].toString(16)).to.be.eq('98');
    expect(digest[8].toString(16)).to.be.eq('9c');
    expect(digest[9].toString(16)).to.be.eq('a5');
    expect(digest[10].toString(16)).to.be.eq('44');
    expect(digest[11].toString(16)).to.be.eq('e6');
    expect(digest[12].toString(16)).to.be.eq('bb');
    expect(digest[13].toString(16)).to.be.eq('78');
    expect(digest[14].toString(16)).to.be.eq('a');//"0a"
    expect(digest[15].toString(16)).to.be.eq('2c');
    expect(digest[16].toString(16)).to.be.eq('78');
    expect(digest[17].toString(16)).to.be.eq('90');
    expect(digest[18].toString(16)).to.be.eq('1d');
    expect(digest[19].toString(16)).to.be.eq('3f');
    expect(digest[20].toString(16)).to.be.eq('b3');
    expect(digest[21].toString(16)).to.be.eq('37');
    expect(digest[22].toString(16)).to.be.eq('38');
    expect(digest[23].toString(16)).to.be.eq('76');
    expect(digest[24].toString(16)).to.be.eq('85');
    expect(digest[25].toString(16)).to.be.eq('11');
    expect(digest[26].toString(16)).to.be.eq('a3');
    expect(digest[27].toString(16)).to.be.eq('6');//"06"
    expect(digest[28].toString(16)).to.be.eq('17');
    expect(digest[29].toString(16)).to.be.eq('af');
    expect(digest[30].toString(16)).to.be.eq('a0');
    expect(digest[31].toString(16)).to.be.eq('1d');

  });


});

function hexStringToByte(str) {
  if (!str) {
    return new Buffer();
  }

  const a = [];
  for (let i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16));
  }

  return new Buffer(a);
}