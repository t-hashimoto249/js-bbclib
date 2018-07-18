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

export {DefaultLength, KeyType, BBcFormat};