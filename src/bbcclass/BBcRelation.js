import BBcAsset from './BBcAsset.js';
import BBcPointer from './BBcPointer.js';
import * as para from '../parameter.js';

export default class {
    constructor(asset_group_id){
        this.id_length = para.DefaultLength.BBcOne;
        if (asset_group_id != null ){
            this.asset_group_id = asset_group_id;
        }else{
            this.asset_group_id = null;
        }

        this.pointers = [];
        this.asset = null;
    }

    show_relation(){
        console.log("asset_group_id");
        console.log(this.asset_group_id);
        if( this.pointers.length > 0){
            console.log("pointers");
            for(let i = 0; i < this.pointers.length; i++ ){
                console.log(this.pointers[i]);
            }
        }

        if(this.asset != null){
            console.log("asset");
            this.asset.show_asset();
        }
    }

    add_asset_group_id(asset_group_id){
        if (asset_group_id != null){
            this.asset_group_id = asset_group_id;
        }
    }

    set_asset(asset) {
        this.asset = asset;
    }

    add_pointer(pointer){
        if (pointer != null){
            this.pointers.push(pointer);
        }
    }

    serialize(){
        let asset = null;
        if (this.asset != null){
            asset = this.asset.serialize();
        }

        let pointer = [];
        if(this.pointers.length > 0){
            for(let i = 0; i < this.pointers.length; i++){
                pointer.push( this.pointers[i].serialize());
            }
        }

        return {
            'asset_group_id': this.asset_group_id,
            'pointers': pointer,
            'asset': asset
        }
    }

    deserialize(data){
        this.asset_group_id = data['asset_group_id'];
        let ptrdat = data['pointers'];
        if( ptrdat.length > 0 ){
            for(let i = 0; i < ptrdat.length; i++){
                let ptr = new BBcPointer(null, null);
                ptr.deserialize(ptrdat[i]);
                this.pointers.push(ptr);
            }
        }

        let assetdat = data['asset'];
        if(assetdat != null){

            this.asset = new BBcAsset(null);
            this.asset.deserialize(assetdat);
        }
        return true
    }

}

