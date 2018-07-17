import jscu from "js-crypto-utils";

const DefaultLength = {
    BBcSimple : 8,
    BBcOne: 32
};

const KeyType = {
    NOT_INITIALIZED: 0,
    ECDSA_SECP256k1: 1,
    ECDSA_P256v1: 2
};

const BBcFormat = {
    FORMAT_BINARY : 0,
    FORMAT_BSON : 1,
    FORMAT_BSON_COMPRESS_BZ2 : 2
};

export async function get_random_value(length){
    const msg = await jscu.crypto.random.getRandomBytes(length);
    const d = await jscu.crypto.hash.getHash('SHA-256', msg);
    return d;
}

export function print_bin(bin){
    let d = "";
    for (let i = 0; i < bin.length ; i++){
        if (bin[i] < 16){
            d += "0";
        }
        d += bin[i].toString(16);
    }
    console.log(d);
}

export let Base64 = {
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

export async function create_pubkey_byte(pubkey){
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

export {DefaultLength, KeyType, BBcFormat};