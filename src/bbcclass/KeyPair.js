import jscu from "js-crypto-utils";

export default class {
    constructor() {
        this.private_key = null;
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

    set_key_pair(private_key, public_key){
        if (private_key != null) {
            this.private_key = private_key;
        }
        if (public_key != null) {
            this.public_key = public_key;
        }
    }

    async sign(msg){
        return new Uint8Array(await jscu.crypto.sign(msg, this.private_key, {name: 'SHA-256'}));
    }

    async verify(msg, sig){
        return  await jscu.crypto.verify(msg, sig, this.public_key, {name: 'SHA-256'});
    }

    async create_pubkey_byte(public_key){
        let byte_x = await jscu.helper.encoder.decodeBase64Url(public_key['x']);
        let byte_y = await jscu.helper.encoder.decodeBase64Url(public_key['y']);

        let public_key_byte = new Buffer(65);
        public_key_byte[0]= 0x04;
        for(let i = 0; i < 32; i++){
            public_key_byte[i+1] = byte_x[i];
            public_key_byte[i+1+32] = byte_y[i];
        }
        return public_key_byte;
    }

}



