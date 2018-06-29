import chai from 'chai';
const expect = chai.expect;

import BBcWitness from '../html/src/bbcclass/BBcWitness.js';
import BBcTransaction from '../html/src/bbcclass/BBcTransaction.js';
import BBcAsset from '../html/src/bbcclass/BBcAsset.js';
import BBcReference from '../html/src/bbcclass/BBcReference.js';
import BBcSignature from '../html/src/bbcclass/BBcSignature.js';
import KeyPair from '../html/src/bbcclass/KeyPair.js';

import jscu from "js-crypto-utils";

describe('test', () => {
    /*
    it('Test for BBcWitness Class.', () => {
        let witness = new BBcWitness();
        let witness_load = new BBcWitness();
        witness.add_user("aaa");
        witness.add_user("bbb");
        witness.add_sig_indices("1111");
        witness.add_sig_indices("2222");
        let s_witness = witness.serialize();
        witness_load.deserialize(s_witness);
        expect(witness_load.sig_indices[0]).to.be.eq('1111');
        expect(witness_load.user_ids[0]).to.be.eq('aaa');
        expect(witness_load.user_ids[1]).to.be.eq('bbb');
        expect(witness_load.sig_indices[1]).to.be.eq('2222');
    });

    it('Test for BBcTransaction Class.', () => {
        let bbctransaction = new BBcTransaction(0,0);
    });

    it('Test for BBcAsset Class.', async () => {
        const user_id = await jscu.crypto.random.getRandomBytes(32);
        let bbcAsset = new BBcAsset(user_id);

        await bbcAsset.setRandomNonce();

        let asset_file = new Uint8Array(32);
        for(let i = 0; i < 32; i++){
            asset_file[i] = 0xFF & i;
        }

        let asset_body = new Uint8Array(32);
        for(let i = 0; i < 32; i++){
            asset_body[i] = 0xFF & (i + 32);
        }

        await bbcAsset.add_asset(asset_file, asset_body);
        let asset_sirialize = await bbcAsset.serialize(false);
        let asset_desilialise = new BBcAsset(user_id);
        await asset_desilialise.deserialize(asset_sirialize);

        expect(bbcAsset.asset_id).to.be.eq(asset_desilialise.asset_id);
        expect(bbcAsset.user_id).to.be.eq(asset_desilialise.user_id);
        expect(bbcAsset.nonce).to.be.eq(asset_desilialise.nonce);
        expect(bbcAsset.asset_file_size).to.be.eq(asset_desilialise.asset_file_size);
        expect(bbcAsset.asset_file_digest).to.be.eq(asset_desilialise.asset_file_digest);
        expect(bbcAsset.asset_body_size).to.be.eq(asset_desilialise.asset_body_size);
        expect(bbcAsset.asset_body).to.be.eq(asset_desilialise.asset_body);
    });


*/
    it('BBcAsset Class in javascript is comparison with python BBcAsset class.', async () => {

        const user_id = new Uint8Array(8);
        for(let i = 0; i < 8; i++){
            user_id[i] = 0xFF & 0x00;
        }
        user_id[0] = 0x00;

        let asset_body = new Uint8Array(8);
        for(let i = 0; i < 8; i++){
            asset_body[i] = 0xFF & 0x00;
        }
        asset_body[0] = 0x00;

        let bbcAsset = new BBcAsset(user_id);

        let nonce = new Uint8Array(8);
        for(let i = 0; i < 8; i++){
            nonce[i] = 0xFF & 0x00;
        }

        bbcAsset.setNonce(nonce);

        await bbcAsset.add_asset(null, asset_body);
        let digest = await bbcAsset.digest();

        console.log("-------------------");
        bbcAsset.showAsset();
        console.log("-------------------");
        console.log(digest);
        for (let i = 0; i < 8 ; i++){
            console.log(digest[i].toString(16));
        }
        console.log("^^^^^^^^^^^^^^^^^^^");

    });

/*
    it('Test for BBcReference Class.', () => {
        let bbcReference = new BBcReference(null,null,null,null);
    });

    it('Test for BBcSignature Class.', () => {
        let bbcSignature = new BBcSignature(0,null);
    });

    it('Test for KeyPair Class.', async () => {
        let keypair = new KeyPair(1);
        let ret = await keypair.generate();
        expect(keypair.public_key).to.not.equal(null);
        expect(keypair.private_key).to.not.equal(null);
        console.log(keypair.public_key);
        console.log(keypair.private_key);

        const msg = new Uint8Array(32);
        for(let i = 0; i < 32; i++) msg[i] = 0xFF & i;

        let sig = await keypair.sign(msg);
        let result = await keypair.verify(msg,sig);
        expect(ret).to.be.eq(result);

    });
*/
    it('Test for jscu module.', async () => {
        //b'6e 34 0b 9c ff b3 7a 98 9c a5 44 e6 bb 78 0a 2c 78 90 1d 3f b3 37 38 76 85 11 a3 06 17 af a0 1d'
        //b'\x00'

        const msg = new Uint8Array(1);
        for(let i = 0; i < 1; i++) msg[i] = 0xFF & 0x00;

        const digest = await jscu.crypto.hash.getHash('SHA-256', msg);

        expect(digest[0].toString(16)).to.be.eq("6e");
        expect(digest[1].toString(16)).to.be.eq("34");
        expect(digest[2].toString(16)).to.be.eq("b"); //"0b"
        expect(digest[3].toString(16)).to.be.eq("9c");
        expect(digest[4].toString(16)).to.be.eq("ff");
        expect(digest[5].toString(16)).to.be.eq("b3");
        expect(digest[6].toString(16)).to.be.eq("7a");
        expect(digest[7].toString(16)).to.be.eq("98");
        expect(digest[8].toString(16)).to.be.eq("9c");
        expect(digest[9].toString(16)).to.be.eq("a5");
        expect(digest[10].toString(16)).to.be.eq("44");
        expect(digest[11].toString(16)).to.be.eq("e6");
        expect(digest[12].toString(16)).to.be.eq("bb");
        expect(digest[13].toString(16)).to.be.eq("78");
        expect(digest[14].toString(16)).to.be.eq("a");//"0a"
        expect(digest[15].toString(16)).to.be.eq("2c");
        expect(digest[16].toString(16)).to.be.eq("78");
        expect(digest[17].toString(16)).to.be.eq("90");
        expect(digest[18].toString(16)).to.be.eq("1d");
        expect(digest[19].toString(16)).to.be.eq("3f");
        expect(digest[20].toString(16)).to.be.eq("b3");
        expect(digest[21].toString(16)).to.be.eq("37");
        expect(digest[22].toString(16)).to.be.eq("38");
        expect(digest[23].toString(16)).to.be.eq("76");
        expect(digest[24].toString(16)).to.be.eq("85");
        expect(digest[25].toString(16)).to.be.eq("11");
        expect(digest[26].toString(16)).to.be.eq("a3");
        expect(digest[27].toString(16)).to.be.eq("6");//"06"
        expect(digest[28].toString(16)).to.be.eq("17");
        expect(digest[29].toString(16)).to.be.eq("af");
        expect(digest[30].toString(16)).to.be.eq("a0");
        expect(digest[31].toString(16)).to.be.eq("1d");

    });

    it('Test for jscu module2.', async () => {
        //b'6e 34 0b 9c ff b3 7a 98 9c a5 44 e6 bb 78 0a 2c 78 90 1d 3f b3 37 38 76 85 11 a3 06 17 af a0 1d'
        //b'\x00'

        const msg = new Uint8Array(8);
        for (let i = 0; i < 8; i++) msg[i] = 0xFF & 0x00;

        const digest = await jscu.crypto.hash.getHash('SHA-256', msg);
        //console.log(digest.toString());

        /*for(let i = 0; i < 32; i++){
            console.log(digest[i].toString(16));
        }*/
    });

        //$scope.bytes2hexs = function(bytes) {
    //    return bytes.map(function(b) { var s = b.toString(16); return b < 0x10 ? '0'+s : s; }).join(' ').toUpperCase();
    //}



});


