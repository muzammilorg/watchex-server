import express from "express"
import cors from "cors"
import connectDatabase from "./db/connectDB.js"
import Constants from "./constants.js"
import userRoutes from "./routes/user.routes.js"
import movieRoutes from "./routes/movie.routes.js"
import showRoutes from "./routes/showtime.routes.js"
import bookingRoutes from "./routes/booking.routes.js"



const app = express()
const PORT = Constants.PORT

app.use(express.json())
app.use(cors())

connectDatabase(Constants.URI)


app.get('/', (req, res) =>{
    res.send("Hello World Server Runnig")
})


app.use('/user', userRoutes)
app.use('/api', movieRoutes)
app.use('/show', showRoutes)
app.use('/booking', bookingRoutes)

// app.listen(PORT, () => {
//     console.log(`Server is Listening on http://localhost:${PORT}`)
// })


module.exports = app;
