/* import { reactive, toRefs } from 'vue';
import state from '@/ts/networking/networking.client-websocket';

interface GlobalChatMessage {
    username: string;
    text: string;
  }

const chatState = reactive({
  messages: [],
});

// Function to initialize chat message listener
export function initializeChat() {
  if (state.socket) {
    state.socket.on('sendGlobalChatMessage', (message: GlobalChatMessage) => {
      chatState.messages.push(message);
    });
  }
}

// Save and load chat history to sessionStorage
function saveChatHistory() {
  sessionStorage.setItem('globalChatHistory', JSON.stringify(chatState.messages));
}

function loadChatHistory() {
  const storedMessages = sessionStorage.getItem('globalChatHistory');
  if (storedMessages) {
    chatState.messages = JSON.parse(storedMessages);
  }
}

// Call loadChatHistory on initial load
loadChatHistory();

// Ensure chat history is saved when window is unloaded
window.addEventListener('beforeunload', saveChatHistory);

export default function useChatStore() {
  return { ...toRefs(chatState), initializeChat };
}
 */