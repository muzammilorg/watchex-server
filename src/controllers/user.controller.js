import bcrypt from "bcryptjs";
import { userModel } from "../model/users.schema.js";
import jwt from "jsonwebtoken";
import Constants from "../constants.js";
import SendmailTransport from "nodemailer/lib/sendmail-transport/index.js";
import { sendMail } from "../utilities/email.send.js";


export default class Users {
    static async signup(req, res) {
        try {

            const { name, email, password } = req.body;

            // Check Any Missing Field

            if (!name || !email || !password) {
                return res.status(400).json({ message: "All Fields Are Required", status: "failed" })
            }

            // Check Email Exist

            const userExist = await userModel.findOne({ email })

            if (userExist) {
                return res.status(403).json({ message: "All Fields Are Required", status: "failed" })

            }

            // Hashing Password

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Saving User

            const newUser = new userModel({
                name,
                email,
                password: hashedPassword
            })


            await newUser.save()

            // Creating JWT Token

            const payload = {
                user: {
                    id: newUser._id
                }
            }

            const token = jwt.sign(
                payload,
                Constants.JWT_SECRET,
                { expiresIn: "1y" }

            )

            newUser.token = token;

            await newUser.save();

            res.status(201).json({ message: "User Register Successfully", status: "success", data: newUser })

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message })
        }
    }

    static async login(req, res) {
        try {

            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(403).json({ message: "All Fields Are Required", status: "failed" })
            }

            const user = await userModel.findOne({ email })

            if (!user) {
                return res.status(404).json({ message: "User Not Found", status: "failed" })

            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(401).json({ message: "Invalid Password", status: "failed" })
            }

            // Creating JWT Token

            const payload = {
                user: {
                    id: user._id
                }
            }

            const token = jwt.sign(
                payload,
                Constants.JWT_SECRET,
                { expiresIn: "1y" }

            )

            user.token = token;

            await user.save();

            console.log(user)
            res.status(200).json({ message: "Login Success", status: "success", data: user })



        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message })

        }
    }

    static async forgetPassword(req, res) {
        try {
            const {email} = req.body;

            if (!email) {
           return res.status(403).json({ message: "All Fields Are Required", status: "failed"})
        }

        const user = await userModel.findOne({email})

        if (!user) {
           return res.status(404).json({ message: "User Not Found", status: "failed"})
            
        }

        const otp = Math.floor(Math.random() * 900000 + 100000);

        const mailResponse = await sendMail({
            email: [email],
            subject: "Watchex OTP Verification Code",
            htmlTemplate: `<h2>You Watchex OTP Code ${otp}</h2>`
        })

        if (!mailResponse) {
            return res.status(500).json({message: "Failed to Send OTP, Please try again later", status: 'failed'})
        }
        
        user.otp = {
            value: otp.toString(),
            expireAt: new Date(Date.now() + 1000 * 60 * 3),
            verified: false
        }

        await user.save();

        res.status(200).json({message: "OTP Sent Successfully", status: "success", })

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message })
        }
    }

    static async verifyOTP(req, res) {
        try {
            const {email, otp} = req.body;

            if (!email || !otp) {
           return res.status(403).json({ message: "All Fields Are Required", status: "failed"})
        }

        const user = await userModel.findOne({email})

        if (!user) {
           return res.status(404).json({ message: "User Not Found", status: "failed"})
            
        }

        if (user.otp.value !== otp.toString()) {
           return res.status(400).json({ message: "Invalid OTP", status: "failed"})
            
        }

        const currentTime = new Date();

        if(user.otp.expireAt < currentTime){
            return res.status(400).json({ message: "OTP Expired", status: "failed"})

        }

        user.otp.verified = true;

        await user.save();
        res.status(200).json({message: "OTP Verified Successfully", status: "success"})

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message })
        }
    }

    static async resetPassword(req, res) {
        try {

            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(403).json({ message: "All Fields Are Required", status: "failed" })
            }

            const user = await userModel.findOne({ email })

            if (!user) {
                return res.status(404).json({ message: "User Not Found", status: "failed" })

            }

            if (!user.otp.verified) {
                return res.status(409).json({ message: "OTP Authentication Failed", status: "failed" })
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await  bcrypt.hash(password, salt)
            user.password = hashedPassword;
            user.otp.verified = false;
       

            // Creating JWT Token

            const payload = {
                user: {
                    id: user._id
                }
            }

            const token = jwt.sign(
                payload,
                Constants.JWT_SECRET,
                { expiresIn: "1y" }

            )

            user.token = token;
            await user.save();

            console.log(user)
            res.status(200).json({ message: "Reset Password Successfull", status: "success", data: user })



        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", status: "failed", error: error.message })

        }
    }

}