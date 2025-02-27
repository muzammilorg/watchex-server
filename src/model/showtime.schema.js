import mongoose from "mongoose"

const SeatSchema = new mongoose.Schema({
    row: { type: String, required: true },
    column: { type: Number, required: true },
    status: { type: String, enum: ['available', 'reserved'], default: 'available' },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'booking' }, 
  });


const showtimeSchema = new mongoose.Schema({
    movie: {type: mongoose.Schema.Types.ObjectId, ref: "movie", required: true },
    cinemaHall: {type: String, required: true},
    showTime: {type: Date, required: true},
    seats: [SeatSchema],
    seatsAvailable: {type: Number, required: true},
    ticketPrice: { type: Number, required: true }
})


export const showtimeModel = mongoose.model('showtime', showtimeSchema)