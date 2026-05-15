import ImageKit from "imagekit"
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET() {
    try {

        const authenticationParameters = imagekit.getAuthenticationParameters()
        return NextResponse.json(
            authenticationParameters
        );
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {error: "Imagekit auth failed"},
            {status: 500}
        )
    }
  
}