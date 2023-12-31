const mongoose = require('mongoose')


const productSchema = new mongoose.Schema(
    {
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
    },

    currencyId: {
        type: String,
        required: true,
        default: "INR"
    },

    currencyFormat: {
        type: String,
        required: true,
        default: "₹"
    },

    isFreeShipping: {
        type: Boolean,
        default: false,
        trim:true
    },

    productImage: {
        type: String,
        required: true
    },

    style: {
        type: String,
        trim: true
    },

    availableSizes: {
        type: [String],
        enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
        required: true,
        trim:true,
        toUpperCase:true
    },

    installments: {
        type: Number
    },
    
    deletedAt: {
        type: Date
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
},{ timestamps: true })

module.exports = mongoose.model('Products', productSchema)