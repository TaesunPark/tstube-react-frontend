import { SERVER_URL } from "../../env";

export function UploadVideoComponent({ video }) {
    console.log(video.fileName + " 비디오");
    return (
        <video controls style={{ maxWidth: "100%", height: "auto"}}>
            <source 
                src={`${SERVER_URL}/upload?fileName=${video.fileName}&t=${new Date().getTime()}`} 
                type="video/mp4" 
            />
            <source 
                src={`${SERVER_URL}/upload?fileName=${video.fileName}&t=${new Date().getTime()}`} 
                type="video/x-msvideo" 
            />
            <source 
                src={`${SERVER_URL}/upload?fileName=${video.fileName}&t=${new Date().getTime()}`} 
                type="audio/mpeg" 
            />
            <source 
                src={`${SERVER_URL}/upload?fileName=${video.fileName}&t=${new Date().getTime()}`} 
                type="audio/ogg" 
            />
            <source 
                src={`${SERVER_URL}/upload?fileName=${video.fileName}&t=${new Date().getTime()}`} 
                type="audio/wav" 
            />
            Your browser does not support the video tag.
        </video>
    );
}