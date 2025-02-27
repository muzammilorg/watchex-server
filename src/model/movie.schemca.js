import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    Source: { type: String, required: true }, 
    Value: { type: String, required: true }   
  }, { _id: false });

const movieSchema = new mongoose.Schema({
    title: {type: String, required: true},
    bannerImg: {type: String, required: true},
    imdbID: { type: String, required: true, unique: true },
    poster: {type: String, required: true},
    year: {type: String, required: true},
    genre: {type: String, required: true},
    actors: {type: String, required: true},
    plot: {type: String, required: true},
    runtime: {type: String, required: true}, 
    showtimes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'showtime' }],
    ratings: [ratingSchema] }, 

    { timestamps: true }
)


export const movieModel = mongoose.model('movie', movieSchema)