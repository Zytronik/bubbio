<template>
    <div class="overlay user-profile-overlay" @click.self="closeUserProfile">
        <div class="user-profile-wrapper">
            <button class="goBackButton" title="Back" @click="closeUserProfile">X</button>
            <div v-if="userError" class="user-error-message">
                {{ userError }}
            </div>
            <div v-if="userData" class="user-profile-outer-container">
                <div class="profile-banner" :style="{ backgroundImage: `url(${profileBannerImagePath})` }"></div>
                <div class="user-profile-inner-container">
                    <div class="user-profile-meta">
                        <img class="profile-pic" :src="profilePicImagePath" alt="Profile Picture">
                        <h2>{{ userData.username.toUpperCase() }}</h2>
                        <p v-if="userData.id < 4">Since the Beginning</p>
                        <p v-else>Joined: {{ formattedDate }}</p>
                        <p>Last seen: TODO</p>
                        <div class="user-country">
                            <p v-if="userData.country">{{ userData.country }}</p>
                            <img class="user-flag" v-if="userData.countryCode && userData.country" :src="flagImagePath"
                                :title="userData.country" alt="Country Flag">
                        </div>
                    </div>

                    <h3>Sprint</h3>
                    <div v-if="userData.sprintStats.rank">
                        <p>Leaderboard Rank: {{ userData.sprintStats.rank }}</p>
                        <p>Average Bubbles Cleared: {{ Math.round(userData.sprintStats.averageBubblesCleared * 100) / 100 }}</p>
                        <p>Average Bubbles Per Second: {{ Math.round(userData.sprintStats.averageBubblesPerSecond * 100) / 100 }}</p>
                        <p>Average Bubbles Shot: {{ Math.round(userData.sprintStats.averageBubblesShot * 100) / 100 }}</p>
                        <p>Average Sprint Time: {{ formatTimeNumberToString(userData.sprintStats.averageSprintTime) }}</p>
                        <p>Games Played: {{ Math.round(userData.sprintStats.sprintGamesPlayed * 100) / 100 }}</p>
                    </div>
                    <div v-else>
                        <p>This User has never played Sprint.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { httpClient } from '@/ts/networking/networking.http-client';
import { getDefaultProfileBannerURL, getDefaultProfilePbURL } from '@/ts/networking/paths';
import { formatTimeNumberToString } from '@/ts/gameplay/gameplay.stat-tracker';

interface UserData {
    id: number;
    username: string;
    createdAt: string;
    countryCode: string;
    country: string;
    pbUrl: string;
    bannerUrl: string;
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

        const profileBannerImagePath = computed(() => {
            if (userData.value && userData.value.bannerUrl) {
                return userData.value.bannerUrl;
            }
            return getDefaultProfileBannerURL();
        });

        const profilePicImagePath = computed(() => {
            if (userData.value && userData.value.pbUrl) {
                return userData.value.pbUrl;
            }
            return getDefaultProfilePbURL();
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
            profilePicImagePath,
            profileBannerImagePath,
            formatTimeNumberToString,
        };
    },
});
</script>
<style scoped>
.user-profile-overlay {
    background: rgba(0, 0, 0, 0.0) !important;
    justify-content: flex-start;
}

.user-profile-wrapper {
    height: 90vh;
    width: 80vw;
    background-color: black;
}

.profile-banner {
    width: 100vw;
    height: 20%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.profile-pic {
    position: absolute;
    height: 10vw;
    width: 10vw;
    object-fit: cover;
    left: 0;
    border-radius: 20%;
    top: -2vw;
}

.user-profile-outer-container {
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.user-profile-inner-container {
    width: 80%;
    height: 80%;
    position: relative;
    display: flex;
    flex-direction: column;
}

.user-profile-meta {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-left: calc(10vw + 30px);
    font-size: 18px;
    height: 10vw;
}

.user-profile-meta h2 {
    margin-bottom: 1.5%;
    margin-top: 1%;
    font-size: 30px;
}

.user-profile-meta p {
    margin: unset;
}

.user-flag {
    object-fit: contain;
    height: 80%;
    border-radius: 20%;
}

.user-country {
    margin-top: 10px;
    display: flex;
    gap: 15px;
    align-items: center;
    height: 17%;
}

h3 {
    margin: unset;
    font-size: 20px;
}

button.goBackButton {
    top: 10vh;
    right: 20vw;
}

</style>