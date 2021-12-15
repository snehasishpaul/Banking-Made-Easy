const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    transferID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    balance: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Transaction", transactionSchema);
