import KeyPair from "./KeyPair.js";

export default class {
    constructor(key_type){
        this.key_type = key_type;
        this.signature = null;
        this.pubkey = null;
        this.keypair = null;
        this.not_initialized = true;

    }

    add(signature, pubkey){
        //"""Add signature and public key"""

        if (signature != null){
            this.not_initialized = false;
            this.signature = signature;
        }

        if (pubkey != null){
            this.pubkey = pubkey;
            this.keypair = KeyPair(KeyType.ECDSA_P256v1);
            this.keypair.setKeyPair(pubkey,null);
        }

        return true;
    }

    serialize(){
        let pubkey_len_bit = this.pubkey.length * 8;
        let sig_len_bit = this.signature.length * 8;
        return {
            'key_type': this.key_type,
            'pubkey_len': pubkey_len_bit,
            'pubkey': this.pubkey,
            'signature_len': sig_len_bit,
            'signature': this.signature,
        };

    }

    deserialize(data){
        this.key_type = data['key_type'];
        if ( this.key_type == KeyType.NOT_INITIALIZED ){
            return true;
        }
        let pubkey = data['pubkey'];
        let signature = data['signature'];
        this.add(signature, pubkey);
        return true;
    }

    verify(digest){
        let flag = false;
        return flag;
    }

}