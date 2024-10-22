import mongoose, { Schema } from "mongoose";


mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({
    userId :  {type: Schema.Types.ObjectId, ref: 'users'},
    productList : [{type: Schema.Types.ObjectId, ref: 'products'}],
    totalAmount : {type: Number, required: true},
    purchased: {type: Boolean, required: true},
    purchaseDate : {type: Date}
});

const model = new mongoose.model(collection,schema);

export default model;


