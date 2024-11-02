import mongoose, { Schema } from "mongoose";


mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({
    userId :  {type: Schema.Types.ObjectId, ref: 'users', required: true},
    productList : {type: [{prodId: mongoose.Schema.Types.ObjectId, qty : Number}], ref: 'products', required: true},
    totalAmount : {type: Number, required: true},
    purchased: {type: Boolean, required: true},
    purchaseDate : {type: Date}
});

const model = new mongoose.model(collection,schema);

export default model;


