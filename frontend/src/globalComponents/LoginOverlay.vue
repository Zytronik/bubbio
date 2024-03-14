<template>
  <div class="overlay login-overlay">
    <div class="login-container">
      <transition name="fade" mode="out-in">
        <div :key="currentFormKey">

          <form @submit.prevent="handleCheckUsername" v-show="showUsernameForm" key="username-form">
            <h2>Welcome!</h2>
            <p>Please enter your username to join.</p>
            <input type="text" id="username" placeholder="Username" v-model="formData.username" required />

            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

            <button type="submit">Join</button>
            <button type="button" @click="handlePlayAsGuest">Play as Guest (experimental)</button>
          </form>

          <form @submit.prevent="handleRegister" v-show="showRegister" key="register-form">
            <h2>Want to join?</h2>
            <p>The username <strong>{{ formData.username }}</strong> hasn't been registered. Claim it now!</p>
            <input type="email" id="email" placeholder="Email" v-model="formData.email" required />
            <input type="password" id="passwordRegister" placeholder="Password" v-model="formData.password" required />
            <input type="password" id="passwordRegisterAgain" placeholder="Repeat Password"
              v-model="formData.passwordAgain" required />

            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

            <button type="submit">Register</button>
            <button type="button" @click="backtoUsernameForm">Back</button>
          </form>

          <form @submit.prevent="handleLogin" v-show="showLogin" key="login-form">
            <h2>Good to see you again!</h2>
            <p>The username <strong>{{ formData.username }}</strong> is registered. please enter your password to log in
            </p>
            <input type="password" id="passwordLogin" placeholder="Password" v-model="formData.password" required />

            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

            <button type="submit">Login</button>
            <button type="button" @click="toForgotPwForm">I Forgor</button>
            <button type="button" @click="backtoUsernameForm">Back</button>
          </form>

          <form @submit.prevent="handleForgotPw" v-show="showForgotPw" key="forgotPw-form">
            <h2>Reset your Password</h2>
            <p>Please enter your email to reset your password.</p>
            <input type="email" id="emailForgot" placeholder="Email" v-model="formData.emailForgot" required />

            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <button type="submit">Send Email</button>
            <button type="button" @click="backtoLoginForm">Back</button>
          </form>

          <form @submit.prevent="handleChangePw" v-show="showChangePw" key="changePw-form">
            <h2>Change your Password</h2>
            <p>Please enter your new password.</p>
            <input type="password" id="newPassword" placeholder="New Password" v-model="formData.newPassword"
              required />
            <input type="password" id="newPasswordAgain" placeholder="Repeat New Password"
              v-model="formData.newPasswordAgain" required />

            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <button type="submit">Change Password</button>
          </form>

        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { changePw, checkIfUsernameIsTakenAndValid, forgotPw, login, loginAsGuest, register } from '@/ts/networking/networking.auth';
import { reconnectGlobalSocket } from '@/ts/networking/networking.client-websocket';
import { httpClient } from '@/ts/networking/networking.http-client';
import eventBus from '@/ts/page/page.event-bus';
import axios from 'axios';
import { ref, onMounted, computed, defineComponent } from 'vue';

export default defineComponent({
  setup(_: unknown, { emit }) {
    const formData = ref({
      username: '',
      password: '',
      passwordAgain: '',
      email: '',
      emailForgot: '',
      newPassword: '',
      newPasswordAgain: ''
    });

    const showLogin = ref<boolean>(false);
    const showUsernameForm = ref<boolean>(true);
    const showRegister = ref<boolean>(false);
    const showForgotPw = ref<boolean>(false);
    const showChangePw = ref<boolean>(false);
    const token = ref<string>("");
    const isResetPasswordPath = ref<boolean>(false);
    const errorMessage = ref<string>('');

    const currentFormKey = computed(() => {
      if (showUsernameForm.value) return 'username-form';
      if (showForgotPw.value) return 'forgotPw-form';
      if (showRegister.value) return 'register-form';
      if (showLogin.value) return 'login-form';
      if (showChangePw.value) return 'changePw-form';
      return 'default-key';
    });

    function clearForm() {
      formData.value.username = '';
      formData.value.email = '';
      formData.value.password = '';
      formData.value.passwordAgain = '';
    }

    function backtoLoginForm() {
      showLogin.value = true;
      showUsernameForm.value = false;
      showRegister.value = false;
      showForgotPw.value = false;
      formData.value.password = '';
      showChangePw.value = false;
      clearErrorMessage();
    }

    function backtoUsernameForm() {
      showUsernameForm.value = true;
      showRegister.value = false;
      showLogin.value = false;
      showChangePw.value = false;
      showForgotPw.value = false;
      clearForm();
      clearErrorMessage();
    }

    async function handleCheckUsername() {
      const { success, error } = await checkIfUsernameIsTakenAndValid(formData.value.username);
      if (error) {
        errorMessage.value = error;
      } else {
        if (success) {
          navigateToLogin();
        } else {
          navigateToRegister();
        }
        clearErrorMessage();
      }
    }

    async function handleRegister() {
      const username = formData.value.username;
      const password = formData.value.password;
      const { success, error } = await register(username, formData.value.email, password, formData.value.passwordAgain);
      if (success) {
        handleLoginLogic(username, password);
      } else {
        errorMessage.value = error;
      }
    }

    async function handlePlayAsGuest() {
      loginAsGuest(formData.value.username);
      reconnectGlobalSocket();
      eventBus.setShowLogin(false);
      emit('joinRoomFromHash');
      emit('updateAuthenticatedState');
    }

    function handleLogin() {
      handleLoginLogic(formData.value.username, formData.value.password);
    }

    async function handleLoginLogic(username: string, password: string) {
      const { success, error } = await login(username, password);
      if (success) {
        eventBus.setShowLogin(false);
        reconnectGlobalSocket();
        emit('joinRoomFromHash');
        emit('updateAuthenticatedState');
      } else {
        errorMessage.value = error;
      }
    }

    async function handleForgotPw() {
      const { success, error } = await forgotPw(formData.value.emailForgot);
      if (success) {
        emit('showInfoMessage', 'Password reset email sent.', 'success');
        navigateToLogin();
        clearErrorMessage();
      } else {
        errorMessage.value = error;
      }
    }

    async function handleChangePw() {
      const { success, error } = await changePw(token.value, formData.value.newPassword, formData.value.newPasswordAgain);
      if (success) {
        token.value = "";
        emit('showInfoMessage', 'Password was changed successfully.', 'success');
        history.replaceState(null, '', '/');
        toUsernameForm();
      } else {
        errorMessage.value = error;
      }
    }

    function clearErrorMessage() {
      errorMessage.value = '';
    }

    function toUsernameForm() {
      showLogin.value = false;
      showUsernameForm.value = true;
      showRegister.value = false;
      showForgotPw.value = false;
      showChangePw.value = false;
      clearErrorMessage();
    }

    function toForgotPwForm() {
      showLogin.value = false;
      showUsernameForm.value = false;
      showRegister.value = false;
      showForgotPw.value = true;
      showChangePw.value = false;
      clearErrorMessage();
    }

    function toChangePwForm() {
      showLogin.value = false;
      showUsernameForm.value = false;
      showRegister.value = false;
      showForgotPw.value = false;
      showChangePw.value = true;
      clearErrorMessage();
    }

    function checkUrlPathAndExtractToken() {
      const currentPath = window.location.pathname;
      isResetPasswordPath.value = currentPath.includes('/reset-password');
      if (isResetPasswordPath.value) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        token.value = urlParams.get('token') ?? '';

        if (token.value) {
          verifyResetToken(token.value);
        } else {
          history.replaceState(null, '', '/');
        }
      }
    }

    async function verifyResetToken(token: string) {
      try {
        await httpClient.post('/auth/verify-token', { token: token });
        toChangePwForm();
      } catch (error) {
        let e = 'An unknown error occurred';
        if (axios.isAxiosError(error)) {
          e = error.response?.data?.message[0] || 'Request failed';
        }
        emit('showInfoMessage', e, 'error');
        history.replaceState(null, '', '/');
      }
    }

    function navigateToLogin() {
      formData.value.password = '';
      formData.value.passwordAgain = '';
      showLogin.value = true;
      showUsernameForm.value = false;
      showRegister.value = false;
      showForgotPw.value = false;
      showChangePw.value = false;
    }

    function navigateToRegister() {
      formData.value.password = '';
      formData.value.passwordAgain = '';
      showRegister.value = true;
      showUsernameForm.value = false;
      showLogin.value = false;
      showForgotPw.value = false;
      showChangePw.value = false;
    }

    onMounted(() => {
      clearErrorMessage();
      emit('updateAuthenticatedState');
      checkUrlPathAndExtractToken();
    });

    return {
      formData,
      showLogin,
      showUsernameForm,
      showRegister,
      showForgotPw,
      showChangePw,
      currentFormKey,
      toForgotPwForm,
      handleCheckUsername,
      handlePlayAsGuest,
      handleRegister,
      backtoUsernameForm,
      handleLogin,
      handleForgotPw,
      backtoLoginForm,
      handleChangePw,
      errorMessage,
    };
  }
});
</script>


<style scoped>
.login-overlay {
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
  margin-bottom: 10px;
}

form button:first-of-type {
  margin-top: 15px;
}

button {
  background-color: black;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

p {
  margin-top: unset;
  margin-bottom: 10px;
}

.error-message {
  color: red;
  margin-top: 5px;
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