<template>
  <div class="login-overlay">
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="formData.username" required />

        <label for="password">Password:</label>
        <input type="password" id="password" v-model="formData.password" required />

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    errorMessage: String
  },
  data() {
    return {
      formData: {
        username: '',
        password: '',
      },
    };
  },
  name: "LoginForm",
  methods: {
    login() {
      this.$emit('login', this.formData.username, this.formData.password);
    },
  },
});
</script>

  
<style scoped>
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  background: rgb(30, 30, 30);
  padding: 20px;
  border-radius: 8px;
  width:30%;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
}

input {
  padding: 8px;
  margin-bottom: 16px;
}

button {
  background-color: black;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  color: red;
  margin-bottom: 10px;
}

</style>
  