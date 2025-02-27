import mongoose from "mongoose";


export default async function connectDatabase(uri) {
    try {

        await mongoose.connect(uri)
        console.log("Database Connected");

        
    } catch (error) {
        console.log("Database Connection Failed", error);
        
    }
}