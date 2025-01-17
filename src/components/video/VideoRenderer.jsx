import { StreamingVideoComponent } from "../streaming/SreamingVideoComponent"
import { UploadVideoComponent } from "./UploadVideoComponent"
import { VideoComponent } from "./VideoComponent"

export function VideoRenderer({ video }){
    switch (video.type) {
        case "upload":
            return <UploadVideoComponent video={video} />                            
        case "streaming":
            return <StreamingVideoComponent video={video} />                            
        default:
            return <VideoComponent video={video} />
    }
};
