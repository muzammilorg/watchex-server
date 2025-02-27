import { bookingModel } from "../model/booking.schema.js";
import { showtimeModel } from "../model/showtime.schema.js";
import { userModel } from "../model/users.schema.js";


export default class Booking {
    static async create(req, res) {
        try {

            const { userId, showtime, seats, totalAmount } = req.body;

            if (!userId || !showtime || !seats || !totalAmount) {
                return res.status(403).json({ message: "All fields are required", status: "failed" })
            }

            const userIdExist = await userModel.findById(userId)
            if (!userIdExist) {
                return res.status(404).json({ message: "User Not Found", status: "failed" })
            }

            const show = await showtimeModel.findById(showtime)
            if (!show) {
                return res.status(404).json({ message: "Show Does Not Exist", status: "failed" })
            }
            if (show.showTime <= new Date()) {
                return res.status(410).json({ message: "The show has no longer available", status: "failed" })
            }


            console.log("Requested seats:", seats);
            const availableSeats = show.seats.filter(seat =>
                seat.status === "available" &&
                seats.includes(`${seat.row}${seat.column}`)
            );





            if (availableSeats.length !== seats.length) {
                return res.status(400).json({ message: "One or more requestes seats are not available", status: "failed" })

            }

            seats.forEach(element => {
                const seat = show.seats.find(seat => `${seat.row}${seat.column}` === element)

                if (seat) {
                    seat.status = 'reserved'
                    seat.booking = userId

                }
            });

            const updatedShow = await showtimeModel.findById(showtime);

            await show.save();



            const newBooking = new bookingModel({
                user: userId,
                showTime: showtime,
                seats,
                totalAmount
            })

            const data = await newBooking.save();
            res.status(201).json({ message: "Seats Booked Successfully", status: "success", data })

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message })
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.body

            if (!id) {
                return res.status(400).json({ message: "Id Required", status: "failed" })
            }


            const booking = await bookingModel.findById(id)

            if (!booking) {
                return res.status(404).json({ message: "Booking not found", status: "failed" })
            }

            const { showTime: showtimeId, seats } = booking;

            const showtime = await showtimeModel.findById(showtimeId)

            if (!showtime) {
                return res.status(404).json({ message: "Showtime not found", status: "failed" })

            }

            showtime.seats.forEach(seat => {

                const seatIdentifier = `${seat.row}${seat.column}`;


                if (seats.includes(seatIdentifier)) {
                    seat.status = "available";
                    seat.booking = null;
                }
            })


            await showtime.save();

            const deleteBooking = await bookingModel.findByIdAndDelete(id)

            if (!deleteBooking) {
                return res.status(401).json({ message: "Booking deletion failed", status: "failed" })
            }

            res.status(202).json({ message: "Booking Deleted Successfully", status: "success" })



        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message })

        }
    }

    static async getBookedShow(req, res) {
        try {

            const { id } = req.params;

            console.log("id here => ", id);
            
            const booking = await bookingModel.findById(id).populate({path: "showTime", populate: {path: "movie"},});




            if (!booking) {
               return res.status(404).json({ message: "Booking Not Found", status: "failed", error: error.message })

            }

            res.status(200).json({ message: "Booked Show fetched successfully", status: "success", data: booking });



        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message })

        }
    }

    static async getSpecificUserShows(req, res) {
        try {
            const {id} = req.params;
            console.log("recieved user", id);
            

            const booking = await bookingModel.find({user: id}).populate({path: "showTime", populate: {path: "movie"},});

           

            if (booking.length === 0) {
                return res.status(404).json({ message: "No Booking Found", status: "failed" });
              }

           return res.status(200).json({ message: "Booked Show fetched successfully", status: "success", data: booking });

            
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message })
            
        }
    }
}