<template>
    <div class="overlay user-profile-overlay">
        <div class="user-profile-wrapper">
            <button @click="closeUserProfile">Close</button>
            <div v-if="userError" class="user-error-message">
                {{ userError }}
            </div>
            <div v-if="userData">
                <h2>User Profile: {{ userData.username }}</h2>
                <p>Account Created: {{ formattedDate }}</p>
                <p v-if="userData.country">Country: {{ userData.country }}</p>
                <img v-if="userData.pbUrl" :src="profilePicImagePath" alt="Profile Picture">
                <img v-if="userData.countryCode && userData.country" :src="flagImagePath" :title="userData.country"
                    alt="Country Flag">

                <h2>Sprint</h2>
                <div v-if="userData.sprintStats.rank">
                    <p>Leaderboard Rank: {{ userData.sprintStats.rank }}</p>
                    <p>Average Bubbles Cleared: {{ userData.sprintStats.averageBubblesCleared }}</p>
                    <p>Average Bubbles Per Second: {{ userData.sprintStats.averageBubblesPerSecond }}</p>
                    <p>Average Bubbles Shot: {{ userData.sprintStats.averageBubblesShot }}</p>
                    <p>Average Sprint Time: {{ userData.sprintStats.averageSprintTime }}</p>
                    <p>Games Played: {{ userData.sprintStats.sprintGamesPlayed }}</p>
                </div>
                <div v-else>
                    <p>This User has never played Sprint.</p>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { httpClient } from '@/ts/networking/networking.http-client';
import { getProfilePicURL } from '@/ts/networking/paths';

interface UserData {
    username: string;
    createdAt: string;
    countryCode: string;
    country: string;
    pbUrl: string;
    sprintStats: SprintStats;
    // ... other user fields
}

interface SprintStats {
    averageBubblesCleared: number;
    averageBubblesPerSecond: number;
    averageBubblesShot: number;
    averageSprintTime: number;
    rank: number;
    sprintGamesPlayed: number;
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

        const formattedDate = computed(() => {
            if (userData.value && userData.value.createdAt) {
                const date = new Date(userData.value.createdAt);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}.${month}.${year}`;
            }
            return "";
        });

        const profilePicImagePath = computed(() => {
            if (userData.value && userData.value.pbUrl) {
                return userData.value ? getProfilePicURL() + userData.value.pbUrl : '';
            }
            return "";
        });

        const flagImagePath = computed(() => {
            if (userData.value && userData.value.countryCode) {
                return userData.value ? require(`@/img/countryFlags/${userData.value.countryCode.toLowerCase()}.svg`) : '';
            }
            return "";
        });

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
            flagImagePath,
            formattedDate,
            profilePicImagePath
        };
    },
});
</script>
<style>
.user-profile-overlay {
    z-index: 15;
}

.user-profile-wrapper {
    height: 100%;
    width: 100%;
    background-color: black;
}

img {
    width: 10%;
    object-fit: contain;
}
</style>