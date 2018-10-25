import jscu from "js-crypto-utils";
import * as para from '../parameter.js';
import * as helper from '../helper.js';


let BSON = require('bson');
let bson = new BSON();

export default class {
    constructor(user_id){
        this.id_length = para.DefaultLength.BBcOne;
        this.user_id = user_id; // byte
        this.asset_id = null; // byte
        this.nonce = null; // byte
        this.asset_file_size = 0; // int
        this.asset_file = null; //byte
        this.asset_file_digest = null; //byte
        this.asset_body_size = 0; //int
        this.asset_body = null; // byte

    }

    show_asset(){
        console.log("---------showAsset--------");
        if (this.asset_id != null){
            console.log("this.asset_id");
            helper.print_bin(this.asset_id);
        }
        console.log("this.user_id");
        console.log(this.user_id.toString("hex"));
        console.log("this.nonce");
        console.log(this.nonce.toString("hex"));
        console.log("this.asset_file_size");
        console.log(this.asset_file_size);
        console.log("this.asset_file");
        console.log(this.asset_file.toString("hex"));
        console.log("this.asset_file_digest");
        console.log(this.asset_file_digest.toString("hex"));
        console.log("this.asset_body_size");
        console.log(this.asset_body_size);
        console.log("this.asset_body");
        console.log(this.asset_body.toString("hex"));
        console.log("--------------------------");

    }

    async set_random_nonce(){
        this.nonce = Buffer.from(await jscu.random.getRandomBytes(32));
    }

    set_nonce(nonce){
        this.nonce = nonce;
    }

    add_user_id(user_id){
        if (user_id != null) {
            this.user_id = user_id
        }
    }

    async add_asset( asset_file, asset_body){
        if(asset_file !== null) {
            this.asset_file = asset_file;
            this.asset_file_size = asset_file.length;
            this.asset_file_digest = Buffer.from(await jscu.hash.compute(asset_file,'SHA-256'));
        }

        if(asset_body !== null) {
            this.asset_body = asset_body;
            this.asset_body_size = asset_body.length;
        }
        await this.digest();

        return true;
    }

    async digest(){
        let target = this.serialize(true);
        this.asset_id = Buffer.from(new Buffer(await jscu.hash.compute(target,'SHA-256')).slice(0, this.id_length));
        return this.asset_id;
    }

    async set_asset_id(){
        let target = this.serialize(true);
        this.asset_id = await jscu.hash.compute(target,'SHA-256');
        return this.asset_id;
    }

    get_asset_file(){
        return this.asset_file;
    }

    get_asset_file_digest(){
        return this.asset_file_digest;
    }

    get_asset_digest(){

        return this.asset_file_digest;
    }

    async check_asset_file(asset_file){
        let digest = await jscu.hash.compute( asset_file,'SHA-256');
        return (digest === this.asset_file_digest);
    }

    serialize(for_digest_calculation){

        if (for_digest_calculation === true){
            return bson.serialize({
                'user_id': this.user_id,
                'nonce': this.nonce,
                'asset_file_size': this.asset_file_size,
                'asset_file_digest': this.asset_file_digest,
                'asset_body_size': this.asset_body_size,
                'asset_body': this.asset_body
            },{})

        }else{
            return {
                'asset_id': this.asset_id,
                'user_id': this.user_id,
                'nonce': this.nonce,
                'asset_file_size': this.asset_file_size,
                'asset_file_digest': this.asset_file_digest,
                'asset_body_size': this.asset_body_size,
                'asset_body': this.asset_body
            }
        }
    }

    deserialize(data){
        this.asset_id = data['asset_id'];
        this.user_id = data['user_id'];
        this.nonce = data['nonce'];
        this.asset_file_size = data['asset_file_size'];
        this.asset_file_digest = data['asset_file_digest'];
        this.asset_body_size = data['asset_body_size'];
        this.asset_body = data['asset_body'];
        return true;
    }
}


