import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    showTime: {type: mongoose.Schema.Types.ObjectId, ref: 'showtime', required: true},
    seats:  [{type: String, required: true}],
    totalAmount: {type: Number, required:true},
    status: {type: String, enum:["pending", "confirmed", "cancelled"], default: "confirmed", },
    bookinDate: {type: Date, default: Date.now}
})


export const bookingModel = mongoose.model("booking", bookingSchema)