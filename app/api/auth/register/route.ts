import { NextRequest,NextResponse } from "next/server";
import {connectToDatabase} from "@/lib/db";
import User from "@/models/User";

export async function POST(req:NextRequest){

    try {
        const {email,password} = await req.json()
        
        if(!email || !password){
            return NextResponse.json(
                {error: "Email and password is required"},
                {status: 400}
            )
        }

        await connectToDatabase();

        const existingUser = await User.findOne({email})

        if(existingUser){
            return NextResponse.json(
                {error: "User already exists"},
                {status: 400}
            )
        }

        const user = await User.create({email,password})
        console.log(user)

        return NextResponse.json(
            {message: "User registered successfully"},
            {status: 201}
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )
    }
}



