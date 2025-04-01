import { makeAutoObservable, runInAction } from "mobx";
import { CHAT_SOCKET_URL, SERVER_URL } from "../env";
import axios from "axios";

class ChattingStore {
    messages = [];
    loading = false;
    error = null;
    chatId = null;
    videoId = null;
    ws = null;
    sender = null;
    hasMoreMessages = true;
    page = 0;
    onlineUsers = {}; // 접속자 목록 추가
    isConnected = false;
    reconnectAttempts = 0;
    maxReconnectAttempts = 5;
    reconnectTimeout = null;

    constructor() {
        makeAutoObservable(this);
    }

    connect(videoId, onConnected) {
        this.videoId = videoId;
        this.loading = true;

        // 먼저 과거 채팅 이력 로드
        this.loadChatHistory();

        // WebSocket 연결
        this.ws = new WebSocket(CHAT_SOCKET_URL + `/ws/chat/` + videoId);
        
        this.ws.onopen = () => {
            console.log(`Connected to WebSocket server for video ${this.videoId}`);
            runInAction(() => {
                this.loading = false;
                this.isConnected = true;
                this.reconnectAttempts = 0;
            });

            // 사용자 정보는 WebSocket 핸드셰이크 인터셉터에서 처리되므로 
            // 여기서는 최소한의 정보만 전송
            this.ws.send(JSON.stringify({
                type: 'ENTER', 
                videoId: this.videoId,
                roomId: this.videoId, // roomId와 videoId를 동일하게 처리
            }));

            if (onConnected && typeof onConnected === 'function') {
                onConnected();
            }
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log("Received message:", message);
                
                runInAction(() => {
                    if (message.type === 'ONLINE_USERS') {
                        // 접속자 목록 메시지 처리
                        try {
                            this.onlineUsers = JSON.parse(message.message);
                        } catch (e) {
                            console.error("Error parsing online users:", e);
                        }
                    } else {
                        // 일반 채팅 메시지 처리
                        this.messages = [...this.messages, message];
                    }
                });
            } catch (e) {
                console.error("WebSocket message parsing error:", e);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            runInAction(() => {
                this.error = "채팅 연결에 문제가 발생했습니다.";
                this.isConnected = false;
            });
            this.attemptReconnect();
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed.');
            runInAction(() => {
                this.isConnected = false;
            });
            this.attemptReconnect();
        };
    }

    // 재연결 시도 로직
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts && this.videoId) {
            console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})...`);
            this.reconnectTimeout = setTimeout(() => {
                runInAction(() => {
                    this.reconnectAttempts++;
                    this.connect(this.videoId);
                });
            }, 3000); // 3초 후 재연결 시도
        }
    }

    // 메시지 전송 기능
    sendMessage(content) {
        if (!content || !content.trim()) return;
        
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({
                type: 'TALK', 
                videoId: this.videoId,
                roomId: this.videoId, // roomId와 videoId를 동일하게 처리
                message: content.trim()
                // sender는 서버에서 세션에서 가져옴
            });
            this.ws.send(message);                                    
        } else {
            runInAction(() => {
                this.error = "채팅 연결이 끊어졌습니다. 새로고침 후 다시 시도해주세요.";
            });
        }
    }

    // 연결 종료
    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        
        if (this.ws) {
            if (this.ws.readyState === WebSocket.OPEN) {
                // 퇴장 메시지 전송
                this.ws.send(JSON.stringify({
                    type: 'LEAVE', 
                    videoId: this.videoId,
                    roomId: this.videoId
                }));
            }
            this.ws.close();
        }

        runInAction(() => {
            this.ws = null;
            this.isConnected = false;
        });
    }

    // 채팅 이력 로드
    async loadChatHistory() {
        try {
            this.loading = true;
            
            const response = await axios.get(`${SERVER_URL}/chat/history/${this.videoId}?page=${this.page}&size=50`);
            
            runInAction(() => {
                // 데이터가 역순으로 오므로 다시 뒤집어서 시간 순으로 정렬
                const newMessages = response.data.data.content.reverse();
                
                if (this.page === 0) {
                    // 첫 페이지면 메시지 덮어쓰기
                    this.messages = newMessages;
                } else {
                    // 이전 메시지 추가 (앞쪽에 추가)
                    this.messages = [...newMessages, ...this.messages];
                }
                
                this.hasMoreMessages = response.data.data.totalPages > this.page + 1;
                this.loading = false;
            });
        } catch (error) {
            console.error("Failed to load chat history:", error);
            runInAction(() => {
                this.error = "채팅 이력을 불러오는데 실패했습니다.";
                this.loading = false;
            });
        }
    }

    // 이전 메시지 더 로드
    loadMoreMessages() {
        if (this.hasMoreMessages && !this.loading) {
            runInAction(() => {
                this.page += 1;
            });
            console.log("태순")
            this.loadChatHistory();
        }
    }

    // 접속자 목록 조회
    async fetchOnlineUsers() {
        try {
            const response = await axios.get(`${SERVER_URL}/chat/online/${this.videoId}`);
            console.log(response.data.data.data)
            runInAction(() => {
                this.onlineUsers = response.data.data.data;
            });
        } catch (error) {
            console.error("Failed to fetch online users:", error);
        }
    }

    // 스토어 초기화
    reset() {
        runInAction(() => {
            this.messages = [];
            this.loading = false;
            this.error = null;
            this.chatId = null;
            this.videoId = null;
            this.hasMoreMessages = true;
            this.page = 0;
            this.onlineUsers = {};
            this.isConnected = false;
            this.reconnectAttempts = 0;
        });
        this.disconnect();
    }
}

const chattingStore = new ChattingStore();
export default chattingStore;