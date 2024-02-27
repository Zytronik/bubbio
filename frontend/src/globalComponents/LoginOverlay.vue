<template>
  <div class="overlay login-overlay">
    <div class="login-container">
      <transition name="fade" mode="out-in">
        <div :key="currentFormKey">

          <form @submit.prevent="checkUsername" v-show="showUsernameForm" key="username-form">
            <h2>Welcome!</h2>
            <p>Please enter your username to join.</p>
            <input type="text" id="username" placeholder="Username" v-model="formData.username" required />

            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

            <button type="submit">Join</button>
            <button type="button" @click="playAsGuest">Play as Guest (experimental)</button>
          </form>

          <form @submit.prevent="register" v-show="showRegister" key="register-form">
            <h2>Want to join?</h2>
            <p>The username <strong>{{ formData.username }}</strong> hasn't been registered. Claim it now!</p>
            <input type="password" id="passwordR" placeholder="Password" v-model="formData.password" required />
            <input type="password" id="passwordAgain" placeholder="Repeat Password" v-model="formData.passwordAgain"
              required />

            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

            <button type="submit">Register</button>
            <button type="button" @click="backtoUsernameForm">Back</button>
          </form>

          <form @submit.prevent="login" v-show="showLogin" key="login-form">
            <h2>Good to see you again!</h2>
            <p>The username <strong>{{ formData.username }}</strong> is registered. please enter your password to log in
            </p>
            <input type="password" id="passwordL" placeholder="Password" v-model="formData.password" required />

            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

            <button type="submit">Login</button>
            <button type="button" @click="backtoUsernameForm">Back</button>
          </form>

        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import eventBus from '@/ts/page/page.event-bus';
import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    currentFormKey() {
      if (this.showUsernameForm) return 'username-form';
      if (this.showRegister) return 'register-form';
      if (this.showLogin) return 'login-form';
      return 'default-key';
    }
  },
  mounted() {
    eventBus.on('navigateToLogin', () => {
      this.formData.password = '';
      this.formData.passwordAgain = '';
      this.showLogin = true;
      this.showUsernameForm = false;
      this.showRegister = false;
    });
    eventBus.on('navigateToRegister', () => {
      this.formData.password = '';
      this.formData.passwordAgain = '';
      this.showRegister = true;
      this.showUsernameForm = false;
      this.showLogin = false;
    });
  },
  unmounted() {
    eventBus.off('navigateToLogin');
    eventBus.off('navigateToRegister');
  },
  props: {
    errorMessage: String
  },
  data() {
    return {
      formData: {
        username: '',
        password: '',
        passwordAgain: '',
      },
      showLogin: false,
      showUsernameForm: true,
      showRegister: false,
    };
  },
  name: "LoginForm",
  methods: {
    backtoUsernameForm() {
      this.showUsernameForm = true;
      this.showRegister = false;
      this.showLogin = false;
      this.clearForm();
      this.$emit('switchToUsernameForm');
    },
    checkUsername() {
      this.$emit('checkUsername', this.formData.username);
    },
    register() {
      this.$emit('register', this.formData.username, this.formData.password, this.formData.passwordAgain);
    },
    playAsGuest() {
      this.$emit('playAsGuest', this.formData.username);
    },
    login() {
      this.$emit('login', this.formData.username, this.formData.password);
    },
    clearForm() {
      this.formData.username = '';
      this.formData.password = '';
      this.formData.passwordAgain = '';
    },
  },
});
</script>

  
<style scoped>
.login-overlay{
  align-items: center;
  z-index: 100;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
}

input {
  padding: 10px;
  border-radius: 4px;
  border: 0;
}

form button:first-of-type {
  margin-top: 30px;
}

button {
  background-color: black;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

h2 {
  margin-top: unset;
  margin-bottom: 12px;
}

p {
  margin-top: unset;
  margin-bottom: 10px;
}

.error-message {
  color: red;
  margin-bottom: -10px;
  margin-top: 15px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.login-container {
    background: rgb(30, 30, 30);
    padding: 30px 20px;
    border-radius: 8px;
    width: 30%;
}
</style>