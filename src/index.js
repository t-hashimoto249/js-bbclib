'use strict';

import buffer from 'buffer';
import { BBcTransaction } from "./bbcclass/BBcTransaction";
import { BBcWitness } from "./bbcclass/BBcWitness";
import * as para from 'bbcclass/Parameter.js';

const Buffer = buffer.Buffer;

var $ = require('jquery');


// グローバル変数
var global;
var xhr = new XMLHttpRequest();

let ip = "192.168.11.45";

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
        xhr.open( 'POST', 'http://' + ip + ':3000/domain_setup', false );
        // POST 送信の場合は Content-Type は固定.
        xhr.setRequestHeader( 'Content-Type', 'application/json' );

        let parameter = {'domain_id': domain};

        xhr.send(JSON.stringify(parameter));
        xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.

    });

    $("#insert_transaction").click(function(){
        console.log("sendMessage"); // コンソール出力

        let transaction = BBcTransaction();
        xhr.open( 'POST', 'http://' + ip + ':3000/insert_transaction/' + domain, false );
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
        xhr.open( 'POST', 'http://' + ip + ':3000/search_transaction/' + domain, false );

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
        xhr.open( 'POST', 'http://' + ip + ':3000/insert_transaction/' + domain, false );
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
        xhr.open( 'POST', 'http://' + ip + ':3000/traverse_transactions/' + domain, false );
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
        xhr.open( 'POST', 'http://' + ip + ':3000/traverse_transactions/' + domain, false );
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
        xhr.open( 'POST', 'http://' + ip + ':3000/traverse_transactions/' + domain, false );
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
        xhr.open( 'POST', 'http://' + ip + ':3000/traverse_transactions/' + domain, false );
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

                let bson_data = Buffer.from(para.Base64.decode(json["transaction_bson"]));

                let json_data = bson.deserialize(bson_data);
                console.log(json_data);

            } else {
                console.log( 'Failed. HttpStatus: '+xhr.statusText );
            }
            break;
    }
};
