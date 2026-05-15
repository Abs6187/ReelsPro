import { IVideo } from "@/models/Video";


export type videoFormData = Omit<IVideo, "_id">

type FetchOptions = {
    method? : "GET" | "POST" | "PUT" | "DELETE";
    body? : any;
    headers? : Record<string, string>;
}

class ApiClient {

    private async fetch<T>(
        endpoint: string,
        options: FetchOptions   = {}    

    ) : Promise<T> {
        const {method= "GET" ,body, headers ={}} = options

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        }

        const res = await fetch(`/api${endpoint}`, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: defaultHeaders
        })

        if(!res.ok){
            throw new Error(await res.text())
        }

        return res.json()
    }


    async getVideos(){
        return this.fetch<IVideo[]>("/videos")
    }

    async getAVideo(id: string){
        return this.fetch<IVideo>(`/videos/${id}`)
    }

    async createVideo(videoData : videoFormData){
        return this.fetch<IVideo>("/videos", {
            method: "POST",
            body: videoData
        })
    }
}

export const apiClient = new ApiClient()