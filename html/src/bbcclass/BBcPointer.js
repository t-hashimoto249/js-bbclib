
var DefaultLength ={
    BBcSimple : 8,
    BBcOne: 32
};

export default class {
    constructor(transaction_id, asset_id){
        this.id_length = DefaultLength.BBcSimple;
        if (transaction_id != null){
            this.transaction_id = transaction_id;
        }else{
            this.transaction_id = null;
        }

        if (asset_id != null){
            this.asset_id = asset_id;
        }else{
            this.asset_id = null;
        }

    }

    showPointer(){
        console.log("transaction_id");
        console.log(this.transaction_id);
        console.log("asset_id");
        console.log(this.asset_id);
    }

    set_transaction_id(transaction_id){
        this.transaction_id = transaction_id;
    }

    set_asset_id(asset_id){
        this.asset_id = asset_id;
    }

    serialize(){
        return {
            'transaction_id': this.transaction_id,
            'asset_id': this.asset_id
        }
    }

    deserialize(data){
        this.transaction_id = data['transaction_id'];
        this.asset_id = data['asset_id'];
        return true
    }

}

