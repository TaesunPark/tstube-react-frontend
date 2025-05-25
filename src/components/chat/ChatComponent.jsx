import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import chattingStore from "../../stores/ChattingStore";

const ChatComponent = observer(({ videoId }) => {
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    const [showOnlineUsers, setShowOnlineUsers] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartY, setDragStartY] = useState(0);
    const [initialHeight, setInitialHeight] = useState(0);
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

    // 화면 크기 감지
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // 키보드 대응 - 간단하고 효과적인 방법
    useEffect(() => {
        if (!isMobile) return;

        let initialViewportHeight = window.innerHeight;

        const handleViewportChange = () => {
            const currentHeight = window.innerHeight;
            const heightDiff = initialViewportHeight - currentHeight;
            
            const chatContainer = document.getElementById('chat-container');
            if (!chatContainer) return;

            if (heightDiff > 150) {
                // 키보드가 올라온 경우
                console.log('키보드 감지됨');
                
                // 채팅창이 숨겨져 있다면 다시 표시
                if (chatContainer.classList.contains('hidden') || 
                    window.getComputedStyle(chatContainer).visibility === 'hidden') {
                    console.log('숨겨진 채팅창 복원');
                    chatContainer.classList.remove('hidden');
                    chatContainer.style.visibility = 'visible';
                    chatContainer.style.opacity = '1';
                    chatContainer.style.transform = 'translateY(0)';
                }
                
                // 높이만 키보드에 맞게 조정
                const newHeight = Math.min(currentHeight * 0.6, 350);
                chatContainer.style.height = `${newHeight}px`;
                
                // 키보드가 올라온 후 스크롤 조정
                setTimeout(() => {
                    scrollToBottom();
                }, 200);
                
            } else {
                // 키보드가 내려간 경우
                console.log('키보드 숨김됨');
                chatContainer.style.height = '60vh';
            }
        };

        // 뷰포트 변화 감지
        window.addEventListener('resize', handleViewportChange);
        
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleViewportChange);
        }

        return () => {
            window.removeEventListener('resize', handleViewportChange);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleViewportChange);
            }
        };
    }, [isMobile]);

    // 입력 필드 포커스 시 채팅창 복원
    const handleInputFocus = () => {
        if (!isMobile) return;
        
        console.log('입력 필드 포커스');
        
        // 포커스 직후 채팅창 상태 확인 및 복원
        setTimeout(() => {
            const chatContainer = document.getElementById('chat-container');
            if (chatContainer) {
                const styles = window.getComputedStyle(chatContainer);
                const rect = chatContainer.getBoundingClientRect();
                
                console.log('채팅창 상태:', {
                    hidden: chatContainer.classList.contains('hidden'),
                    visibility: styles.visibility,
                    opacity: styles.opacity,
                    height: rect.height
                });
                
                // 숨겨져 있거나 보이지 않으면 복원
                if (chatContainer.classList.contains('hidden') || 
                    styles.visibility === 'hidden' || 
                    styles.opacity === '0' ||
                    rect.height === 0) {
                    
                    console.log('채팅창 복원 실행');
                    chatContainer.classList.remove('hidden');
                    chatContainer.style.visibility = 'visible';
                    chatContainer.style.opacity = '1';
                    chatContainer.style.transform = 'translateY(0)';
                    
                    // 최소화되어 있다면 확장
                    if (chatContainer.classList.contains('minimized')) {
                        chatContainer.style.height = '50vh';
                        chatContainer.classList.remove('minimized');
                        
                        // 확장 후 스크롤을 맨 아래로
                        setTimeout(() => {
                            scrollToBottom();
                        }, 100);
                    }
                }
            }
        }, 100);
        
        // 키보드가 완전히 올라온 후 추가 확인
        setTimeout(() => {
            const chatContainer = document.getElementById('chat-container');
            if (chatContainer) {
                const rect = chatContainer.getBoundingClientRect();
                if (rect.height === 0) {
                    console.log('채팅창이 여전히 보이지 않음 - 재복원');
                    chatContainer.style.display = 'flex';
                    chatContainer.style.height = '50vh';
                }
            }
        }, 300);
    };

    // 입력값 변경
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    // 모바일 드래그 기능 (기존 코드 유지)
    useEffect(() => {
        if (!isMobile) return;

        const chatContainer = chatContainerRef.current;
        if (!chatContainer) return;

        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            setIsDragging(true);
            setDragStartY(touch.clientY);
            setInitialHeight(chatContainer.offsetHeight);
            
            chatContainer.style.transition = 'none';
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            const touch = e.touches[0];
            const deltaY = dragStartY - touch.clientY;
            const newHeight = Math.min(
                Math.max(initialHeight + deltaY, 60),
                window.innerHeight * 0.9
            );
            
            chatContainer.style.height = `${newHeight}px`;
        };

        const handleTouchEnd = () => {
            if (!isDragging) return;
            
            setIsDragging(false);
            
            chatContainer.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s ease';
            
            const currentHeight = chatContainer.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            if (currentHeight < viewportHeight * 0.2) {
                chatContainer.style.height = '60px';
                chatContainer.classList.add('minimized');
            } else if (currentHeight < viewportHeight * 0.4) {
                chatContainer.style.height = '40vh';
                chatContainer.classList.remove('minimized');
            } else {
                chatContainer.style.height = '70vh';
                chatContainer.classList.remove('minimized');
            }
        };

        const header = chatContainer.querySelector('.chat-title-header');
        if (header) {
            header.addEventListener('touchstart', handleTouchStart, { passive: false });
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (header) {
                header.removeEventListener('touchstart', handleTouchStart);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [isMobile, isDragging, dragStartY, initialHeight]);

    // 소켓 연결 관리 - 안정화
    useEffect(() => {
        let isComponentMounted = true;
        
        console.log('소켓 연결 시도:', videoId);
        
        // 연결 설정
        chattingStore.connect(videoId, () => {
            if (isComponentMounted) {
                console.log('소켓 연결 성공');
                chattingStore.fetchOnlineUsers();
            }
        });
        
        // 30초마다 접속자 목록 갱신 (연결 상태일 때만)
        const intervalId = setInterval(() => {
            if (isComponentMounted && chattingStore.isConnected) {
                console.log('접속자 목록 갱신');
                chattingStore.fetchOnlineUsers();
            }
        }, 30000);

        return () => {
            console.log('소켓 연결 해제');
            isComponentMounted = false;
            clearInterval(intervalId);
            chattingStore.disconnect();
        };
    }, [videoId]); // videoId가 실제로 변경될 때만 재연결

    useEffect(() => {
        const messagesContainer = messagesEndRef.current;

        const handleScroll = () => {
            if (messagesContainer.scrollTop === 0 && !isLoadingMore) {
                setIsLoadingMore(true);                
                chattingStore.loadMoreMessages();
                setTimeout(() => {
                    setIsLoadingMore(false);
                }, 1000);
            }
        };

        if (messagesContainer) {
            messagesContainer.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (messagesContainer) {
                messagesContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isLoadingMore]);

    // 접속자 목록 토글 - 불필요한 재요청 방지
    useEffect(() => {
        if (showOnlineUsers && chattingStore.isConnected) {
            console.log('접속자 목록 표시 - 데이터 갱신');
            chattingStore.fetchOnlineUsers();
        }
    }, [showOnlineUsers]); // chattingStore.isConnected 의존성 제거

    const toggleOnlineUsers = () => {
        setShowOnlineUsers(!showOnlineUsers);
        // 중복 요청 제거 - useEffect에서 처리
    };

    const sendMessage = () => {
        if (message.trim() && chattingStore.isConnected) {
            console.log('메시지 전송:', message);
            chattingStore.sendMessage(message);
            setMessage("");
            
            // 메시지 전송 후 단순하게 스크롤
            setTimeout(() => {
                scrollToBottom();
            }, 150);
        } else if (!chattingStore.isConnected) {
            console.log('소켓 연결 끊어짐 - 메시지 전송 실패');
        }
    };

    // 스크롤을 맨 아래로 이동하는 함수 - 단순화
    const scrollToBottom = () => {
        const messagesContainer = messagesEndRef.current;
        if (!messagesContainer) return;

        // 단순하게 최대값으로 스크롤
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        if (isMobile) {
            // 모바일에서는 약간의 지연 후 한 번 더
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    // Enter 키로 메시지 전송 시에도 스크롤 처리
    const handleEnterKey = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (message.trim()) {
                chattingStore.sendMessage(message);
                setMessage("");
                
                // Enter로 전송 후에도 스크롤
                setTimeout(() => {
                    scrollToBottom();
                }, 100);
                
                // 모바일 키보드 환경에서 추가 처리
                if (isMobile) {
                    setTimeout(() => {
                        const messagesContainer = messagesEndRef.current;
                        if (messagesContainer) {
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        }
                        
                        // 페이지 스크롤도 조정
                        const inputContainer = document.getElementById('chat-container-input-box');
                        if (inputContainer) {
                            const rect = inputContainer.getBoundingClientRect();
                            const viewportHeight = window.visualViewport?.height || window.innerHeight;
                            
                            if (rect.bottom > viewportHeight - 10) {
                                window.scrollBy({
                                    top: rect.bottom - viewportHeight + 20,
                                    behavior: 'smooth'
                                });
                            }
                        }
                    }, 300);
                }
            }
        }
    };

    const closeMobileChat = () => {
        if (isMobile) {
            const chatContainer = document.getElementById('chat-container');
            if (chatContainer) {
                chatContainer.classList.add('hidden');
                
                document.body.classList.remove('chat-open');
                
                const toggleBtn = document.getElementById('chat-toggle-button');
                if (toggleBtn) {
                    toggleBtn.classList.remove('chat-open');
                }
                
                const event = new CustomEvent('closeMobileChat');
                window.dispatchEvent(event);
            }
        }
    };

    useEffect(() => {
        const messagesContainer = messagesEndRef.current;
        const chatContainer = chatContainerRef.current;
        
        if (messagesContainer && (!isMobile || !chatContainer?.classList.contains('minimized'))) {
            // 새 메시지 추가 시 단순하게 스크롤
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }, [chattingStore.messages, isMobile]);

    // 렌더링 함수들 (기존 코드 그대로)
    const renderMessages = () => {
        if (chattingStore.messages.length === 0) {
            return <div className="no-messages">대화가 없습니다.</div>;
        }

        const uniqueMessages = [];
        const seen = new Set();

        chattingStore.messages.forEach(msg => {
            const msgId = `${msg.sender || "Unknown"}-${msg.message}-${msg.timestamp || Date.now()}`;
            
            if (!seen.has(msgId)) {
                seen.add(msgId);
                uniqueMessages.push(msg);
            }
        });

        return uniqueMessages.map((msg, index) => (
            <div key={index} className="message-item">
                <strong className="message-sender">{msg.sender || "Unknown"}</strong>: {msg.message}
            </div>
        ));
    };

    const renderOnlineUsers = () => {
        try {
            const users = chattingStore.onlineUsers;
            
            if (!users || typeof users !== 'object') {
                return <div className="no-users">접속자 정보를 불러올 수 없습니다.</div>;
            }
            
            const userKeys = Object.keys(users);
            
            if (userKeys.length === 0) {
                return <div className="no-users">접속자가 없습니다.</div>;
            }

            return (
                <ul className="users-list">
                    {userKeys.map((key, index) => {
                        try {
                            const userInfo = users[key];
                            
                            if (userInfo == null) {
                                return (
                                    <li key={key || index} className="user-item">
                                        <span className="user-dot"></span>
                                        알 수 없는 사용자
                                    </li>
                                );
                            }
                            
                            let userName = typeof userInfo === 'object' ? 
                                JSON.stringify(userInfo) : String(userInfo);
                            
                            if (userName.includes(':')) {
                                userName = userName.split(':')[1];
                            }
                            
                            return (
                                <li key={key || index} className="user-item">
                                    <span className="user-dot"></span>
                                    {userName || '알 수 없는 사용자'}
                                </li>
                            );
                        } catch (err) {
                            console.error("Error rendering user:", err);
                            return (
                                <li key={index} className="user-item error">
                                    사용자 정보 렌더링 오류
                                </li>
                            );
                        }
                    })}
                </ul>
            );
        } catch (error) {
            console.error("Error in renderOnlineUsers:", error);
            return <div className="error">접속자 목록을 표시하는 중 오류가 발생했습니다.</div>;
        }
    };

    return (
        <div 
            className="chat-wrapper" 
            ref={chatContainerRef}
        >
            <div 
                className="chat-title-header"
                style={{ cursor: 'default' }}
            >
                <h4 className="chat-title">
                    채팅방 {isMobile && `(${Object.keys(chattingStore.onlineUsers).length}명)`}
                </h4>
                {isMobile && (
                    <button 
                        className="mobile-close-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            closeMobileChat();
                        }}
                        aria-label="채팅 닫기"
                        type="button"
                    >
                        ✕
                    </button>
                )}
            </div>
            
            <div className="chat-status-header">
                <div className="connection-status">
                    {chattingStore.isConnected ? "연결됨" : "연결 끊김"}
                </div>
                <div>
                    <button
                        onClick={toggleOnlineUsers}
                        className={`users-toggle-btn ${showOnlineUsers ? 'expanded' : ''}`}
                    >
                        <span>접속자 {Object.keys(chattingStore.onlineUsers).length}명</span>
                        <span>{showOnlineUsers ? "▲" : "▼"}</span>
                    </button>
                </div>
            </div>

            {showOnlineUsers && (
                <div className="users-container">
                    {renderOnlineUsers()}
                </div>
            )}

            {chattingStore.error && (
                <div className="error-message">
                    Error: {chattingStore.error}
                </div>
            )}

            {chattingStore.loading && (
                <div className="loading-message">
                    메시지를 불러오는 중...
                </div>
            )}

            <div 
                id="chat-messages"
                ref={messagesEndRef}
                className="messages-container"
            >
                {isLoadingMore && (
                    <div className="loading-more">이전 메시지를 불러오는 중...</div>
                )}
                {renderMessages()}
            </div>
            
            <div id="chat-container-input-box" className="input-container">
                <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    onKeyPress={handleEnterKey}
                    onFocus={handleInputFocus}
                    placeholder="메시지를 입력하세요..."
                    disabled={!chattingStore.isConnected}
                    className="message-input"
                />
                <button 
                    onClick={sendMessage} 
                    disabled={!chattingStore.isConnected || !message.trim()}
                    className={`send-btn ${chattingStore.isConnected && message.trim() ? 'active' : 'disabled'}`}
                >
                    전송
                </button>
            </div>
        </div>
    );
});

export default ChatComponent;