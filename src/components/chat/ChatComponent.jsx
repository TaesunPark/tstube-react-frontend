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
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chattingStore.messages]);

    return (
        <div style={{ border: "1px solid #ccc", padding: "10px", width: "300px" }}>
            {/* 에러 메시지 표시 */}
            {chattingStore.error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                    Error: {chattingStore.error}
                </div>
            )}

            {/* 메시지 목록 */}
            <div
                style={{
                    height: "200px",
                    overflowY: "scroll",
                    border: "1px solid #ddd",
                    marginBottom: "10px",
                    padding: "5px",
                }}
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
                <div ref={messagesEndRef} />
            </div>

            {/* 메시지 입력 */}
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress} // Enter 키로 메시지 전송
                placeholder="메시지를 입력하세요..."
                style={{ width: "calc(100% - 60px)", marginRight: "5px" }}
            />
            <button onClick={sendMessage} style={{ width: "50px" }}>
                전송
            </button>
        </div>
    );
});

export default ChatComponent;
