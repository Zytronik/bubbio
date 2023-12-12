<template>
  <div v-if="showOverlay" class="overlay">
    <div v-if="!usernameIsSet && !showPasswordOverlay" class="overlay-content">
      <h2>Enter Your Username</h2>
      <input @keyup.enter="checkUsername" v-model="username" placeholder="Username" />
      <button @click="checkUsername">Join</button>
    </div>
    <div v-if="showPasswordOverlay" class="overlay-content">
      <h2>Enter Your Password</h2>
      <input @keyup.enter="loginUser" type="password" v-model="password" placeholder="Password" />
      <button @click="backToUsername">Back</button>
      <button @click="">I forgor</button>
      <button @click="loginUser">Login</button>
    </div>
    <div v-if="usernameIsSet && !showRegisterOverlay" class="overlay-content">
      <h2>Want to Join?</h2>
      <button @click="backToUsername">Back</button>
      <button @click="playAsGuest">Play as Guest</button>
      <button @click="goToRegister" >Register</button>
    </div>
    <div v-if="showRegisterOverlay" class="overlay-content">
      <h2>Register here</h2>
      <input @keyup.enter="registerUser" v-model="email" placeholder="email" />
      <input @keyup.enter="registerUser" type="password" v-model="r_password" placeholder="Password" />
      <input @keyup.enter="registerUser" type="password" v-model="r_password_confirm" placeholder="Password again" />
      <button @click="goToJoinAsGuestPage">Back</button>
      <button @click="registerUser" >Register</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { socket } from '../../../clientWebsocket.js';

export default {
  name: 'LoginForm',
  setup() {
    const username = ref('');
    const password = ref('');
    const email= ref('');
    const r_password= ref('');
    const r_password_confirm = ref('');
    const usernameIsSet = ref(false);
    const showOverlay = ref(true);
    const showPasswordOverlay = ref(false);
    const showRegisterOverlay = ref(false);

    function playAsGuest() {
      closeOverlay();
    }

    function goToJoinAsGuestPage(){
      usernameIsSet.value = true;
      showRegisterOverlay.value = false;
      showPasswordOverlay.value = false;
      email.value = '';
      r_password.value = '';
      r_password_confirm.value = '';
    }

    function loginUser(){
      console.log("login user");
      console.log("username: " + username.value);
      console.log("pw: " + password.value);
      socket.emit('loginUser', { 
        username: username.value,
        pw: password.value,
      });
    }

    function registerUser(){
      console.log("register user");
      console.log("username: " + username.value);
      console.log("email: " + email.value);
      console.log("pw: " + r_password.value);
      console.log("pw2: " + r_password_confirm.value);
      socket.emit('registerUser', { 
        username: username.value,
        email: email.value,
        pw: r_password.value,
        pw_confirm: r_password_confirm.value,
      });
    }

    function goToRegister(){
      showRegisterOverlay.value = true;
    }

    function closeOverlay() {
      showOverlay.value = false;
    }

    function backToUsername() {
      username.value = '';
      password.value = '';
      usernameIsSet.value = false;
      showPasswordOverlay.value = false;
    }

    function checkUsername() {
      if (username.value.trim() !== '') {
        socket.emit('checkUsername', { username: username.value });
      }
    }

    socket.on('checkUsername', (result) => {
      if(result.isAvailable){
        usernameIsSet.value = true;
      }else{
        showPasswordOverlay.value = true;
      }
    });

    return {
      username,
      usernameIsSet,
      backToUsername,
      playAsGuest,
      showOverlay,
      checkUsername,
      password,
      showPasswordOverlay,
      showRegisterOverlay,
      goToRegister,
      registerUser,
      goToJoinAsGuestPage,
      loginUser,
      r_password,
      r_password_confirm,
      email,
    };
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background-color: #252525;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  width: 60%;
  padding: 10px;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  background-color: #ffffff;
  color: #000000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
