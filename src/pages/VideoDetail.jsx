import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import videoStore from "../stores/VideoStore";
import favoriteStore from "../stores/FavoriteStore";
import { observer } from "mobx-react";
import { CommentStoreProvider } from "../stores/CommentStore";
import CommentComponent from "./Comment";
import CommentListComponent from "./CommentList";
import ChatComponent from "../components/chat/ChatComponent";
import { VideoRenderer } from "../components/video/VideoRenderer";
import Toast from "../components/util/Toast";

const VideoDetail = observer(() => {
    const [isChatVisible, setIsChatVisible] = useState(true);
    const toggleChatVisibility = () => setIsChatVisible((prev) => !prev);

    const videoContainerStyle = {
        width: isChatVisible ? "70%" : "100%",
    };

    const [searchParams] = useSearchParams();
    const videoID = searchParams.get('v');
    const { video, loading } = videoStore;
    const { toggleFavorite } = favoriteStore;
    // 토스트 상태 관리
    const [toast, setToast] = useState({
        message: '',
        isVisible: false,
        type: 'success'
    });

    // 토스트 표시 함수
    const showToast = (message, type = 'success') => {
        setToast({
            message,
            isVisible: true,
            type
        });

        // 3초 후에 토스트 숨기기
        setTimeout(() => {
            setToast(prev => ({ ...prev, isVisible: false }));
        }, 3000);
    };

    // 즐겨찾기 토글 핸들러
    const handleToggleFavorite = (videoId) => {
        toggleFavorite(videoId);
        
        // 즐겨찾기 상태에 따라 다른 메시지 표시
        const message = video.isFavorite 
            ? "즐겨찾기에서 제거되었습니다." 
            : "즐겨찾기에 추가되었습니다.";
            
        showToast(message, 'success');
    };

    useEffect(() => {
        videoStore.getVideo(videoID);
    }, [videoID]);

    if (loading) return <div>Loading...</div>;
    if (!video) return <div>No video details available.</div>;
    // 기본 값 설정
    if (video.title === null) video.title = "hi";
    if (video.description === null) video.description = "설명";
    if (video.cnt === null) video.cnt = 0;

    return (
        <>
            <div id="video-chat-container">
                <div id="main-video" style={videoContainerStyle}>               
                    <VideoRenderer video={video}/>
                </div>
                <div>                    
                    <div id="chat-container" className={isChatVisible ? "" : "hidden"}>
                        <ChatComponent videoId={video.videoId} />
                    </div>
                </div>                
            </div>
                    <h1>제목 : {video.title}</h1>
                    <button
                        onClick={() => handleToggleFavorite(video.videoId)}
                    >
                        {'즐겨찾기'}{video.isFavorite ? '★' : '☆'}
                    </button>
                    <p id="video-description">{video.description}</p>
                    <p>조회수 : {video.cnt}</p>
                    <button id="chat-toggle-button" onClick={toggleChatVisibility}>
                        {isChatVisible ? "채팅 숨기기" : "채팅 보기"}
                    </button>
            
            <div id="comment-container">
                <div id="comment-container2">
                    <CommentStoreProvider>
                        <CommentComponent />
                        <CommentListComponent />
                    </CommentStoreProvider>
                </div>             
            </div>
            <Toast 
                message={toast.message} 
                isVisible={toast.isVisible} 
                type={toast.type} 
            />
        </>
    );
});

export default VideoDetail;
