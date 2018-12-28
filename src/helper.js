import { BBcEvent } from './bbc_class/BBcEvent';
import { BBcAsset } from './bbc_class/BBcAsset';
import { BBcTransaction } from './bbc_class/BBcTransaction';
import { BBcWitness } from './bbc_class/BBcWitness';
import { BBcRelation } from './bbc_class/BBcRelation';
import { Buffer } from 'buffer';
import jscu from 'js-crypto-utils';
import jseu from 'js-encoding-utils';

export async function make_transaction(user_id, event_num, ref_num, witness) {
  const txobj = await get_new_transaction(user_id, event_num, ref_num, witness);
  if (event_num > 0) {
    for (let i = 0; i < event_num; i++) {
      txobj.events[i].add_reference_indices(i);
      txobj.events[i].add_mandatory_approver(hexStringToByte('0'));
    }
  }
  txobj.witness.add_witness(user_id);
  await txobj.set_transaction_id();
  return txobj;
}

export async function sign_and_add_signature(transaction, key_pair) {
  const sig = await transaction.sign(null, null, key_pair);
  transaction.add_signature(transaction.user_id, sig);
}

export async function get_new_transaction(user_id, event_num, relation_num, witness) {
  const transaction = new BBcTransaction(0);
  if (event_num > 0) {
    for (let i = 0; i < event_num; i++) {
      const evt = new BBcEvent(null);
      const ast = new BBcAsset(null);
      ast.add_user_id(user_id);
      await ast.digest();
      evt.add_asset(ast);
      evt.add_asset_group_id(new Buffer(8));
      transaction.add_event(evt);
    }
  }

  if (relation_num > 0) {
    for (let i = 0; i < relation_num; i++) {
      transaction.add(new BBcRelation());
    }
  }
  if (witness) {
    transaction.add_witness(new BBcWitness());
  }
  return transaction;
}

function hexStringToByte(str) {
  if (!str) {
    return new Buffer(0);
  }

  const a = [];
  for (let i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16));
  }

  return new Buffer(a);
}

export async function get_random_value(length) {
  const msg = await jscu.random.getRandomBytes(length);
  return await jscu.hash.compute(msg, 'SHA-256');
}

export async function create_pubkey_byte(pubkey) {
  const byte_x = await jseu.encoder.decodeBase64Url(pubkey['x']);
  const byte_y = await jseu.encoder.decodeBase64Url(pubkey['y']);

  const public_key= new Buffer(65);
  public_key[0] = 0x04;
  for (let i = 0; i < 32; i++) {
    public_key[i + 1] = byte_x[i];
    public_key[i + 1 + 32] = byte_y[i];
  }

  return public_key;
}

export async function create_asset(user_id) {

  const bbcAsset = new BBcAsset(user_id);
  await bbcAsset.set_random_nonce();

  const asset_file = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    asset_file[i] = 0xFF & i;
  }
  const asset_body = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    asset_body[i] = 0xFF & (i + 32);
  }
  await bbcAsset.add_asset(asset_file, asset_body);

  return bbcAsset;
}

export async function create_asset_without_file(user_id) {

  const bbcAsset = new BBcAsset(user_id);
  await bbcAsset.set_random_nonce();

  const asset_body = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    asset_body[i] = 0xFF & (i + 32);
  }
  await bbcAsset.add_asset(null, asset_body);

  return bbcAsset;
}

export function buffer_to_uint8array(buf) {
  if (!buf) return undefined;
  if (buf.constructor.name === 'Uint8Array'
    || buf.constructor === Uint8Array) {
    return buf;
  }
  if (typeof buf === 'string') buf = Buffer.from(buf);
  const a = new Uint8Array(buf.length);
  for (let i = 0; i < buf.length; i++) a[i] = buf[i];
  return a;
}

export function hbo(num, len){
  const arr = new Uint8Array(len);
  for(let i=0; i<len; i++){
    arr[i] = 0xFF && (Math.floor(num/Math.pow(256, i)));
  }
  return arr;
}

export function hboToInt64(bin){

  let num = 0;
  num = num + (bin[0]);
  num = num + (bin[1] * 256 );
  num = num + (bin[2] * 256 * 256);
  num = num + (bin[3] * 256 * 256 * 256);
  num = num + (bin[4] * 256 * 256 * 256 * 256);
  num = num + (bin[5] * 256 * 256 * 256 * 256 * 256 );
  num = num + (bin[6] * 256 * 256 * 256 * 256 * 256 * 256);
  num = num + (bin[7] * 256 * 256 * 256 * 256 * 256 * 256 * 256);

  return num;
}

export function hboToInt32(bin){
  //console.log("bin:", bin);
  //console.log("bin32:", jseu.encoder.arrayBufferToHexString(bin));
  let num = 0;
  num = num + (bin[0]);
  num = num + (bin[1] * 256 );
  num = num + (bin[2] * 256 * 256);
  num = num + (bin[3] * 256 * 256 * 256);

  return num;
}

export function hboToInt16(bin){
  let num = 0;
  num = num + (bin[0]);
  num = num + (bin[1] * 256 );
  return num;
}

export function fromHexString (hexString){
  return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

export function concat(buf1, buf2) {
  // Checks for truthy values on both arrays
  if(!buf1 && !buf2) throw 'Please specify valid arguments for parameters buf1 and buf2.';

  if(!buf2 || buf2.length === 0) return buf1;
  if(!buf1 || buf1.length === 0) return buf2;

  var tmp = new Uint8Array(buf1.length + buf2.length);
  tmp.set(new Uint8Array(buf1), 0);
  tmp.set(new Uint8Array(buf2), buf1.length);
  return tmp;
}