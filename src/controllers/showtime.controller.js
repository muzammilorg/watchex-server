import { movieModel } from "../model/movie.schemca.js";
import { showtimeModel } from "../model/showtime.schema.js";



export default class Showtime{
    static async create(req,res) {
        try {

            const {movie, cinemaHall, showTime, seatsAvailable, ticketPrice} = req.body;

            if (!movie || !cinemaHall || !showTime || !seatsAvailable || !ticketPrice) {
                return res.status(400).json({message: "All fields are required", status: "failed"})
            }



            const movieExist = await movieModel.findById(movie)

            if (!movieExist) {
                return res.status(404).json({message: "Movie not found", status: "failed"})
            }

            const parsedShowTime = new Date(showTime);
            if (isNaN(parsedShowTime.getTime())) {
                return res.status(400).json({ message: "Invalid showTime format", status: "failed" });
            }

            const dateNow = Date.now()

            if (parsedShowTime <= dateNow) {
                return res.status(410).json({ message: "The movie ticket date has passed and is no longer available", status: "failed" });
                
            }

            const generateSeats = () => {
                const rows = ['A', 'B', 'C', 'D', 'E']
                const seatsPerRow = [5, 18, 18, 18, 16]
                const seats = []


                rows.forEach((row, index) => {
                    for (let i = 1; i <= seatsPerRow[index]; i++) {
                    seats.push({row, column: i})       
                    }

                })
                
                return seats;


            }
            console.log(generateSeats());


            const seats = generateSeats();


            const newShow = new showtimeModel({
                movie: movieExist,
                cinemaHall,
                showTime,
                seats,
                seatsAvailable,
                ticketPrice
            })


            await newShow.save()

            res.status(201).json({ message: "Show created successfully", status: "success", data: newShow })

            
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message })
        }
    }

    static async remove(req, res){
        try {
            const {id} = req.body;

            if (!id) {
                return res.status(403).json({message: "All fields are required", status: "failed"})
            }
            
            const idExist = await showtimeModel.findById(id)

            if (!idExist) {
                return res.status(404).json({message: "Show Not Found", status: "failed"})
            }

            const removeShow = await showtimeModel.findByIdAndDelete(id)

            res.status(204).json({message: "Show deleted successfully", status: "success"})



        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message })
            
        }
    }

    static async getAllShowtimes(req, res) {
        try {
          const showtimes = await showtimeModel.find().populate('movie'); // Fetch all movies
          if (showtimes.length === 0) {
            return res.status(404).json({ message: "No movies found", status: "failed" });
          }
          res.status(200).json({ message: "Movies fetched successfully", status: "success", data: showtimes });
        } catch (error) {
          res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message });
        }
      }

      static async getShowtime(req, res) {
        try {

            const {id} = req.params

          const showtimes = await showtimeModel.findById(id).populate('movie')
          if (showtimes.length === 0) {
            return res.status(404).json({ message: "No movies found", status: "failed" });
          }
          res.status(200).json({ message: "Movies fetched successfully", status: "success", data: showtimes });
        } catch (error) {
          res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message });
        }
      }
}