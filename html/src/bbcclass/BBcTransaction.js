let date = new Date() ;

export default class {

    constructor(version, id_length){
        this.id_length = id_length;
        this.version = version;
        this.timestamp = (date.getTime() / 1000); //秒単位で記載
        this.events = [];
        this.references = [];
        this.relations = [];
        this.witness = null;
        this.cross_ref = null;
        this.signatures = [];
        this.userid_sigidx_mapping = {};
        this.transaction_id = null;
        this.transaction_base_digest = null;
        this.transaction_data = null;
        this.asset_group_ids = {};
    }

    /*load_json(json){
        return true;
    }*/

    add_parts(event, reference, relation, witness, cross_ref){
        //"""Add parts"""
        if (isArray(event)){
            if (event.length > 0){
                for(let i = 0; i < event.length; i++){
                    this.events =　event;
                }
            }
        }

        if (isArray(reference)){
            if (reference.length > 0){
                for(let i = 0; i < reference.length; i++){
                    this.references =　reference;
                }
            }
        }

        if (isArray(relation)){
            if (relation.length > 0){
                for(let i = 0; i < relation.length; i++){
                    this.relations =　relation;
                }
            }
        }

        if (witness != null){
            this.witness = witness;
        }

        if (cross_ref != null){
            this.cross_ref = cross_ref;
        }

        return true;
    }

    get_sig_index(user_id){
        if (this.userid_sigidx_mapping[user_id] == null) {
            this.userid_sigidx_mapping[user_id] = this.userid_sigidx_mapping.length();
            this.signatures.append(null);
        }
        return this.userid_sigidx_mapping[user_id];
    }

    /* add_signature(user_id, signature){
         return true;
     }
     */

    digest(){

        let target = this.selialize();
        //TODO: sha-256で暗号化する
        // let d = hashlib.sha256(target).digest()["self.id_length"];
        // let d = target.digest()["self.id_length"];
        let d = "self.id_length";
        this.transaction_id = d;
        return d;
    }

    serialize(for_id, no_header){

        let event_list = [];
        for (let i = 0; i < this.events.length; i++){
            event_list.push(this.events[i].serialize());
        }

        let ref_list = [];
        for (let i = 0; i < this.references.length; i++){
            ref_list.push(this.references[i].serialize());
        }

        let relation_list = [];
        for (let i = 0; i < this.relations.length; i++){
            relation_list.push(this.relations[i].serialize());
        }
        let tx_crossref = null;
        if(this.cross_ref != null){
            tx_crossref = this.cross_ref.serialize();
        }

        let tx_base = {
            "header": {
                "version": this.version,
                "timestamp": this.timestamp,
                "id_length": this.id_length
            },
            "events": event_list,
            "references": ref_list,
            "relations": relation_list,
            "witness": this.witness.serialize()
        };

        // TODO: sha-256で暗号化する処理が追加
        //this.transaction_base_digest = hashlib.sha256(bson.serialize(tx_base)).digest()
        this.transaction_base_digest = bson.serialize(tx_base).digest();

        if (for_id === true){
            return bson.serialize({
                "tx_base": this.transaction_base_digest,
                "cross_ref": this.cross_ref.serialize(),
            });
        }

        tx_base.update({"cross_ref": tx_crossref});

        let signature_list = [];
        for (let i = 0; i < this.signatures.length; i++){
            signature_list.push(this.signatures[i].serialize());
        }

        let dat = bson.dumps({
            "transaction_base": tx_base,
            "signatures": signature_list
        });

        if (no_header === true) {
            return dat;
        }

        //let transaction_data = bytes(to_2byte(self.format_type) + dat);
        //TODO: bytes型に変換
        this.transaction_data = "test";
        return this.transaction_data;
    }

    desirialize(data){
        //data配列のコピー
        this.transaction_data = [].concat(data);

        return true;
    }

}
