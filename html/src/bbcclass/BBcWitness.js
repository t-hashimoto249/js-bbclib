const DEFAULT_ID_LEN = 8;

//export class BBcWitness{
export default class {
    constructor( ){
        this.id_length = DEFAULT_ID_LEN;
        this.transaction = null;
        this.user_ids = [];
        this.sig_indices = [];
    }

    add_witness(user_id){
        if(this.user_ids.indexOf(user_id) === -1){
            //存在しなければ追加
            this.user_ids.push(user_id);
            this.transaction.get_sig_index(user_id);
        }
    }

    add_signature(user_id, signature){
        //TODO: Transactionを作った後に検証
        //this.transaction.add_signature(user_id, signature);
    }

    add_user(user){
        if(user != null){
            this.user_ids.push(user);
            return true;
        }
        return false;
    }

    add_sig_indices(indice){
        if(indice != null){
            this.sig_indices.push(indice);
            return true;
        }
        return false;
    }

    serialize(){
        return {
            'user_ids': this.user_ids,
            'sig_indices': this.sig_indices
        };
    }

    deserialize(json_data){
        this.user_ids = json_data['user_ids'];
        this.sig_indices = json_data['sig_indices'];
        for (let i = 0; i < this.user_ids.length; i++){
            //TODO: Transactionを作った後に検証
            //this.transaction.get_sig_index(this.user_ids[i]);
        }
        return true;
    }
}
