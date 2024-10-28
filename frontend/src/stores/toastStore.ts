import { Toast } from '@/ts/_interface/toast';
import { defineStore } from 'pinia';
import { nextTick } from 'vue';

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[],
    toastTime: 2000,
  }),
  actions: {
    showMessage(message: string, type: 'success' | 'error' | 'info') {
      const newToast: Toast = {
        id: Date.now(),
        title: this.getTitle(type),
        message: message,
        type: type,
        iconClass: this.getIconClass(type),
        visible: true,
      };

      this.toasts.push(newToast);
      this.animateToast(newToast);
    },

    // Animate toast and handle auto removal
    async animateToast(toast: Toast) {
      await nextTick();

      const toastElement = document.querySelector(
        `[data-toast-id="${toast.id}"]`,
      ) as HTMLElement;
      const progress = toastElement.querySelector('.progress') as HTMLElement;
      progress.style.setProperty('--toast-time', `${this.toastTime}ms`);

      setTimeout(() => {
        toastElement.classList.add('active');
        progress.classList.add('active');
      }, 100);

      setTimeout(() => {
        toastElement.classList.remove('active');
      }, this.toastTime);

      setTimeout(() => {
        progress.classList.remove('active');
        toastElement.remove();
      }, this.toastTime + 400);

      setTimeout(() => {
        this.removeToast(toast.id);
      }, this.toastTime + 400);
    },

    removeToast(id: number) {
      const index = this.toasts.findIndex(toast => toast.id === id);
      if (index !== -1) {
        this.toasts.splice(index, 1);
      }
    },

    getTitle(type: 'success' | 'error' | 'info'): string {
      switch (type) {
        case 'error':
          return 'Error';
        case 'success':
          return 'Success';
        default:
          return 'Info';
      }
    },

    getIconClass(type: 'success' | 'error' | 'info'): string {
      switch (type) {
        case 'error':
          return 'fa-solid fa-xmark';
        case 'success':
          return 'fa-solid fa-check';
        default:
          return 'fa-solid fa-info';
      }
    },
  },
});
