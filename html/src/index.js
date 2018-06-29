'use strict';

import buffer from 'buffer';
//import jscu from 'js-crypto-utils';
import { BBcTransaction } from "../src/bbcclass/BBcTransaction";
import { BBcWitness } from "../src/bbcclass/BBcWitness";

const Buffer = buffer.Buffer;

var $ = require('jquery');


// グローバル変数
var global;
var xhr = new XMLHttpRequest();


$(document).ready(function () {
    console.log("start"); // コンソール出力

    // ローカル変数
    let domain  = '0699abfa8e8d1000fbd51880787de7ffc5fe0604ee7a2378b7a1f1b2f867c6c3';
    let user1 = 'a2580339fa1d28ad';
    let transaction_id1 = 'd15881e9f7c9656f';
    let user2 = '3e81ad1f758f84db';

    // set1ボタンクリックで各変数に1を代入
    $("#domain_setup").click(function(){
        console.log("sendMessage"); // コンソール出力
        xhr.open( 'POST', 'http://127.0.0.1:3000/domain_setup', false );
        // POST 送信の場合は Content-Type は固定.
        xhr.setRequestHeader( 'Content-Type', 'application/json' );

        let parameter = {'domain_id': domain};

        xhr.send(JSON.stringify(parameter));
        xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.

    });

    $("#insert_transaction").click(function(){
        console.log("sendMessage"); // コンソール出力

        let transaction = BBcTransaction();
        xhr.open( 'POST', 'http://127.0.0.1:3000/insert_transaction/' + domain, false );
        // POST 送信の場合は Content-Type は固定.
        xhr.setRequestHeader( 'Content-Type', 'application/json' );

        let parameter = {
            'source_user_id': user1,
            'transaction_bson': base64.b64encode(bsonobj).decode()
        };

        xhr.send(parameter);

        xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.
    });

    $("#search_transaction").click(function(){
        console.log("sendMessage"); // コンソール出力
        xhr.open( 'POST', 'http://127.0.0.1:3000/search_transaction/' + domain, false );

        // POST 送信の場合は Content-Type は固定.
        xhr.setRequestHeader( 'Content-Type', 'application/json' );
        let parameter = {
            'source_user_id': user1,
            'transaction_id': transaction_id1
        };

        xhr.send(JSON.stringify(parameter));

        xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.
    });

    $("#insert_transactions_and_traverse").click(function(){
        console.log("sendMessage"); // コンソール出力
        xhr.open( 'POST', 'http://127.0.0.1:3000/insert_transaction/' + domain, false );
        // POST 送信の場合は Content-Type は固定.
        xhr.setRequestHeader( 'Content-Type', 'application/json' );
        let bsonobj = "aaa";
        let parameter = {
            'source_user_id': user1,
            'transaction_bson': base64.b64encode(bsonobj).decode()
        };

        xhr.send(parameter);
        xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.
    });

    $("#traverse").click(function(){
        console.log("sendMessage"); // コンソール出力
        xhr.open( 'POST', 'http://127.0.0.1:3000/traverse_transactions/' + domain, false );
        // POST 送信の場合は Content-Type は固定.
        xhr.setRequestHeader( 'Content-Type', 'application/json' );
        let parameter = {
            'source_user_id': user1,
            'transaction_id': tx1[0].transaction_id.hex(),
            'direction': 0,
            'hop_count': 5
        };

        xhr.send(parameter);
        xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.
    });

    $("#traverse_reserve").click(function(){
        console.log("sendMessage"); // コンソール出力
        xhr.open( 'POST', 'http://127.0.0.1:3000/traverse_transactions/' + domain, false );
        // POST 送信の場合は Content-Type は固定.
        xhr.setRequestHeader( 'Content-Type', 'application/json' );
        let parameter = {
            'source_user_id': user1,
            'transaction_id': tx1[2].transaction_id.hex(),
            'direction': 1,
            'hop_count': 4
        };
        xhr.send(parameter);
        xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.
    });

    $("#traverse_not_found").click(function(){
        console.log("sendMessage"); // コンソール出力
        xhr.open( 'POST', 'http://127.0.0.1:3000/traverse_transactions/' + domain, false );
        // POST 送信の場合は Content-Type は固定.
        xhr.setRequestHeader( 'Content-Type', 'application/json' );
        let parameter = {
            'source_user_id': user2,
            'transaction_id': tx2[0].transaction_id.hex(),
            'user_id': user1,
            'direction': 0,
            'hop_count': 4
        };

        xhr.send(parameter);
        xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.
    });

    $("#traverse").click(function(){
        console.log("sendMessage"); // コンソール出力
        xhr.open( 'POST', 'http://127.0.0.1:3000/traverse_transactions/' + domain, false );
        // POST 送信の場合は Content-Type は固定.
        xhr.setRequestHeader( 'Content-Type', 'application/json' );
        let parameter = {
            'source_user_id': user2,
            'transaction_id': tx2[0].transaction_id.hex(),
            'user_id': user2,
            'direction': 0,
            'hop_count': 4
        };

        xhr.send(parameter);
        xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.
    });

    $("#close_domain").click(function(){
        /*console.log("sendMessage"); // コンソール出力
        xhr.open( 'POST', 'http://127.0.0.1:3000/domain_close/' + domain, false );
        // POST 送信の場合は Content-Type は固定.
        xhr.setRequestHeader( 'Content-Type', 'application/json' );
        xhr.send();
        xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.
        */
        let keypair = new KeyPair();
    });

});



// ハンドラの登録.
xhr.onreadystatechange = function() {
    switch ( xhr.readyState ) {
        case 0:
            // 未初期化状態.
            console.log( 'uninitialized!' );
            break;
        case 1: // データ送信中.
            console.log( 'loading...' );
            break;
        case 2: // 応答待ち.
            console.log( 'loaded.' );
            break;
        case 3: // データ受信中.
            console.log( 'interactive... '+xhr.responseText.length+' bytes.' );
            break;
        case 4: // データ受信完了.
            if( xhr.status == 200 || xhr.status == 304 ) {
                var data = xhr.responseText; // responseXML もあり
                console.log( 'COMPLETE! :'+data );
                let json = JSON.parse(data);

                let bson_data = Buffer.from(Base64.decode(json["transaction_bson"]));

                let json_data = bson.deserialize(bson_data);
                console.log(json_data);

            } else {
                console.log( 'Failed. HttpStatus: '+xhr.statusText );
            }
            break;
    }
};

var Base64 = {
    encode: (function(i, tbl) {
        for(i=0,tbl={64:61,63:47,62:43}; i<62; i++) {tbl[i]=i<26?i+65:(i<52?i+71:i-4);} //A-Za-z0-9+/=
        return function(arr) {
            var len, str, buf;
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
            var j, len, arr, buf;
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


