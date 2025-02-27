import axios from "axios"
import Constants from "../constants.js"
import { movieModel } from "../model/movie.schemca.js"




export default class Movie {


    static async setMovie(req, res) {
        try {


            const { id } = req.body;
            if (!id) {
                return res.status(403).json({ message: "All fields are required", status: "failed" })
            }

            if(!req.file){
                return res.status(400).json({ message: "Please Upload Image", status: "failed" })

            }

            const response = await axios.get(`${Constants.OMBD_BASE}?i=${id}&apikey=${Constants.MOVIE_API_KEY}`)

            if (!response) {
                return res.status(404).json({ message: "Movie Data Not Found", status: "failed" })
            }

            if (response.data.Error) {
                return res.status(400).json({ message: response.data.Error, status: "failed" });
            }

            const existingMovie = await movieModel.findOne({imdbID: response.data.imdbID})

            if (existingMovie) {
                return res.status(200).json({ message: "Movie already exist in database", status: "failed" });
            }

            const saveMovie = new movieModel({
                title: response.data.Title,
                bannerImg: req?.file?.path,
                imdbID: response.data.imdbID,
                year: response.data.Year,
                genre: response.data.Genre,
                poster: response.data.Poster,
                runtime: response.data.Runtime,
                plot: response.data.Plot,
                actors: response.data.Actors,
                ratings: response.data.Ratings

            })

            await saveMovie.save()
            res.status(201).json({ message: "Movie Fetch Successful and Saved", status: "success", data: saveMovie });


        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message })

        }
    }


    static async getMovie(req, res) {

        try {

            const { id } = req.params

            if (!id) {
                return res.status(403).json({ message: "Bad Request", status: "failed" })
            }

            const response = await axios.get(`${Constants.OMBD_BASE}?i=${id}&apikey=${Constants.MOVIE_API_KEY}`)

            if (!response) {
                return res.status(404).json({ message: "Movie Data Not Found", status: "failed" })
            }

            if (response.data.Error) {
                return res.status(400).json({ message: response.data.Error, status: "failed" });
            }

            const movieData = response.data




            res.status(200).json({ message: "Movie Fetch Successful", status: "success", data: movieData })

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message })
        }


    }

    static async getAllMovies(req, res) {
        try {
          const movies = await movieModel.find(); 
          if (movies.length === 0) {
            return res.status(404).json({ message: "No movies found", status: "failed" });
          }
          res.status(200).json({ message: "Movies fetched successfully", status: "success", data: movies });
        } catch (error) {
          res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message });
        }
      }
}