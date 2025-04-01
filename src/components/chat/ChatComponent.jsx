import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import chattingStore from "../../stores/ChattingStore";

const ChatComponent = observer(({ videoId }) => {
    const [message, setMessage] = useState(""); // 입력 메시지 상태
    const messagesEndRef = useRef(null); // 스크롤 관리 ref
    const [showOnlineUsers, setShowOnlineUsers] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        
        // 새로운 연결 설정
        chattingStore.connect(videoId, () => {
            chattingStore.fetchOnlineUsers();
        });
        
        // 30초마다 접속자 목록 갱신
        const intervalId = setInterval(() => {
            if (chattingStore.isConnected) {
                chattingStore.fetchOnlineUsers();
            }
        }, 30000);

        return () => {
            clearInterval(intervalId);
            chattingStore.disconnect(); // WebSocket 연결 해제
        };

    }, [videoId]);

    useEffect(() => {
        const messagesContainer = messagesEndRef.current;

        const handleScroll = () => {
            // 스크롤이 맨 위에 도달했는지 확인
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
    }, [isLoadingMore])

    // 접속자 목록 토글 시
    useEffect(() => {
        if (showOnlineUsers) {
            // 접속자 목록이 표시될 때 최신 정보 로딩
            chattingStore.fetchOnlineUsers();
        }
    }, [showOnlineUsers])

    const toggleOnlineUsers = () => {
        setShowOnlineUsers(!showOnlineUsers);
        if (!showOnlineUsers) {
            chattingStore.fetchOnlineUsers();
        }
    }

    const sendMessage = () => {
        if (message.trim()) {
            chattingStore.sendMessage(message);
            setMessage(""); // 입력 필드 초기화
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // 기본 Enter 동작 방지
            sendMessage();
        }
    };

    useEffect(() => {
        // 새 메시지가 추가될 때 자동으로 스크롤
        const messagesContainer = messagesEndRef.current;
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [chattingStore.messages]);

    // 메시지 렌더링 함수
    const renderMessages = () => {
        if (chattingStore.messages.length === 0) {
            return <div>대화가 없습니다.</div>;
        }

        // 중복 메시지 필터링
        const uniqueMessages = [];
        const seen = new Set();

        chattingStore.messages.forEach(msg => {
            // 메시지 식별자 생성 (발신자 + 내용 + 시간을 조합)
            const msgId = `${msg.sender || "Unknown"}-${msg.message}-${msg.timestamp || Date.now()}`;
            
            if (!seen.has(msgId)) {
                seen.add(msgId);
                uniqueMessages.push(msg);
            }
        });

        return uniqueMessages.map((msg, index) => (
            <div key={index} style={{ marginBottom: "5px" }}>
                <strong>{msg.sender || "Unknown"}</strong>: {msg.message}
            </div>
        ));
    };

    // 접속자 목록 렌더링 함수
const renderOnlineUsers = () => {
    try {
      const users = chattingStore.onlineUsers;
      
      // users가 유효한 객체인지 확인
      if (!users || typeof users !== 'object') {
        return <div>접속자 정보를 불러올 수 없습니다.</div>;
      }
      
      // 객체의 키 배열로 변환
      const userKeys = Object.keys(users);
      
      if (userKeys.length === 0) {
        return <div>접속자가 없습니다.</div>;
      }
  
      return (
        <ul style={{
          listStyleType: "none",
          padding: 0,
          margin: 0
        }}>
          {userKeys.map((key, index) => {
            try {
              const userInfo = users[key];
              
              // userInfo가 null 또는 undefined인 경우 처리
              if (userInfo == null) {
                return (
                  <li key={key || index} style={{ 
                    padding: "8px", 
                    borderBottom: index < userKeys.length - 1 ? "1px solid #eee" : "none",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <span style={{ 
                      width: "8px", 
                      height: "8px", 
                      borderRadius: "50%", 
                      backgroundColor: "#4CAF50",
                      display: "inline-block",
                      marginRight: "8px"
                    }}></span>
                    알 수 없는 사용자
                  </li>
                );
              }
              
              // userInfo가 객체인 경우 문자열로 변환
              let userName = typeof userInfo === 'object' ? 
                JSON.stringify(userInfo) : String(userInfo);
              
              // "userId:userName" 형식이면 userName 부분 추출
              if (userName.includes(':')) {
                userName = userName.split(':')[1];
              }
              
              return (
                <li key={key || index} style={{ 
                  padding: "8px", 
                  borderBottom: index < userKeys.length - 1 ? "1px solid #eee" : "none",
                  display: "flex",
                  alignItems: "center"
                }}>
                  <span style={{ 
                    width: "8px", 
                    height: "8px", 
                    borderRadius: "50%", 
                    backgroundColor: "#4CAF50",
                    display: "inline-block",
                    marginRight: "8px"
                  }}></span>
                  {userName || '알 수 없는 사용자'}
                </li>
              );
            } catch (err) {
              console.error("Error rendering user:", err);
              return (
                <li key={index} style={{ 
                  padding: "8px", 
                  color: "red"
                }}>
                  사용자 정보 렌더링 오류
                </li>
              );
            }
          })}
        </ul>
      );
    } catch (error) {
      console.error("Error in renderOnlineUsers:", error);
      return <div>접속자 목록을 표시하는 중 오류가 발생했습니다.</div>;
    }
  };

    return (
        <div>
            
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px"
            }}>
                <div>
                    {chattingStore.isConnected ? "연결됨" : "연결 끊김"}
                </div>
                <div>
                    <button
                        onClick={toggleOnlineUsers}
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            color: "#2196F3",
                            fontSize: "14px"
                        }}
                    >
                        <span style={{ marginRight: "5px" }}>접속자 {Object.keys(chattingStore.onlineUsers).length}명</span>
                        <span>{showOnlineUsers ? "▲" : "▼"}</span>
                    </button>
                </div>
            </div>

            {
                showOnlineUsers && (
                    <div>
                        {renderOnlineUsers()}
                    </div>
                )
            }

            {/* 에러 메시지 표시 */}
            {chattingStore.error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                    Error: {chattingStore.error}
                </div>
            )}

            {/* 로딩 상태 표시 */}
            {chattingStore.loading && (
                <div style={{ textAlign: "center", color: "#666", padding: "10px" }}>
                    메시지를 불러오는 중...
                </div>
            )}

            {/* 메시지 목록 */}
            <div 
                id="chat-messages"
                ref={messagesEndRef}
                style={{ 
                    height: "300px", 
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "10px",
                    marginBottom: "10px"
                }}
            >
                {renderMessages()}
            </div>
            
            {/* 메시지 입력 */}
            <div id="chat-container-input-box" style={{ display: "flex" }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="메시지를 입력하세요..."
                    disabled={!chattingStore.isConnected}
                />
                <button 
                    onClick={sendMessage} 
                    disabled={!chattingStore.isConnected || !message.trim()}
                    style={{ 
                        width: "50px",
                        marginLeft: "8px",
                        backgroundColor: chattingStore.isConnected ? "#4a90e2" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: chattingStore.isConnected ? "pointer" : "not-allowed"
                    }}
                >
                    전송
                </button>
            </div>
        </div>
    );
});

export default ChatComponent;