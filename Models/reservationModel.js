const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    slot: {
        type: String,
        required: true
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'table',
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    description:{
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('reservation', reservationSchema);