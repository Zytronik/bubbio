<template>
  <div v-if="isVisible" :class="['message', messageTypeClass]">
    {{ displayMessage }}
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InfoMessages',
  data() {
    return {
      displayMessage: '',
      isVisible: false,
      messageTypeClass: '',
    };
  },
  methods: {
    showMessage(msg: string, type: string) {
      this.displayMessage = msg;
      this.isVisible = true;
      switch (type) {
        case 'error':
          this.messageTypeClass = 'error-message';
          break;
        case 'success':
          this.messageTypeClass = 'success-message';
          break;
        default:
          this.messageTypeClass = 'info-message';
      }
      setTimeout(() => {
        this.isVisible = false;
      }, 3000);
    },
  },
});
</script>
  
<style scoped>
.message {
  position: fixed;
  z-index: 1000;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  padding: 10px;
  border-radius: 5px;
}

.error-message {
  background-color: red;
}

.success-message {
  background-color: green;
}

.info-message {
  background-color: blue;
}
</style>
  