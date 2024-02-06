<template>
    <div class="overlay user-profile-overlay">
        <div class="user-profile-wrapper">
            <button @click="closeUserProfile">Close</button>
            <div v-if="userError" class="user-error-message">
                {{ userError }}
            </div>
            <div v-if="userData">

                <h2>User Profile: {{ userData.username }}</h2>
                <p>Account Created: {{ userData.createdAt }}</p>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { httpClient } from '@/ts/networking/networking.http-client';

interface UserData {
    username: string;
    createdAt: string;
    // ... other user fields
}

export default defineComponent({
    name: 'UserProfileOverlay',
    props: {
        username: String,
    },
    emits: ['close-overlay'],
    setup(props, { emit }) {
        const userData = ref<UserData | null>(null);
        const userError = ref<string | null>(null);

        onMounted(async () => {
            if (props.username) {
                userData.value = await fetchUserData(props.username);
            }
        });

        async function fetchUserData(username: string) {
            try {
                const response = await httpClient.get(`/users/${username}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching user data", error);
                userError.value = "User does not exist.";
            }
        }

        function closeUserProfile() {
            emit('close-overlay');
        }

        return {
            userData,
            closeUserProfile,
            userError,
        };
    },
});
</script>
<style>
.user-profile-overlay {
    z-index: 5;
}

.user-profile-wrapper {
    height: 100%;
    width: 100%;
    background-color: black;
}
</style>