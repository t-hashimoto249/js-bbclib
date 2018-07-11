import KeyPair from "./KeyPair.js";
import jscu from "js-crypto-utils";

const KeyType = {
    NOT_INITIALIZED: 0,
    ECDSA_SECP256k1: 1,
    ECDSA_P256v1: 2
};

export default class {


    constructor(key_type){
        this.key_type = key_type;
        this.signature = null;
        this.pubkey = null;
        this.pubkey_byte = null;
        this.keypair = null;
        this.not_initialized = true;

        this.curveList = {
            'P-256': {name: 'p256', payloadSize: 32, oid: [1, 2, 840, 10045, 3, 1, 7]},
            'P-384': {name: 'p384', payloadSize: 48, oid: [1, 3, 132, 0, 34]},
            'P-521': {name: 'p521', payloadSize: 66, oid: [1, 3, 132, 0, 35]}
        };
    }

    showSig() {
        console.log("key_type");
        console.log(this.key_type);
        console.log("signature");
        this.print_bin(this.signature);
        console.log("pubkey");
        console.log(this.pubkey);
        console.log("pubkey_byte");
        this.print_bin(this.pubkey_byte);
        console.log("keypair");
        console.log(this.keypair);
        console.log("not_initialized");
        console.log(this.not_initialized);
    }

    print_bin(bin){
        let d = "";
        for (let i = 0; i < bin.length ; i++){
            if (bin[i] < 16){
                d += "0";
            }
            d += bin[i].toString(16);
        }
        console.log(d);
    }

    async add(signature, pub_key){
        if (signature != null){
            this.not_initialized = false;
            this.signature = signature;
        }

        if (pub_key != null){
            this.pubkey = pub_key;
            this.pubkey_byte = await this.create_pubkey_byte(pub_key);
            this.keypair = new KeyPair();
            this.keypair.setKeyPair(null, pub_key);
        }

        return true;
    }

    serialize(){
        let pubkey_len_bit = this.pubkey_byte.length * 8;
        let sig_len_bit = this.signature.length * 8;

        return {
            'key_type': this.key_type,
            //'key_type': this.key_type,
            'pubkey_len': pubkey_len_bit,
            'pubkey': Buffer.from(this.pubkey_byte),
            //'pubkey': await this.create_pubkey(this.pubkey),
            'signature_len': sig_len_bit,
            'signature': Buffer.from(this.signature),
        };
    }

    async deserialize(data){
        this.key_type = data['key_type'];
        let pubkey = data['pubkey'].buffer;
        let signature = data['signature'].buffer;
        //65byteの鍵形式からJwkへ変換してinput
        await this.add(signature, await this.convertRawHexKeyToJwk(pubkey, 'P-256'));
        return true;
    }

    async verify(digest){

        if (this.keypair === null){
            return false;
        }
        let flag = await this.keypair.verify(digest, this.signature);
        return flag;
    }

    async convertRawHexKeyToJwk(hexKeyObj, algo){

        const len = 16;
        const offset = 1;
        const hexX = hexKeyObj.slice(offset, offset+len*2);
        const hexY = hexKeyObj.slice(offset+len*2, offset+len*4);
        const b64uX = await jscu.helper.encoder.encodeBase64Url(hexX);
        const b64uY = await jscu.helper.encoder.encodeBase64Url(hexY);

        const jwKey = { // https://www.rfc-editor.org/rfc/rfc7518.txt
            crv: algo,
            ext: true,
            kty: 'EC', // or "RSA", "oct"
            x: b64uX, // hex to base64url
            y: b64uY
        };
        return jwKey;
    }

    async create_pubkey_byte(pubkey) {
        let byte_x = await jscu.helper.encoder.decodeBase64Url(pubkey['x']);
        let byte_y = await jscu.helper.encoder.decodeBase64Url(pubkey['y']);

        let pubkey_byte = new Buffer(65);
        pubkey_byte[0] = 0x04;
        for (let i = 0; i < 32; i++) {
            pubkey_byte[i + 1] = byte_x[i];
            pubkey_byte[i + 1 + 32] = byte_y[i];
        }
        return pubkey_byte;
    }

}

