import jscu from "js-crypto-utils";

const KeyType = {
    NOT_INITIALIZED: 0,
    ECDSA_SECP256k1: 1,
    ECDSA_P256v1: 2
};
let ECDSA_P256v1 = 1;
let DEFAULT_CURVETYPE =ECDSA_P256v1;


export default class {
    constructor(curvetype) {
        this.curvetype = curvetype;
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
        const sig = await jscu.crypto.sign(msg, this.private_key, {name: 'SHA-256'}); // uint8array
        return sig;
    }

    async verify(msg, sig){
        const result = await jscu.crypto.verify(msg, sig, this.public_key, {name: 'SHA-256'}); // true or false
        return result;
    }
}



