import { makeAutoObservable } from "mobx";
import { CHAT_SOCKET_URL } from "../env";

class ChattingStore {
    messages = [];
    loading = false;
    error = null;
    chatId = null;
    createTime = null;
    videoId = null;
    ws = null;
    sender = null;

    constructor () {
        makeAutoObservable(this);
    }

    connect(videoId) {
        this.videoId = videoId;

        this.ws = new WebSocket(CHAT_SOCKET_URL + `/ws/chat`);
        
        this.ws.onopen = () => {
            console.log(`Connected to WebSocket server.`, this.videoId)
            this.loading = false;
            this.ws.send(JSON.stringify({type: 'ENTER', videoId: this.videoId, sender: "회원"}));
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log(message + "메시지")
                this.messages = [...this.messages, message]; // 새로운 배열로 갱신
            } catch (e){
                console.error("WebSocket message parsing error:", e);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.error = error.message;
        };

        this.ws.onclose = () => {
            console.log('WebScoket connection closed.');
            this.ws = null;
        };
    }

    sendMessage(content) {
        if(this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({type: 'TALK', videoId: this.videoId, sender: "회원", message: content});
            this.ws.send(message);                                    
        }
    }

    disconnect() {
        if(this.ws) {
            this.ws.close();
        }
    }

    async fetchChatting(videoId) {
        this.loading = true;
        this.error = null;
        
        try {

        } catch (error) {
            
        }
    }
}

const chattingStore = new ChattingStore();
export default chattingStore;