import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGDB_URI!;

if(!MONGODB_URI){
    throw new Error('MONGODB_URI is not defined')
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn: null, promise: null}
}

export async function connectToDatabase(){
    if(cached.conn){
        return cached.conn
    }

    if(!cached.promise){
       const opts = {
         bufferCommands: true,
         maxPoolSize: 10
       } 
       
       cached.promise = mongoose.connect(MONGODB_URI,opts).then(()=>
        mongoose.connection
    )
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        console.log(error)
        throw new Error("Check database file")
    }

    return cached.conn
}
