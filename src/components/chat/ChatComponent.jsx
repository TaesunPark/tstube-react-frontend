import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import chattingStore from "../../stores/ChattingStore";

const ChatComponent = observer(({ videoId }) => {
    const [message, setMessage] = useState(""); // 입력 메시지 상태
    const messagesEndRef = useRef(null); // 스크롤 관리 ref

    useEffect(() => {
        chattingStore.connect(videoId); // WebSocket 연결

        return () => {
            chattingStore.disconnect(); // WebSocket 연결 해제
        };
    }, [videoId]);

    const sendMessage = () => {
        if (message.trim()) {
            chattingStore.sendMessage(message);
            setMessage(""); // 입력 필드 초기화
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
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

    return (
        <div>
            {/* 에러 메시지 표시 */}
            {chattingStore.error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                    Error: {chattingStore.error}
                </div>
            )}

            {/* 메시지 목록 */}
            <div id="chat-messages"
            ref={messagesEndRef}
            >
                {chattingStore.messages.length === 0 ? (
                    <div>대화가 없습니다.</div>
                ) : (
                    chattingStore.messages.map((msg, index) => (
                        <div key={index} style={{ marginBottom: "5px" }}>
                            <strong>{msg.sender || "Unknown"}</strong>: {msg.message}                            
                        </div>
                    ))                    
                )}
            </div>
            
            {/* 메시지 입력 */}
            <div id="chat-container-input-box">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress} // Enter 키로 메시지 전송
                    placeholder="메시지를 입력하세요..."                    
                />
                <button onClick={sendMessage} style={{ width: "50px" }}>
                    전송
                </button>
            </div>
        </div>
    );
});

export default ChatComponent;
