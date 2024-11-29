import mongoose, { Schema } from "mongoose";

mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({
    userId :  {type: Schema.Types.ObjectId, ref: 'users', required: true},
    productList : {type: [{prodId: mongoose.Schema.Types.ObjectId, qty : Number}], ref: 'products', default: []},
    totalAmount : {type: Number, default : 0},
    purchased: {type: Boolean, default:false},
    purchaseDate : {type: Date, default:null}
});

const model = new mongoose.model(collection,schema);

export default model;


