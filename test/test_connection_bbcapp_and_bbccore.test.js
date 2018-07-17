import chai from 'chai';
import BBcWitness from '../src/bbcclass/BBcWitness.js';
import BBcTransaction from '../src/bbcclass/BBcTransaction.js';
import BBcAsset from '../src/bbcclass/BBcAsset.js';
import BBcReference from '../src/bbcclass/BBcReference.js';
import BBcSignature from '../src/bbcclass/BBcSignature.js';
import BBcEvent from '../src/bbcclass/BBcEvent.js';
import KeyPair from '../src/bbcclass/KeyPair.js';
import * as para from '../src/bbcclass/Parameter.js'
import * as help from '../src/helper.js'
import jscu from "js-crypto-utils";

const expect = chai.expect;


let domain = '67d1650916d9b6f67b130960c10e43f04a012042cc44aff966aa763cc38661cd';
let user1 = '4d48ba82dc8607c9';
let transaction_id1 = '1a0cdc5da312f9e1';

let keypair = new KeyPair();
keypair.generate();

let ip = "192.168.11.45";
//let ip = "192.168.0.5";

describe('test', async () => {

    it('domain_setup', () => {
        console.log("***********************");
        console.log("Test Rest API for domain_setup"); // コンソール出力
        let xhr = new XMLHttpRequest();

        xhr.open('POST', 'http://' + ip + ':3000/domain_setup', false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        let parameter = {'domain_id': domain};

        xhr.addEventListener("load", (event) => {
            console.log( 'COMPLETE! domain_setup :' );
            console.log(event.target.status); // => "{...}"
            console.log(event.target.responseText); // => "{...}"
            if(event.target.status === 500 && event.target.responseText["result"] === false && event.target.responseText["reason"] === "Already exists"){
                expect(500).to.be.eq(event.target.status); // => 500
            }else{
                expect(200).to.be.eq(event.target.status); // => 200
            }

        });

        xhr.addEventListener("error", (event) => {
            console.log("error");
        });

        xhr.send(JSON.stringify(parameter));
        xhr.abort();

    });


    it('Test insert transaction', async function () {

        console.log("***********************");
        console.log("Test Rest API for insert_transaction"); // コンソール出力
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://' + ip + ':3000/insert_transaction/' + domain, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        let tx = await help.make_transaction(new Buffer(user1, "hex"), keypair, 0, 0, true);
        let bsonobj = await tx.serialize(false, true);

        console.log(bsonobj);
        tx.show_str();

        let parameter = {
            'source_user_id': user1,
            'transaction_bson': help.Base64.encode(bsonobj)
        };

        xhr.addEventListener("load", function (event) {
            console.log( 'COMPLETE! insert transaction :' );
            console.log(event.target.status);
            console.log(event.target.responseText); // => "{...}"
            expect(200).to.be.eq(event.target.status); // => 200
        });

        xhr.send(JSON.stringify(parameter));
        xhr.abort();

    });


    it('Test insert transaction with event', async function () {

        console.log("***********************");
        console.log("Test Rest API for insert_transaction with event"); // コンソール出力
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://' + ip + ':3000/insert_transaction/' + domain, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        let tx = await help.make_transaction(new Buffer(user1, "hex"), keypair, 1, 0, true);
        let bsonobj = await tx.serialize(false, true);

        let parameter = {
            'source_user_id': user1,
            'transaction_bson': Base64.encode(bsonobj)
        };

        xhr.addEventListener("load", function (event) {
            console.log( 'COMPLETE! insert transaction :' );
            expect(200).to.be.eq(event.target.status); // => 200
            console.log(event.target.status);
            console.log(event.target.responseText); // => "{...}"
        });

        xhr.send(JSON.stringify(parameter));
        xhr.abort();

    });


    /*
        it('Transaction check test', function (done) {
            this.timeout(1000000);
            console.log("***********************");
            console.log("Test Rest API for search_transaction ");
            var xhr = new XMLHttpRequest();
            //please change the domain, user1 and transaction_id to your environment.
            xhr.open( 'POST', 'http://' + ip + ':3000/search_transaction/' + domain, false );

            // POST 送信の場合は Content-Type は固定.
            xhr.setRequestHeader( 'Content-Type', 'application/json' );
            let parameter = {
                'source_user_id': user1,
                'transaction_id': Base64.decode(transaction_id1)
            };

            xhr.addEventListener("load", async (event) => {

                if( event.target.status == 200 || event.target.status == 304 ) {
                    var data = event.target.responseText; // responseXML もあり
                    console.log( 'COMPLETE serarch transaction! :'+data );
                    let json = JSON.parse(data);
                    console.log(json);
                    let bson_data = Buffer.from(Base64.decode(json["transaction_bson"]));
                    console.log("bson_data:");
                    console.log(bson_data);
                    let transaction = new BBcTransaction(0);
                    await transaction.deserialize(bson_data);
                    console.log("~~~~~~~~~~~~~~~~~~~~~show string~~~~~~~~~~~~~~~~~~~~");
                    transaction.show_str();

                    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

                    console.log("transaction_check_test jtkkokoko 1");
                    console.log(transaction.signatures);
                    console.log("transaction_check_test jtkkokoko 2");
                    console.log(transaction.signatures[0]);
                    console.log("transaction_check_test jtkkokoko 3");
                    print_bin(transaction.signatures[0].pubkey_byte);
                    console.log("transaction_check_test jtkkokoko 4");
                    print_bin(transaction.transaction_id);
                    console.log("transaction_check_test jtkkokoko 5");
                    print_bin(transaction.target_serialize);

                    let ret = await transaction.signatures[0].verify(await transaction.digest());
                    //let ret = await transaction.signatures[0].verify(transaction.transaction_id);
                    console.log("transaction_check_test ret: ");
                    console.log(ret);
                    expect(ret).to.be.eq(true);
                    //transaction.sign(null, transaction.signatures[0].pubkey_byte, null);

                } else {
                    console.log(event.target.status);
                    console.log(event.target.responseText);
                }
                done();
            });
            xhr.send(JSON.stringify(parameter));
            xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.

        });
    */


});



let Base64 = {
    encode: (function(i, tbl) {
        for(i=0,tbl={64:61,63:47,62:43}; i<62; i++) {tbl[i]=i<26?i+65:(i<52?i+71:i-4);} //A-Za-z0-9+/=
        return function(arr) {
            let len, str, buf;
            if (!arr || !arr.length) {return "";}
            for(i=0,len=arr.length,buf=[],str=""; i<len; i+=3) { //6+2,4+4,2+6
                str += String.fromCharCode(
                    tbl[arr[i] >>> 2],
                    tbl[(arr[i]&3)<<4 | arr[i+1]>>>4],
                    tbl[i+1<len ? (arr[i+1]&15)<<2 | arr[i+2]>>>6 : 64],
                    tbl[i+2<len ? (arr[i+2]&63) : 64]
                );
            }
            return str;
        };
    }()),
    decode: (function(i, tbl) {
        for(i=0,tbl={61:64,47:63,43:62}; i<62; i++) {tbl[i<26?i+65:(i<52?i+71:i-4)]=i;} //A-Za-z0-9+/=
        return function(str) {
            let j, len, arr, buf;
            if (!str || !str.length) {return [];}
            for(i=0,len=str.length,arr=[],buf=[]; i<len; i+=4) { //6,2+4,4+2,6
                //for(i=0,len=str.length,arr=[],buf=[]; i<len; i+=4) { //6,2+4,4+2,6
                for(j=0; j<4; j++) {buf[j] = tbl[str.charCodeAt(i+j)||0];}
                arr.push(
                    buf[0]<<2|(buf[1]&63)>>>4,
                    (buf[1]&15)<<4|(buf[2]&63)>>>2,
                    (buf[2]&3)<<6|buf[3]&63
                );
            }
            if (buf[3]===64) {arr.pop();if (buf[2]===64) {arr.pop();}}
            return arr;
        };
    }())
};
