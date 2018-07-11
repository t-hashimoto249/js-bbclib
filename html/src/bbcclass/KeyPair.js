import jscu from "js-crypto-utils";

const KeyType = {
    NOT_INITIALIZED: 0,
    ECDSA_SECP256k1: 1,
    ECDSA_P256v1: 2
};
let ECDSA_P256v1 = 1;
let DEFAULT_CURVETYPE =ECDSA_P256v1;


export default class {
    constructor() {
        //this.curvetype = curvetype;
        //this.private_key_len = 32;
        this.private_key = null;
        //this.public_key_len = 65;
        this.public_key = null;
    }

    async generate() {
        const getKeyParam = (elem) => ({keyType: 'EC', namedCurve: elem });
        const param = getKeyParam('P-256');

        let keys = await jscu.crypto.generateKeyPair(param);
        this.private_key = keys.privateKey.key;
        this.public_key = keys.publicKey.key;
        return true;
    }

    setKeyPair(privatekey, publickey){
        if (privatekey != null) {
            this.private_key = privatekey;
        }
        if (publickey != null) {
            this.public_key = publickey;
        }
    }

    async sign(msg){
        console.log("Keypair sign");
        const sig = new Uint8Array(await jscu.crypto.sign(msg, this.private_key, {name: 'SHA-256'})); // uint8array
        this.print_bin(msg);
        this.print_bin(sig);
        const result = await jscu.crypto.verify(msg, sig, this.public_key, {name: 'SHA-256'}); // true or false
        console.log(result);
        return sig;
    }

    async verify(msg, sig){
        const result = await jscu.crypto.verify(msg, sig, this.public_key, {name: 'SHA-256'}); // true or false
        return result;
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

    async create_pubkey_byte(pubkey){

        let byte_x = await jscu.helper.encoder.decodeBase64Url(pubkey['x']);
        let byte_y = await jscu.helper.encoder.decodeBase64Url(pubkey['y']);

        let pubkey_byte = new Buffer(65);
        pubkey_byte[0]= 0x04;
        for(let i = 0; i < 32; i++){
            pubkey_byte[i+1] = byte_x[i];
            pubkey_byte[i+1+32] = byte_y[i];
        }
        return pubkey_byte;
    }

}



