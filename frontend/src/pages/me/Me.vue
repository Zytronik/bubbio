<template>
  <section id="me" class="page">
    <h1>Me</h1>
    <button @click="goToState(PAGE_STATE.mainMenu)">Go to Menu</button>
    <div v-if="userData">
      <p>Username: {{ userData.username }}</p>
      <p>Created at: {{ userData.createdAt }}</p>
      <!-- Display other user data fields as needed -->
    </div>
  </section>
</template>

<script lang="ts">
import { httpClient } from '@/ts/networking/networking.http-client';
import { logUserOut } from '@/ts/networking/networking.auth';
import { onMounted, ref } from 'vue';
import { goToState } from '@/ts/page/page.page-manager';
import { PAGE_STATE } from '@/ts/page/page.e-page-state';

interface UserData {
  username: string;
  createdAt: string;
  // ... other user fields
}

export default {
  name: 'MePage',
  setup() {
    const userData = ref<UserData | null>(null);

    onMounted(async () => {
      userData.value = await fetchUserData();
    });

    async function fetchUserData() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await httpClient.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        logUserOut();
      }
    }

    return {
      userData,
      goToState,
      PAGE_STATE
    };
  },
};
</script>

<style></style>
