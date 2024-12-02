import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import videoStore from "../stores/VideoStore";
import { observer } from "mobx-react";
import { CommentStoreProvider } from "../stores/CommentStore";
import CommentComponent from "./Comment";
import CommentListComponent from "./CommentList";

const VideoDetail = observer(() => {
    const [searchParams] = useSearchParams();
    const videoID = searchParams.get('v');
    const {video, loading, error} = videoStore;

    useEffect(() => {
        videoStore.getVideo(videoID);
    }, [videoID]);

    if (loading) return <div>Loading...</div>;
    if (!video) return <div>No video details available.</div>;
    if (video.title === null ) {
        video.title = "hi";
    }
    if(video.description === null){
        video.description = "설명";
    }
    if(video.cnt === null){
        video.cnt = 0;
    }

    return(
        <>
            <div id="main-video">
                <VideoComponent video={video}/>
                <h1>제목 : {video.title}</h1>
                <p id="video-description">{video.description}</p>
                <p>조회수 : {video.cnt}</p>
            </div>
            <div>
                <CommentStoreProvider>
                    <CommentComponent />
                    <CommentListComponent />
                </CommentStoreProvider>
            </div>
        </>
    )
});

function VideoComponent({video}) {
    return (
        <div
            dangerouslySetInnerHTML={{__html: video.src}}
        />
    )
}

export default VideoDetail;