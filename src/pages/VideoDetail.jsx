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
    const [isMobile, setIsMobile] = useState(false);
    
    // 화면 크기 감지
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            
            // 모바일에서는 초기에 채팅 숨김
            if (mobile) {
                setIsChatVisible(false);
            }
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        // 모바일 채팅 닫기 이벤트 리스너
        const handleCloseMobileChat = () => {
            setIsChatVisible(false);
        };
        
        window.addEventListener('closeMobileChat', handleCloseMobileChat);
        
        return () => {
            window.removeEventListener('resize', checkScreenSize);
            window.removeEventListener('closeMobileChat', handleCloseMobileChat);
        };
    }, []);

    const toggleChatVisibility = () => {
        setIsChatVisible((prev) => {
            const newState = !prev;
            
            if (isMobile) {
                if (newState) {
                    // 모바일에서 채팅 열기
                    document.body.classList.add('chat-open');
                    
                    // 채팅 토글 버튼 숨김
                    const toggleBtn = document.getElementById('chat-toggle-button');
                    if (toggleBtn) {
                        toggleBtn.classList.add('chat-open');
                    }
                } else {
                    // 모바일에서 채팅 닫기
                    document.body.classList.remove('chat-open');
                    
                    // 채팅 토글 버튼 표시
                    const toggleBtn = document.getElementById('chat-toggle-button');
                    if (toggleBtn) {
                        toggleBtn.classList.remove('chat-open');
                    }
                }
            }
            
            return newState;
        });
    };

    // 데스크탑에서만 사용되는 비디오 컨테이너 스타일
    const videoContainerStyle = {
        width: !isMobile && isChatVisible ? "70%" : "100%",
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

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
        return () => {
            // 모바일 채팅 관련 클래스 정리
            document.body.classList.remove('chat-open');
        };
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!video) return <div>No video details available.</div>;
    
    // 기본 값 설정
    if (video.title === null) video.title = "hi";
    if (video.description === null) video.description = "설명";
    if (video.cnt === null) video.cnt = 0;

    return (
        <>
            {/* 비디오 및 채팅 컨테이너 */}
            <div id="video-chat-container">
                <div id="main-video" style={videoContainerStyle}>               
                    <VideoRenderer video={video}/>
                </div>
                
                {/* 데스크탑 채팅 또는 모바일 채팅 */}
                <div>                    
                    <div 
                        id="chat-container" 
                        className={
                            isMobile 
                                ? (isChatVisible ? "" : "hidden")  // 모바일: 완전 숨김/표시
                                : (isChatVisible ? "" : "hidden")  // 데스크탑: 기존 로직
                        }
                    >
                        <ChatComponent videoId={video.videoId} />
                    </div>
                </div>                
            </div>
            
            {/* 비디오 정보 섹션 */}
            <div className="video-info-section">
                <h1 id="video-title">제목 : {video.title}</h1>
                <button
                    className="favorite-btn"
                    onClick={() => handleToggleFavorite(video.videoId)}
                >
                    {'즐겨찾기'}{video.isFavorite ? '★' : '☆'}
                </button>
                <p id="video-description">{video.description}</p>
                <p className="video-stats">조회수 : {video.cnt}</p>
            </div>
            
            {/* 채팅 토글 버튼 */}
            <button 
                id="chat-toggle-button" 
                onClick={toggleChatVisibility}
                className={isChatVisible && isMobile ? "chat-open" : ""}
                title={isChatVisible ? "채팅 숨기기" : "채팅 보기"}
            >
                {isMobile ? (
                    // 모바일: 아이콘 형태
                    <span style={{ fontSize: '20px' }}>💬</span>
                ) : (
                    // 데스크탑: 텍스트
                    isChatVisible ? "채팅 숨기기" : "채팅 보기"
                )}
            </button>
            
            {/* 댓글 섹션 */}
            <div id="comment-container">
                <div id="comment-container2">
                    <CommentStoreProvider>
                        <CommentComponent />
                        <CommentListComponent />
                    </CommentStoreProvider>
                </div>             
            </div>
            
            {/* 토스트 메시지 */}
            <Toast 
                message={toast.message} 
                isVisible={toast.isVisible} 
                type={toast.type} 
            />
        </>
    );
});

export default VideoDetail;