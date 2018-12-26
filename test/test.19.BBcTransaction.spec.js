import chai from 'chai';

const expect = chai.expect;
import jscu from 'js-crypto-utils';
import {Buffer} from 'buffer';

import {getTestEnv} from './prepare.js';
import jseu from 'js-encoding-utils';
import * as helper from '../src/helper';
import * as para from '../src/parameter';

const env = getTestEnv();
const bbclib = env.library;
const envName = env.envName;

describe(`${envName}: Test BBcTransaction`, () => {

  it('pack and unpack', async () => {
    console.log('***********************');
    console.log('Test for BBcTransaction Class.');

    const bbctransaction = new bbclib.BBcTransaction(0);
    const refs = [];
    for (let i = 0; i < 2; i++) {
      const asset_group_id = await jscu.random.getRandomBytes(32);
      const transaction = await jscu.random.getRandomBytes(32);
      const ref_transaction  = await jscu.random.getRandomBytes(32);
      const event_index_in_ref  = await jscu.random.getRandomBytes(32);
      const bbcReference = new bbclib.BBcReference(asset_group_id, transaction, null, 3);

      refs.push(bbcReference);
    }

    const witness = new bbclib.BBcWitness();
    witness.add_sig_indices(0);
    witness.add_user(new Uint8Array(2));
    bbctransaction.add_parts([], refs, [], witness, null);
    //event reference relation witness cross_ref

    const packed_transaction = await bbctransaction.pack();
    const unpacked_transaction = new bbclib.BBcTransaction(0);
    await unpacked_transaction.unpack(packed_transaction);

    //console.log("---------");
    //unpacked_transaction.show_str();
    //console.log("---------");
    //bbctransaction.show_str();

    expect(bbctransaction.version).to.be.eq(unpacked_transaction.version);
    expect(bbctransaction.timestamp).to.be.eq(unpacked_transaction.timestamp);
    expect(bbctransaction.id_length).to.be.eq(unpacked_transaction.id_length);
    for (let i = 0; i < bbctransaction.events.length; i++) {
      expect_uint8Array(bbctransaction.events[i].pack(),unpacked_transaction.events[i].pack());
    }
    for (let i = 0; i < bbctransaction.references.length; i++) {
      expect_uint8Array(bbctransaction.references[i].pack(),unpacked_transaction.references[i].pack());
    }
    for (let i = 0; i < bbctransaction.relations.length; i++) {
      const packed_relations = bbctransaction.relations[i];
      const unpacked_relations = unpacked_transaction.relations[i];

      expect(packed_relations['id_length']).to.be.eq(unpacked_relations['id_length']);
      expect_uint8Array(packed_relations.asset_group_id,unpacked_relations.asset_group_id);

      expect_uint8Array(packed_relations.pointers[0].transaction_id,unpacked_relations.pointers[0].transaction_id);
      expect_uint8Array(packed_relations.pointers[0].asset_id,unpacked_relations.pointers[0].asset_id);

      expect_uint8Array(packed_relations.asset.user_id,unpacked_relations.asset.user_id);
      expect_uint8Array(packed_relations.asset.nonce,unpacked_relations.asset.nonce);
      expect_uint8Array(packed_relations.asset.asset_file_digest,unpacked_relations.asset.asset_file_digest);
      expect_uint8Array(packed_relations.asset.asset_body,unpacked_relations.asset.asset_body);
      expect( packed_relations.asset.asset_body_size).to.be.eq(unpacked_relations.asset.asset_body_size);
      expect( packed_relations.asset.asset_body_type).to.be.eq(unpacked_relations.asset.asset_body_type);

    }

    for (let i = 0; i < bbctransaction.witness.sig_indices.length; i++) {
      const packed_witness = bbctransaction.witness;
      const unpacked_witness = unpacked_transaction.witness;
      unpacked_witness.show_str();
      expect(packed_witness.sig_indices[i]).to.be.eq(unpacked_witness.sig_indices[i]);
      expect_uint8Array(packed_witness.user_ids[i],unpacked_witness.user_ids[i]);
    }

    expect(bbctransaction.cross_ref).to.be.eq(unpacked_transaction.cross_ref);
    //expect(bbctransaction.signatures).to.be.eq(transaction_deserialize.signatures);

  });

  it('load transaction hex string ', async () => {
    const signature_hex_string = '01000000e00c7d64bcf771152000000000000100160100002000c3786b5358bb1e46509c81e75bc1a9726e3be08fcb537910c2f3ad7499cc5f130200460020003eb1bd439947eb762998e566ccc2e099c791118b2f40579cc4f7da2b5061b7f9010020008c2f9fd27c0044c83e64bc66162be45810cadb85e774fb9ab5eaf26ea68f7fa8240020003a77784128c045f171984af534a3ff40af3499ea4b170ec9adaa87329b3626d5000080000000200051c515dcb465283ebd179ede9b538c512525b56bd08937a4e70617d9e93ac92a20005e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b847650220001c556e050b1ede536257d1d0d0e87d9ac0f96f8477877f552d0d2fc8d52a0d46000000000000120074657374537472696e67313233343558585801004a000000020020005e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b8476502000020005d122c5f03ce34c998a5c90eae9b336e9563b860f405c3e34b7438d8915f17b50100010044000000200016347198acdeed2b6e90715e6f50ba6e8e2728135c7af36aa9903a2b8b834c33200071a70662cee85ab655e7a602720690033364b24a12d5b7a889b184efa670fc0f02008d0000000200000008020000048d6ba60d212be64213662a08f7b2fe2ec70226b468e3bb1bfa22b6470ef041c1651e4d010a0f9139b06c775901d2cc41786029bd15e362dbe5ea6b7761aca2eb0002000046c820b3f758bea877f108e7efda0ba76d1e4a4ac021dd8357dfe423537033f7172f35e23005d51c6011cd93c7d2100cc7cf713e05da3c41df96f1ebe957238c8d0000000200000008020000048d6ba60d212be64213662a08f7b2fe2ec70226b468e3bb1bfa22b6470ef041c1651e4d010a0f9139b06c775901d2cc41786029bd15e362dbe5ea6b7761aca2eb000200007b8157b97564a960df4f26b876b19a83a8f707f05398defa7ee844327e48d015f42ee9827d68ee77ad1617a55b90281037aa9104089a856c34cc6d45d8974748';
    const transaction_data = helper.fromHexString(signature_hex_string);
    const transaction_unpack = new bbclib.BBcTransaction(0);

    await transaction_unpack.unpack(transaction_data);

    transaction_unpack.show_str();
    //expect(jseu.encoder.arrayBufferToHexString(transaction_unpack.transaction_id)).to.be.eq( "2bb8d5690044d5105158ec1094458e5e2d2c6551f0452371a18ff89f68a430b0" );
    expect( transaction_unpack.version).to.be.eq( 1 );
    expect( transaction_unpack.timestamp).to.be.eq( 1545288535676620000 );
    expect( transaction_unpack.id_length).to.be.eq( 32 );
    expect( transaction_unpack.events.length).to.be.eq( 0 );
    expect( transaction_unpack.references.length).to.be.eq( 0 );
    expect( transaction_unpack.relations.length).to.be.eq( 1 );
    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.relations[0].asset_group_id) ).to.be.eq( "c3786b5358bb1e46509c81e75bc1a9726e3be08fcb537910c2f3ad7499cc5f13" );
    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.relations[0].pointers[0].transaction_id) ).to.be.eq( "3eb1bd439947eb762998e566ccc2e099c791118b2f40579cc4f7da2b5061b7f9" );
    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.relations[0].pointers[0].asset_id) ).to.be.eq( "8c2f9fd27c0044c83e64bc66162be45810cadb85e774fb9ab5eaf26ea68f7fa8" );

    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.relations[0].pointers[1].transaction_id) ).to.be.eq( "3a77784128c045f171984af534a3ff40af3499ea4b170ec9adaa87329b3626d5" );

    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.relations[0].asset.asset_id ) ).to.be.eq( "51c515dcb465283ebd179ede9b538c512525b56bd08937a4e70617d9e93ac92a" );
    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.relations[0].asset.user_id ) ).to.be.eq( "5e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b8476502" );
    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.relations[0].asset.nonce ) ).to.be.eq( "1c556e050b1ede536257d1d0d0e87d9ac0f96f8477877f552d0d2fc8d52a0d46" );
    expect( transaction_unpack.relations[0].asset.asset_file_size  ).to.be.eq( 0 );
    expect( transaction_unpack.relations[0].asset.asset_body_size  ).to.be.eq( 18 );
    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.relations[0].asset.asset_body)).to.be.eq("74657374537472696e673132333435585858");

    expect( transaction_unpack.witness.sig_indices[0]).to.be.eq(0);
    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.witness.user_ids[0])).to.be.eq("5e64bb946e38aa0dd3dce77abe38f017834bf1e32c2de1ced4bce443b8476502");

    expect( transaction_unpack.witness.sig_indices[1]).to.be.eq(1);
    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.witness.user_ids[1])).to.be.eq("5d122c5f03ce34c998a5c90eae9b336e9563b860f405c3e34b7438d8915f17b5");

    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.cross_ref.domain_id)).to.be.eq("16347198acdeed2b6e90715e6f50ba6e8e2728135c7af36aa9903a2b8b834c33");
    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.cross_ref.transaction_id)).to.be.eq("71a70662cee85ab655e7a602720690033364b24a12d5b7a889b184efa670fc0f");

    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.signatures[0].pubkey_byte)).to.be.eq("048d6ba60d212be64213662a08f7b2fe2ec70226b468e3bb1bfa22b6470ef041c1651e4d010a0f9139b06c775901d2cc41786029bd15e362dbe5ea6b7761aca2eb");
    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.signatures[0].signature)).to.be.eq("46c820b3f758bea877f108e7efda0ba76d1e4a4ac021dd8357dfe423537033f7172f35e23005d51c6011cd93c7d2100cc7cf713e05da3c41df96f1ebe957238c")

    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.signatures[1].pubkey_byte)).to.be.eq("048d6ba60d212be64213662a08f7b2fe2ec70226b468e3bb1bfa22b6470ef041c1651e4d010a0f9139b06c775901d2cc41786029bd15e362dbe5ea6b7761aca2eb");
    expect( jseu.encoder.arrayBufferToHexString(transaction_unpack.signatures[1].signature)).to.be.eq("7b8157b97564a960df4f26b876b19a83a8f707f05398defa7ee844327e48d015f42ee9827d68ee77ad1617a55b90281037aa9104089a856c34cc6d45d8974748")

;


  });


});

function expect_uint8Array(bin1, bin2){
  expect(jseu.encoder.arrayBufferToHexString(bin1)).to.be.eq(jseu.encoder.arrayBufferToHexString(bin2));
}
