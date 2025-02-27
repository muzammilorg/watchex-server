import dotenv from 'dotenv'

dotenv.config()

export default class Constants {
    static PORT = process.env.PORT
    static URI = process.env.DB_URI
    static JWT_SECRET = process.env.JWT_SECRET

    // OMDB API

    static OMBD_BASE = process.env.BASE_URL
    static MOVIE_API_KEY = process.env.MOVIE_API

    // Nodemailer

    static HOST = process.env.EMAIL_HOST
    static EMAIL_PORT = process.env.EMAIL_PORT
    static USER = process.env.EMAIL_USER
    static PASS = process.env.EMAIL_PASS
    static FROM = process.env.EMAIL_FROM

    // Cloudinary 

    static CLOUD = process.env.CLOUDINARY
    static CLOUD_API = process.env.CLOUDINARY_API
    static API_SECRET = process.env.API_SECRET

}