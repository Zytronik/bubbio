<template>
  <article id="app" :class="currentComponent.name">
    <LoadingScreen :isLoading="isLoading" />
    <div class="topbar">
      <div v-if="isAuthenticated && userData" @click="showMyProfile" class="profile-wrapper">
        <img v-if="userData.pbUrl" class="profile-pic" :src="userData.pbUrl" alt="Profile Picture">
        <div class="profile-content">
          <h3>{{ userData?.username.toUpperCase() }}</h3>
          <div class="ratingDetails">
            <p v-if="userData.isRanked" class="rating">{{ userData.rating }}<span>±{{ userData.ratingDeviation }}</span>
            </p>
            <img v-if="userData?.rankInfos && userData.isRanked" class="rank-img"
              :src="getRankImagePath(userData.rankInfos.iconName)" :alt="userData?.rankInfos.name">
            <p v-else class="unranked">Unranked</p>
          </div>
          <div v-if="userData.isRanked" class="progressBar-wrapper">
            <img v-if="userData?.rankInfos && userData.rankInfos?.prevRank" class="prevRank hidden rank-img"
              :src="getRankImagePath(userData.rankInfos.prevRank.iconName)" :alt="userData.rankInfos.prevRank.name">
            <div class="progressBar">
              <div class="progressBarFill" :style="{
                'width': getProgressBarFillWidth()
              }"></div>
            </div>
            <img v-if="userData?.rankInfos && userData.rankInfos?.nextRank" class="nextRank hidden rank-img"
              :src="getRankImagePath(userData.rankInfos.nextRank.iconName)" :alt="userData.rankInfos.nextRank.name">
          </div>
        </div>
      </div>
    </div>
    <InfoMessages ref="infoMessageRef" />
    <LoginOverlay v-if="showLogin" @joinRoomFromHash="joinRoomFromHash"
      @updateAuthenticatedState="updateAuthenticatedState" />
    <Channel v-if="isChannelOpen" />
    <transition :name="isNavigatingForward ? 'slide-left' : 'slide-right'" mode="out-in">
      <component :is="currentComponent" :room-id="roomId" @joinedRoom="handleJoinRoom" @leftRoom="handleLeaveRoom"
        @updateProfileData="updateProfileData" :key="currentComponentKey">
      </component>
    </transition>
    <div class="bottomBar">
      <button @click="openChannelOverlay" @mouseenter="playSound('menu_hover')" class="openChannelButton"><span class="triangle-left"></span>Channel<span class="triangle-right"></span></button>
    </div>
    <PageBackgroundCanvas />
  </article>
</template>

<script lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted, watch } from 'vue';
import state, { addSocketConnectListener, disconnectGlobalSocket, initializeGlobalSocket } from './ts/networking/networking.client-websocket';
import { currentPageState, goToState, isChannelActive, openChannelOverlay, openProfile, pages, setupTransitionFunctions, showUserPageFromURL } from './ts/page/page.page-manager';
import LoginOverlay from './globalComponents/LoginOverlay.vue';
import PageBackgroundCanvas from './globalComponents/PageBackgroundCanvas.vue';
import InfoMessages from './globalComponents/InfoMessages.vue';
import Channel from './globalComponents/channel/Channel.vue';
import LoadingScreen from './pages/startmenu/components/LoadingScreen.vue';
import { PAGE_STATE } from './ts/page/e/page.e-page-state';
import { checkUserAuthentication, clearClientState, clearGuestCookies, logUserOut, showLoginForm } from './ts/networking/networking.auth';
import eventBus from './ts/page/page.event-bus';
import { attachInputReader } from './ts/input/input.input-reader';
import { httpClient } from './ts/networking/networking.http-client';
import { getDefaultProfilePbURL, getRankImagePath } from './ts/networking/paths';
import { applySavedSettings, enableBackInputs, enableChannelInput } from './ts/input/input.input-manager';
import { setupDebugListeners } from "./ts/game/network/game.network.debug";
import { RankInfo } from './ts/page/i/page.i-rank-info';
import { loadBackgroundCanvas } from './ts/page/page.background-canvas';
import { loadAudioFiles, playSound, playSoundtrack, stopSoundtrack } from './ts/asset/asset.howler-load';

interface InfoMessageComponent {
  showMessage: (message: string, type: string) => void;
}

interface InfoMessageData {
  message: string;
  type: 'info' | 'error' | 'success';
}

export default {
  name: 'App',
  components: { LoginOverlay, InfoMessages, Channel, LoadingScreen, PageBackgroundCanvas },
  setup() {
    attachInputReader();
    /* Channel */
    const isChannelOpen = isChannelActive();

    /* Message Component */
    const infoMessageRef = ref<InfoMessageComponent | null>(null);

    function showInfoMessage(message: string, type: string) {
      if (infoMessageRef.value) {
        infoMessageRef.value.showMessage(message, type);
      } else {
        console.error('InfoMessage component is not available');
      }
    }

    /* Login Component */
    const showLogin = computed(() => eventBus.state.showLogin);
    const errorMessage = ref<string>('');
    const isAuthenticated = ref<boolean>(false);

    function updateAuthenticatedState() {
      isAuthenticated.value = checkUserAuthentication();
    }

    /* Room Component */
    const roomId = ref<string>('');

    function handleJoinRoom(rId: string) {
      if (state.socket) {
        state.socket.emit('isUserInRoomAlready', { rId });
      }
    }

    function handleLeaveRoom() {
      roomId.value = '';
      goToState(PAGE_STATE.roomListing);
    }

    function getRoomIdFromHash() {
      return window.location.hash.substring(1);
    }

    function joinRoomFromHash() {
      const roomId = getRoomIdFromHash();
      if (roomId) {
        handleJoinRoom(roomId);
      }
    }

    function initOnIsUserInRoomAlready() {
      if (state.socket) {
        state.socket.on('isUserInRoomAlready', (isUserInRoomAlready: boolean, rId: string) => {
          if (!isUserInRoomAlready) {
            roomId.value = rId;
            goToState(PAGE_STATE.roomPage);
          } else {
            showInfoMessage('You are already in this room.', 'info');
          }
        });
      }
    }

    /* Page Components */
    const currentPageIndex = computed(() => pages.findIndex(p => p.pageState === currentPageState.value));
    const currentComponent = computed(() => {
      const index = currentPageIndex.value;
      return pages[index].component;
    });

    const isNavigatingForward = ref(true);

    const updateDirection = (direction: boolean) => {
      isNavigatingForward.value = direction;
    };

    watchEffect(() => {
      document.title = `${document.title.split('|')[0]} | ${pages[currentPageIndex.value].title}`;
    });

    watch(() => currentPageState.value, () => {
      onPageChange();
    });

    function onPageChange() {
      isAuthenticated.value = checkUserAuthentication();
    }

    const currentComponentKey = computed(() => {
      return currentPageIndex.value;
    });

    /* Profile */
    interface UserData {
      username: string;
      countryCode?: string;
      country?: string;
      pbUrl: string;
      rankInfos?: RankInfo;
      isRanked?: boolean;
      rating?: number;
      ratingDeviation?: number;
      percentile?: number;
    }

    const userData = ref<UserData | null>(null);

    watch(() => isAuthenticated.value, () => {
      updateProfileData();
      applySavedSettings();
    });

    async function updateProfileData() {
      if (isAuthenticated.value) {
        let isGuest = sessionStorage.getItem('isGuest');
        if (isGuest) {
          userData.value = {
            username: "Guest-" + (sessionStorage.getItem('guestUsername') || 'Guest'),
            pbUrl: getDefaultProfilePbURL(),
          };
        } else {
          const data = await fetchUserData();
          if (data) {
            let updatedPbUrl = getDefaultProfilePbURL();
            updatedPbUrl = data.pbUrl ? data.pbUrl : getDefaultProfilePbURL();
            console.log('updatedPbUrl', updatedPbUrl);
            userData.value = {
              ...data,
              pbUrl: updatedPbUrl,
            };
            console.log('userData', userData.value);
            console.log('data', data);
          }
        }
        eventBus.setUserData(userData.value);
      }
    }

    function showMyProfile() {
      let isGuest = sessionStorage.getItem('isGuest');
      if (isAuthenticated.value && !isGuest && userData.value && userData.value.username) {
        openProfile(userData.value.username);
      }
    }

    function getProgressBarFillWidth() {
      if (!userData?.value || !userData?.value.rankInfos || !userData?.value.rankInfos.prevRank || !userData?.value.rankInfos.nextRank || !userData?.value.percentile) {
        return '0%';
      }
      return (100 - (100 / (userData?.value.rankInfos.percentile - userData?.value.rankInfos.nextRank.percentile) * (userData?.value.percentile - userData?.value.rankInfos.nextRank.percentile))) + '%';
    }

    async function fetchUserData() {
      const token = localStorage.getItem('authToken');
      try {
        const response = await httpClient.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        logUserOut();
      }
      return;
    }

    /* Loading Screen */
    const isLoading = ref(true);

    function endLoading() {
      let minLoadingScreenShowTime = 1000;
      const loadingScreen = document.querySelector('.loading-screen');
      setTimeout(() => {
        loadingScreen?.classList.add('slide-out-LoadingScreen');
      }, minLoadingScreenShowTime - 500);
      setTimeout(() => {
        isLoading.value = false;
      }, minLoadingScreenShowTime);
    }

    async function waitForLoadingScreen() {
      await loadBackgroundCanvas();
      if (!userData.value) {
        await updateProfileData();
        await applySavedSettings();
      }
      await loadAudioFiles();
      //TODO add Promises for other loading tasks

      endLoading();
    }

    /* General */
    onMounted(async () => {
      addSocketConnectListener(setupDebugListeners);
      enableBackInputs();
      enableChannelInput();
      setupTransitionFunctions();
      initializeGlobalSocket();
      isAuthenticated.value = checkUserAuthentication();
      if (isAuthenticated.value) {
        joinRoomFromHash();
      } else {
        clearClientState();
        showLoginForm();
      }
      showUserPageFromURL();
      addSocketConnectListener(initOnIsUserInRoomAlready);
      await waitForLoadingScreen();
      playSoundtrack('menu_soundtrack');
      eventBus.on('navigationDirectionChanged', updateDirection);
      eventBus.on('show-info-message', (infoMessageData: InfoMessageData) => {
        showInfoMessage(infoMessageData.message, infoMessageData.type);
      });
      window.addEventListener('beforeunload', clearGuestCookies);
      window.addEventListener('beforeunload', stopSoundtrack);
    });

    onUnmounted(() => {
      disconnectGlobalSocket();
      window.removeEventListener('beforeunload', clearGuestCookies);
      eventBus.off('show-info-message');
      eventBus.off('navigationDirectionChanged');
      clearGuestCookies();
      stopSoundtrack();
    });

    return {
      showLogin,
      errorMessage,
      currentComponent,
      roomId,
      handleJoinRoom,
      handleLeaveRoom,
      logUserOut,
      infoMessageRef,
      isChannelOpen,
      openChannelOverlay,
      userData,
      isAuthenticated,
      updateProfileData,
      showMyProfile,
      currentComponentKey,
      isNavigatingForward,
      joinRoomFromHash,
      updateAuthenticatedState,
      getRankImagePath,
      getProgressBarFillWidth,
      isLoading,
      playSound,
    };
  },
}


</script>
<style scoped>
.topbar {
  width: 100vw;
  height: 5vh;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: black;
  position: relative;
}

.profile-wrapper {
  height: 100%;
  width: 20vw;
  background-color: black;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  height: 10vh;
  position: relative;
  z-index: 1;
}

.profile-wrapper::before {
  position: absolute;
  content: '';
  width: 0px;
  height: 1px;
  border-style: solid;
  border-width: 5vh 10vh 5vh 0;
  border-color: transparent black transparent transparent;
  display: inline-block;
  vertical-align: middle;
  right: 100%;
  top: 0;
}

.profile-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 30px 0 15px;
}

.profile-content .ratingDetails {
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  font-size: 20px;
  align-items: center;
}

.profile-content .progressBar {
  width: 90%;
  height: 4px;
  background-color: #575757;
  margin-top: 5px;
}

.profile-content .progressBar .progressBarFill {
  height: 100%;
  background-color: rgb(244, 205, 33);
}

.profile-content .rating span {
  font-size: 80%;
  opacity: 0.5;
}

.profile-content .ratingDetails .rank-img {
  margin-left: 5px;
  object-fit: contain;
  height: 25px;
}

.profile-content h3 {
  margin: unset;
  font-size: 20px;
}

.profile-content p {
  margin: unset;
}

.profile-pic {
  height: 100%;
  width: 10vh;
  object-fit: cover;
}

.openChannelButton {
  bottom: 0;
  z-index: 5;
}

.openChannelButton:hover {
  background-color: rgb(5, 5, 5);
}

.bottomBar {
  width: 100vw;
  height: 5vh;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: black;
}

/* Existing slide-left transitions */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.15s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  position: absolute;
  width: 100vw;
}

.slide-left-enter-from {
  transform: translateX(100vw);
}

.slide-left-enter-to,
.slide-left-leave-from {
  transform: translateX(0);
}

.slide-left-leave-to {
  transform: translateX(-100vw);
}

/* New slide-right transitions */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.15s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  position: absolute;
  width: 100vw;
}

.slide-right-enter-from {
  transform: translateX(-100vw);
}

.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}

.slide-right-leave-to {
  transform: translateX(93vw);
}

.slide-out-LoadingScreen {
  animation: slideOutLoadingScreen 0.5s forwards;
}

@keyframes slideOutLoadingScreen {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-100%);
  }
}
</style>