const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    parent: [{
        _id: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'Category'
        },
        title: String,
        price: Number
    }],
    ancestors: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        },
        title: String,
        price: Number
    }],
    price: {
        type: Number,
        default: null
    },
    numberOfItemsSold: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('Category', CategorySchema);
