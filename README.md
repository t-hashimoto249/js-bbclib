Name
=====
BBc-1(Beyond Block-chain One) Library, written in Javascript. 

# Overview
The library is implemented bbclib and bbc-app-rest-api functions on platform of BBc-1.
It provides make transaction function, sign and verify transaction function, serialize and deserialize function for some collection of data on BBc-1 platform. (They are BBcTransaction, BBcEvent, BBcAsset, BBcSignature, BBcRelation, BBcReference, BBcCrossRef, BBcPointer and BBcWitness).
It works on modern browsers(Firefox, IE, Edge, Chrome and Safari) and Node.js. 
The module is totally written in ES6+ and needed to get transpiled with babel for legacy environments.

※The design and detail of BBc-1 is following.<br>
BBc-1: https://github.com/beyond-blockchain/bbc1
  
# Installation
At your project directory, do either one of the following.

・From npm/yarn:
```$xslt
$ npm install --save js-bbclib
$ yarn add js-bbclib
```

・From GitHub:
```$xslt
$ git clone https://github.com/t-hashimoto249/js-bbclib.git
```

# Feature for js-bbclib 

Numeber is a one of primitive type in standard javascript by ECMA.
By the standard document, the Number type has exactly 18437736874454810627 (that is, 264-253+3) values, representing the double-precision 64bit format IEEE 754-2008 values as specified in the IEEE Standard for Binary Floating-Point Arithmetic, except that the 9007199254740990 (that is, 253-2) distinct “Not-a-Number” values of the IEEE Standard are represented in Javascript. The timestamp value in BBcTransaction is defined by 64bit number type in the standard document. In that case, it can not process for the Number type and is used bn class in bn.js(https://www.npmjs.com/package/bn.js). It is one of popular class for big number in javascript. 

 
# Usage
```
import * as bbclib from 'js-bbclib.js'

const witness = new bbclib.BBcWitness();
const bin = witness.pack();
const unpack_witness = new bbclib.BBcWitness();
unpack_witness.unpack(bin);

```


# License
Licensed under the MIT license, see LICENSE file.

## keyword
BBc-1, Block-Chain, 
