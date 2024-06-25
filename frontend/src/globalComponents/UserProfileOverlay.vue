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
                        <div v-if="isLoggedIn && !isMyProfile" class="friend-toggle">
                            <button title="add Friend" @click="isFriend ? removeFriend(userData?.id) : addFriend(userData?.id)">
                                <i v-if="isFriend" class="fa-solid fa-heart"></i>
                                <i v-else class="fa-regular fa-heart"></i>
                            </button>
                        </div>
                        <img class="profile-pic" :src="profilePicImagePath" alt="Profile Picture">
                        <h2>{{ userData.username.toUpperCase() }}<span class="online-status"
                                :title="isUserOnline ? 'Online' : 'Offline'"
                                :class="{ 'online': isUserOnline }"></span></h2>
                        <p v-if="userData.id < 4">Since the Beginning</p>
                        <p v-else>Joined: {{ formattedDate }}</p>
                        <p v-if="isUserOnline || userData.LastDisconnectedAt">Last seen: {{
                            getLastSeenText(userData.LastDisconnectedAt) }}</p>
                        <div class="user-country">
                            <p v-if="userData.country">{{ userData.country }}</p>
                            <img class="user-flag" v-if="userData.countryCode && userData.country" :src="flagImagePath"
                                :title="userData.country" alt="Country Flag">
                        </div>
                    </div>

                    <div class="gamemodes-wrapper">
                        <div class="ranked-wrapper">
                            <h3>Ranked</h3>
                            <div v-if="userData.rankedStats.rankedGamesPlayed">
                                <p>Currenty: {{ userData.isRanked ? 'Ranked' : 'Unranked' }}</p>
                                <p>Rank: {{ userData.rankName }}</p>
                                <p>Elo: {{ userData.rating }}±{{ userData.ratingDeviation }}</p>
                                <p>Global Rank: #{{ userData.rankedStats.globalRank }}</p>
                                <p>National Rank: #{{ userData.rankedStats.nationalRank }}</p>
                                <p>Average Bubbles Per Second: {{ userData.rankedStats.averageBubblesPerSecond }}</p>
                                <p>Average Attack Per Minute: {{ userData.rankedStats.averageAttackPerMinute }}</p>
                                <p>Average Defense Per Minute: {{ userData.rankedStats.averageDefensePerMinute }}</p>
                                <p>Ranked Games Played: {{ userData.rankedStats.rankedGamesPlayed }}</p>
                            </div>
                            <div v-else>
                                <p>This User has never played Ranked.</p>
                            </div>
                        </div>

                        <div class="ranked-wrapper">
                            <h3>Highscore</h3>
                            <div v-if="userData.highscoreStats">
                                <p>TODO</p>
                            </div>
                            <div v-else>
                                <p>This User has never played Highscore.</p>
                            </div>
                        </div>

                        <div class="sprint-wrapper">
                            <h3>Sprint</h3>
                            <div v-if="userData.sprintStats.sprintGamesPlayed">
                                <p>Global Rank: #{{ userData.sprintStats.globalRank }}</p>
                                <p>National Rank: #{{ userData.sprintStats.nationalRank }}</p>
                                <p>Average Bubbles Cleared: {{userData.sprintStats.averageBubblesCleared}}
                                </p>
                                <p>Average Bubbles Per Second: {{userData.sprintStats.averageBubblesPerSecond }}</p>
                                <p>Average Bubbles Shot: {{userData.sprintStats.averageBubblesShot}}</p>
                                <p>Average Sprint Time: {{formatTimeNumberToString(userData.sprintStats.averageSprintTime)}}</p>
                                <p>Games Played: {{userData.sprintStats.sprintGamesPlayed}}</p>
                            </div>
                            <div v-else>
                                <p>This User has never played Sprint.</p>
                            </div>
                        </div>
                    </div>
                    <p v-if="userData.totalGameTime">Total Playtime: {{ userData.totalGameTime }}</p>
                    
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { httpClient } from '@/ts/networking/networking.http-client';
import { getDefaultProfileBannerURL, getDefaultProfilePbURL } from '@/ts/networking/paths';
import { formatTimeNumberToString } from '@/ts/game/visuals/game.visuals.stat-display';
import { checkUserAuthentication } from '@/ts/networking/networking.auth';
import { formatDateToAgoText } from '@/ts/page/page.page-utils';
import { UserData } from '@/ts/page/i/page.i.user-data';
import eventBus from '@/ts/page/page.event-bus';
import { getFriends, getUserOnlineStatus } from '@/ts/page/page.page-requests';

interface ProfileData {
    id: number;
    username: string;
    createdAt: Date;
    countryCode: string;
    country: string;
    pbUrl: string;
    bannerUrl: string;
    LastDisconnectedAt: Date;
    friends: userFriend[];
    rating: number;
    ratingDeviation: number;
    rankIcon: string;
    rankName: string;
    isRanked: boolean;
    totalGameTime: number;
    sprintStats: SprintStats;
    highscoreStats: HighscoreStats;
    rankedStats: RankedStats;
}

interface userFriend{
    id: number;
    username: string;
    pbUrl: string;
}

interface SprintStats {
    averageBubblesCleared: number;
    averageBubblesPerSecond: number;
    averageBubblesShot: number;
    averageSprintTime: number;
    globalRank: number;
    nationalRank: number;
    sprintGamesPlayed: number;
}

interface HighscoreStats {
    averageBubblesCleared: number;
    averageBubblesPerSecond: number;
    averageBubblesShot: number;
    globalRank: number;
    nationalRank: number;
    highscoreGamesPlayed: number;
}

interface RankedStats {
    averageBubblesPerSecond: number;
    averageAttackPerMinute: number;
    averageDefensePerMinute: number;
    rankedGamesPlayed: number;
    globalRank: number;
    nationalRank: number;
}

export default defineComponent({
    name: 'UserProfileOverlay',
    props: {
        username: String,
    },
    emits: ['close-overlay'],
    setup(props, { emit }) {
        const profileData = ref<ProfileData | null>(null);
        const userData = ref<UserData | null> (eventBus.getUserData());
        const isFriend = ref(false);
        const userError = ref<string | null>(null);
        const isUserOnline = ref<boolean>(false);
        const isMyProfile = computed(() => profileData.value && profileData.value.id === userData.value?.id);
        const isLoggedIn = computed(() => checkUserAuthentication() && !sessionStorage.getItem('isGuest'));

        const formattedDate = computed(() => {
            if (profileData.value && profileData.value.createdAt) {
                const date = new Date(profileData.value.createdAt);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}.${month}.${year}`;
            }
            return "";
        });

        const profileBannerImagePath = computed(() => {
            if (profileData.value && profileData.value.bannerUrl) {
                return profileData.value.bannerUrl;
            }
            return getDefaultProfileBannerURL();
        });

        const profilePicImagePath = computed(() => {
            if (profileData.value && profileData.value.pbUrl) {
                return profileData.value.pbUrl;
            }
            return getDefaultProfilePbURL();
        });

        const flagImagePath = computed(() => {
            if (profileData.value && profileData.value.countryCode) {
                return profileData.value ? require(`@/img/countryFlags/${profileData.value.countryCode.toLowerCase()}.svg`) : '';
            }
            return "";
        });

        onMounted(async () => {
            if (props.username) {
                profileData.value = await fetchProfileData(props.username);
                isUserOnline.value = await getUserOnlineStatus(props.username);
                if(isLoggedIn.value){
                    isFriend.value = await checkIfIsFriend();
                }
            }
        });

        async function checkIfIsFriend() {
            const myFriends: userFriend[] = await getFriends();
            const profile = profileData.value;

            if (profile && profile.id != null) {
                return myFriends.some(friend => friend.id === profile.id);
            }
            return false;
        }

        function getLastSeenText(LastDisconnectedAt: Date) {
            if (isUserOnline.value) {
                return 'Online';
            }

            if (!LastDisconnectedAt) {
                return '';
            }

            return formatDateToAgoText(LastDisconnectedAt);
        }

        async function fetchProfileData(username: string) {
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

        async function addFriend(friendId: number | undefined) {
            if (friendId !== undefined) {
                const token = localStorage.getItem('authToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                try {
                    await httpClient.post(`/friends/add`, { friendId }, { headers });
                    eventBus.emit('updateFriendList');
                    isFriend.value = true;
                } catch (error) {
                    console.error("Error adding friend", error);
                }
            }
        }

        async function removeFriend(friendId: number | undefined) {
            if (friendId !== undefined) {
                const token = localStorage.getItem('authToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                try {
                    await httpClient.post(`/friends/remove`, { friendId }, { headers });
                    eventBus.emit('updateFriendList');
                    isFriend.value = false;
                } catch (error) {
                    console.error("Error removing friend", error);
                }
            }
        }

        return {
            userData: profileData,
            closeUserProfile,
            userError,
            flagImagePath,
            formattedDate,
            profilePicImagePath,
            profileBannerImagePath,
            formatTimeNumberToString,
            isUserOnline,
            getLastSeenText,
            isFriend,
            removeFriend,
            addFriend,
            isMyProfile,
            isLoggedIn,
            getFriends,
        };
    },
});
</script>
<style scoped>
.user-profile-overlay {
    background: rgba(0, 0, 0, 0.0) !important;
    justify-content: flex-start;
    z-index: 1;
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
    padding-top: 1%;
}

.user-profile-meta h2 {
    display: flex;
    flex-direction: row;
    align-items: center;
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

.online-status {
    height: 15px;
    width: 15px;
    display: block;
    border-radius: 50%;
    margin-left: 10px;
}

.online-status.online {
    background-color: green;
}

.friend-toggle {
    position: absolute;
    right: 0;
    top: 1%;
}

.friend-toggle button {
    background-color: transparent;
    border: none;
    color: white;
    font-size: 150%;
    cursor: pointer;
}

.gamemodes-wrapper {
    display: flex;
    justify-content: space-between;
}

</style>