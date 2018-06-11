'use strict';

var $ = require('jquery');

// グローバル変数
var global;
var xhr = new XMLHttpRequest();


$(document).ready(function () {
    console.log("start"); // コンソール出力

    // ローカル変数
    let domain  = 'c93033db5327d138160ff78d5ca980e76c65cf1e108637b9e87a469700fbbf52';
    let user1 = '207eba8d14689086';
    let user2 = '3e81ad1f758f84db';

    let bson = new BSON();

    // set1ボタンクリックで各変数に1を代入
    $("#domain_setup").click(function(){
        console.log("sendMessage"); // コンソール出力
        xhr.open( 'POST', 'http://127.0.0.1:3000/domain_setup', false );
        // POST 送信の場合は Content-Type は固定.
        xhr.setRequestHeader( 'Content-Type', 'application/json' );

        let parameter = {'domain_id': 'eb201274a32dd0616e321ba341ffb6e928782d3f3398a06d343289e67342dbce'};

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
            'transaction_id': txid.hex()
        };

        xhr.send(parameter);
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
        console.log("sendMessage"); // コンソール出力
        xhr.open( 'POST', 'http://127.0.0.1:3000/domain_close/' + domain, false );
        // POST 送信の場合は Content-Type は固定.
        xhr.setRequestHeader( 'Content-Type', 'application/json' );
        xhr.send();
        xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.
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
            } else {
                console.log( 'Failed. HttpStatus: '+xhr.statusText );
            }
            break;
    }
};

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

const DEFAULT_ID_LEN = 8;
let date = new Date() ;
let array = new Array();

class BBcTransaction{
    constructor(version){
        this.id_length = DEFAULT_ID_LEN;
        this.version = version;
        this.timestamp = (date.getTime() / 1000); //秒単位で記載
        this.events = [];
        this.references = [];
        this.relations = [];
        this.witness = null;
        this.cross_ref = null;
        this.signatures = [];
        this.userid_sigidx_mapping = {};
        this.transaction_id = null;
        this.transaction_base_digest = null;
        this.transaction_data = null;
        this.asset_group_ids = {};
    }

    add_parts(event, reference, relation, witness, cross_ref){
        //"""Add parts"""
        if (isArray(event)){
            if (event.length > 0){
                for(let i = 0; i < event.length; i++){
                    this.events =　event;
                }
            }
        }

        if (isArray(reference)){
            if (reference.length > 0){
                for(let i = 0; i < reference.length; i++){
                    this.references =　reference;
                }
            }
        }

        if (isArray(relation)){
            if (relation.length > 0){
                for(let i = 0; i < relation.length; i++){
                    this.relations =　relation;
                }
            }
        }

        if (witness != null){
            this.witness = witness;
        }

        if (cross_ref != null){
            this.cross_ref = cross_ref;
        }

        return true;
    }

    get_sig_index(user_id){
        if (this.userid_sigidx_mapping[user_id] == null) {
            this.userid_sigidx_mapping[user_id] = this.userid_sigidx_mapping.length();
            this.signatures.append(null);
        }
        return this.userid_sigidx_mapping[user_id];
    }

    add_signature(user_id, signature){
        return true;
    }

    digest(){
        let d = "digest"
        return d;
    }

    sirialize(){
        let s= "s";
        return s;
    }

    desirialize(data){
        let d = "d";
        return d;
    }

}

let ECDSA_P256v1 = 1;
let DEFAULT_CURVETYPE =ECDSA_P256v1;

class BBcSignature{
    constructor(key_type, deserialize){
        this.key_type = key_type;
        this.signature = null;
        this.pubkey = null;
        this.keypair = null;
        if (deserialize != null){
            this.deserialize(deserialize);
        }
    }

    add(signature, pubkey){
        return true;
    }

    sirialize(){
        let s= "s";
        return s;
    }

    deserialize(data){
        let d = "d";
        return d;
    }

    verify(digest){
        let flag = false;
        return flag;
    }

}

class BBcReference{
    constructor(asset_group_id, transaction, ref_transaction, event_index_in_ref){
        this.id_length = DEFAULT_ID_LEN;
        if (asset_group_id != null) {
            this.asset_group_id = asset_group_id["id_length"];
        }else {
            this.asset_group_id = asset_group_id;
        }

        this.transaction_id = null;
        this.transaction = transaction;
        this.ref_transaction = ref_transaction;
        this.event_index_in_ref = event_index_in_ref;
        this.sig_indices = [];
        this.mandatory_approvers = null;
        this.option_approvers = null;
        this.option_sig_ids = [];
        if (ref_transaction == null) {
            return ;
        }
        this.prepare_reference(ref_transaction);
    }

    prepare_reference(ref_transaction){

    }

    add_signature(user_id, signature){

    }

    get_referred_transaction(){
        return {};
    }

    get_destinations(){
        return self.mandatory_approvers+self.option_approvers;
    }

    sirialize(){
        let s= "s";
        return s;
    }

    desirialize(){
        let d = "d";
        return d;
    }

}

function get_random_value(){
    return "";
};

class BBcAsset{
    constructor(user_id, asset_file, asset_body){
        this.id_length = DEFAULT_ID_LEN;
        this.asset_id = null;
        if (user_id =! null && this.id_length < 32) {
            this.user_id = user_id["id_length"];
        }else {
            this.user_id = user_id;
        }

        this.nonce = get_random_value();
        this.asset_file_size = 0;
        this.asset_file = null;
        this.asset_file_digest = null;
        this.asset_body_size = 0;
        this.asset_body = null;
        if (user_id =! null) {
            this.add(user_id, asset_file, asset_body);
        }}


    add(){
        return true;
    }

    digest(){
        return this.asset_id;
    }

    get_asset_file(){

        return this.asset_file;
    }

    get_asset_digest(){

        return this.asset_file_digest;
    }

    recover_asset_file(){
        return true;
    }

    serialize(){
        let data = "aa";
        return data;
    }

    deserialize(data){
        return true;
    }

}

class BBcWitness{
    constructor( ){
        this.id_length = DEFAULT_ID_LEN;
        this.transaction = null;
        this.user_ids = [];
        this.sig_indices = [];
    }

    add_witness(user_id){

    }

    add_signature(user_id, signature){

    }

    serialize(){
        let data = "aa";
        return data;
    }

    deserialize(data){
        return true;
    }
}




/*
import BusinessMember from '../lib/BusinessMember';

let pro = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('ok');
    }, 500)
});

pro.then(response => {
    let user = new BusinessMember('taro', 'yamada', 'G社');
    console.log(user.getName());
});
*/