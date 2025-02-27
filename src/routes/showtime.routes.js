import express from 'express'
import Showtime from '../controllers/showtime.controller.js'


const router = express.Router()

router.post('/post', Showtime.create)
router.delete('/remove', Showtime.remove)
router.get('/showtimes', Showtime.getAllShowtimes)
router.get('/showtime/:id', Showtime.getShowtime)



export default router;