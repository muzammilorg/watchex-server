import mongoose from "mongoose";


const paymentSchema = mongoose.Schema({
    booking: {type: mongoose.Schema.Types.ObjectId, ref: "booking", required: true},
    paymentMethod: {type: String, enum: ['credit_card', 'paypal', 'other'], required: true},
    paymentStatus: {type: String, enum: ['pending', 'complete', 'failed'], default: "pending"},
    transactionID: {type: String},
    amount: {type: Number, required: true},
    paymentDate: {type: Date, default: Date.now}
})

export const paymentModel = mongoose.model('payment', paymentSchema);
