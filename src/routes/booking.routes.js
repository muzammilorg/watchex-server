import express from 'express'
import Booking from '../controllers/booking.controller.js';


const router = express.Router()


router.post('/add', Booking.create)
router.delete('/remove', Booking.remove)
router.get('/bookedshow/:id', Booking.getBookedShow)
router.get('/usershow/:id', Booking.getSpecificUserShows)


export default router;