// src/store/useChatStore.ts
import { reactive, toRefs } from 'vue';
import state, { addSocketConnectListener } from '@/ts/networking/networking.client-websocket';

interface GlobalChatMessage {
    username: string;
    text: string;
}

const chatState = reactive({
    messages: [] as GlobalChatMessage[],
});

function initializeGlobalChat() {
    if (state.socket && !state.socket.hasListeners('sendGlobalChatMessage')) {
        state.socket.on('sendGlobalChatMessage', (message: GlobalChatMessage) => {
            chatState.messages.push(message);
        });
    }
}

// Load chat history from sessionStorage
function loadChatHistory() {
    const storedMessages = sessionStorage.getItem('globalChatHistory');
    if (storedMessages) {
        chatState.messages = JSON.parse(storedMessages);
    }
}

// Save chat history to sessionStorage
function saveChatHistory() {
    sessionStorage.setItem('globalChatHistory', JSON.stringify(chatState.messages));
}

// Call these functions to initialize and manage chat history
loadChatHistory();
addSocketConnectListener(initializeGlobalChat);

// Ensure chat history is saved when the window is unloaded
window.addEventListener('beforeunload', saveChatHistory);

export default function useChatStore() {
    return { ...toRefs(chatState) };
}
