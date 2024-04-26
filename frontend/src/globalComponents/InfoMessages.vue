<template>
  <div class="toast-container">
    <transition-group name="slide" tag="div">
      <div v-for="toast in toasts" :key="toast.id" :data-toast-id="toast.id"  :class="['toast', toast.type]">
        <div class="toast-content">
          <i :class="[toast.iconClass, 'toast-icon']"></i>
          <div class="message">
            <span class="message-text text-1">{{ toast.title }}</span>
            <span class="message-text text-2">{{ toast.message }}</span>
          </div>
        </div>
        <div class="progress"></div>
      </div>
    </transition-group>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, reactive } from 'vue';

type Toast = {
  id: number;
  title: string;
  message: string;
  type: string;
  iconClass: string;
  visible: boolean;
};

interface ToastRefs {
  [key: number]: HTMLElement;
}

export default defineComponent({
  setup() {
    const toasts = reactive<Toast[]>([]);
    const toastRefs = reactive<ToastRefs>({});
    const toastTime = 2000;

    const setToastRef = (el: HTMLElement, toast: Toast) => {
      if (el) {
        toastRefs[toast.id] = el;
      }
    };

    async function showMessage(msg: string, type: string) {
      const newToast: Toast = { 
        id: Date.now(),
        title: getTitle(type),
        message: msg,
        type: type,
        iconClass: getIconClass(type),
        visible: true
      };
      toasts.push(newToast);
      await nextTick();
      const toast = document.querySelector(`[data-toast-id="${newToast.id}"]`) as HTMLElement;
      const progress = toast.querySelector(".progress") as HTMLElement;
      progress.style.setProperty('--toast-time', toastTime + 'ms');

      setTimeout(() => {
        toast.classList.add("active");
        progress.classList.add("active");
      }, 100);

      setTimeout(() => {
        toast.classList.remove("active");
      }, toastTime);

      setTimeout(() => {
        progress.classList.remove("active");
        toast.remove();
      }, toastTime + 400); //css duration

      setTimeout(() => {
        const index = toasts.findIndex(t => t.id === newToast.id && !t.visible);
        if (index !== -1) {
          toasts.splice(index, 1);
        }
      }, toastTime + 400); //css duration
    }

    function getTitle(type: string): string {
      switch (type) {
        case 'error': return 'Error';
        case 'success': return 'Success';
        default: return 'Info';
      }
    }

    function getIconClass(type: string): string {
      switch (type) {
        case 'error': return 'uil uil-times';
        case 'success': return 'uil uil-check';
        default: return 'uil uil-info';
      }
    }

    return { toasts, showMessage, setToastRef };
  }
});
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 7vh;
  right: 15px;
  z-index: 1000;
}

.toast {
  margin-top: 15px;
  border-radius: 6px;
  background: rgb(30, 30, 30);
  padding: 20px 35px 20px 25px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 300px;
  transform: translateX(calc(100% + 30px));
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.25, 1.35);
}

.toast.info {
  border-left: 8px solid #007bff;
}

.toast.error {
  border-left: 8px solid #dc3545;
}

.toast.success {
  border-left: 8px solid #40f467;
}

.toast.active {
  transform: translateX(0);
}

.toast-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.toast-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 35px;
  min-height: 35px;
  min-width: 35px;
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
}

.toast.info .toast-icon {
  background-color: #007bff;
}

.toast.error .toast-icon {
  background-color: #dc3545;
}

.toast.success .toast-icon {
  background-color: #40f467;
}

.message {
  display: flex;
  flex-direction: column;
  margin: 0 20px;
  color: white;
}

.message-text {
  font-size: 1.1em;
  font-weight: 600;
}

.text-2 {
  font-weight: 400;
  font-size: 1em;
  opacity: 0.8;
}

.progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background: #ddd;
  --toast-time: '0ms';
}

.progress::before {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 100%;
}

.toast.success .progress::before {
  background-color: #40f467;
}

.toast.error .progress::before {
  background-color: #dc3545;
}

.toast.info .progress::before {
  background-color: #007bff;
}

.progress.active::before {
  animation: progress var(--toast-time) linear forwards;
}

@keyframes progress {
  100% {
    right: 100%;
  }
}

.toast-btn {
  padding: 10px 40px;
  font-size: 20px;
  outline: none;
  border: none;
  color: #fff;
  border-radius: 50px;
  cursor: pointer;
  transition: 0.3s;
}

.toast.toast.success .toast-btn {
  background-color: #40f467;
}

.toast.toast.error .toast-btn {
  background-color: #dc3545;
}

.toast.toast.info .toast-btn {
  background-color: #007bff;
}

.toast.success .toast-btn:hover {
  background-color: #0fbd35;
}

.toast.error .toast-btn:hover {
  background-color: #c82333;
}

.toast.info .toast-btn:hover {
  background-color: #0056b3;
}
</style>
