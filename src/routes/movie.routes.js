import express from "express"
import Movie from "../controllers/movie.controller.js";
import upload from "../middleware/multer.middleware.js";



const router = express.Router()


router.post("/set-movie", upload.single("image"),  Movie.setMovie)
router.get("/movie/:id", Movie.getMovie)
router.get("/movies",  Movie.getAllMovies)


export default router;