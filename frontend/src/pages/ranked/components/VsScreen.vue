<template>
  <div class="vs-screen">
    <div class="diagonal-wrapper left">
      <img class="transition" :src="transitionImagePath">
      <div class="profile">
        <div class="name">
          <p>{{ versusScreenData.player1Data.playerName.toUpperCase() }}</p>
          <img class="rank-img" :src="getRankImagePath(versusScreenData.player1Data.playerRank)" :alt="versusScreenData.player1Data.playerRank">
        </div>
        <p class="elo">Elo: {{ versusScreenData.player1Data.playerGlicko }}<span>±{{
        versusScreenData.player1Data.playerRD }}</span></p>
        <p>Ranks: #{{ versusScreenData.player1Data.playerNationalRank }}, #{{
        versusScreenData.player1Data.playerGlobalRank }}</p>
        <p>Country: {{ versusScreenData.player1Data.playerCountry }}</p>
      </div>
      <img class="profilePic" :src="versusScreenData.player1Data.playerProfilePicture ? versusScreenData.player1Data.playerProfilePicture : getDefaultProfilePbURL()">
    </div>
    <div class="diagonal">
      <div class="vs-wrapper">
        <p class="vsText">VS</p>
      </div>
    </div>
    <div class="diagonal-wrapper right">
      <img class="transition" :src="transitionImagePath">
      <div class="profile">
        <div class="name">
          <img class="rank-img" :src="getRankImagePath(versusScreenData.player2Data.playerRank)" :alt="versusScreenData.player2Data.playerRank">
          <p>{{ versusScreenData.player2Data.playerName.toUpperCase() }}</p>
        </div>
        <p class="elo">Elo: {{ versusScreenData.player2Data.playerGlicko }}<span>±{{
        versusScreenData.player2Data.playerRD }}</span></p>
        <p>Ranks: #{{ versusScreenData.player2Data.playerNationalRank }}, #{{
        versusScreenData.player2Data.playerGlobalRank }}</p>
        <p>Country: {{ versusScreenData.player2Data.playerCountry }}</p>
      </div>
      <img class="profilePic" :src="versusScreenData.player2Data.playerProfilePicture ? versusScreenData.player2Data.playerProfilePicture : getDefaultProfilePbURL()">
    </div>
  </div>
</template>

<script lang="ts">
import { I_RANKED_SCREEN_TRANSITION_CONFIRMATION, versusScreenData } from '@/ts/game/network/game.network.ranked';
import state from '@/ts/networking/networking.client-websocket';
import { getDefaultProfilePbURL, getRankImagePath } from '@/ts/networking/paths';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'VsScreen',
  data() {
    return {
      transitionImagePath: require('@/img/vs/transition_re.png'),
    };
  },
  setup() {
    function playVsAnimation(onTransitionEnd: () => void) {
      const container = document.querySelector('#vue') as HTMLElement;
      const blackOverlay = document.createElement('div');

      slideOutToBlack(container, blackOverlay, () => {
        hideTopBottomAndSideBar();
        showVSComponent();
        removeBlackOverlay(container, blackOverlay);
        showWhiteFlash();
      });

      setTimeout(() => {
        animateImageTransitionIn();
      }, 500 + 500); // slideOutToBlack 500ms

      setTimeout(() => {
        slideInProfileInfo();
      }, 500 + 500 + 600); 

      setTimeout(() => {
        slideOutProfileInfo();
      }, 5000);

      setTimeout(() => {
        animateImageTransitionOut();
      }, 5000 + 500);

      setTimeout(() => {
        fadeOutVsText();
      }, 5000 + 500 + 500);

      setTimeout(() => {
        onTransitionEnd();
        fadeOutVSScreen();
      }, 5000 + 500 + 500 + 500);
    }

    function fadeOutVSScreen() {
      const vsScreen = document.querySelector('.vs-screen') as HTMLElement;
      if (vsScreen) {
        vsScreen.style.opacity = '0';
      }
    }

    function fadeOutVsText() {
      const vsText = document.querySelector('.vsText') as HTMLElement;
      if (vsText) {
        vsText.style.opacity = '0';
      }
    }

    function slideInProfileInfo() {
      const leftProfileChildren = document.querySelector('.diagonal-wrapper.left .profile')?.children;
      if (leftProfileChildren) {
        Array.from(leftProfileChildren).forEach((child, index) => {
          if (child instanceof HTMLElement) {
            setTimeout(() => {
              child.style.transform = 'translateX(0)';
            }, index * 100);
          }
        });
      }

      const rightProfileChildren = document.querySelector('.diagonal-wrapper.right .profile')?.children;
      if (rightProfileChildren) {
        Array.from(rightProfileChildren).forEach((child, index) => {
          if (child instanceof HTMLElement) {
            setTimeout(() => {
              child.style.transform = 'translateX(0)';
            }, index * 100);
          }
        });
      }
    }

    function slideOutProfileInfo() {
      const leftProfileChildren = document.querySelector('.diagonal-wrapper.left .profile')?.children;
      if (leftProfileChildren) {
        Array.from(leftProfileChildren).forEach((child, index) => {
          if (child instanceof HTMLElement) {
            setTimeout(() => {
              child.style.transform = 'translateX(-130%)';
            }, index * 100);
          }
        });
      }

      const rightProfileChildren = document.querySelector('.diagonal-wrapper.right .profile')?.children;
      if (rightProfileChildren) {
        Array.from(rightProfileChildren).forEach((child, index) => {
          if (child instanceof HTMLElement) {
            setTimeout(() => {
              child.style.transform = 'translateX(130%)';
            }, index * 100);
          }
        });
      }
    }

    

    function animateImageTransitionIn() {
      const imagLeft = document.querySelector('.diagonal-wrapper.left .transition') as HTMLElement;
      const imagRight = document.querySelector('.diagonal-wrapper.right .transition') as HTMLElement;
      if (imagLeft && imagRight) {
        imagLeft.style.objectPosition = '100% -50%';
        imagRight.style.objectPosition = '100% 150%';
      }
    }

    function animateImageTransitionOut() {
      const imagLeft = document.querySelector('.diagonal-wrapper.left .transition') as HTMLElement;
      const imagRight = document.querySelector('.diagonal-wrapper.right .transition') as HTMLElement;
      if (imagLeft && imagRight) {
        imagLeft.style.objectPosition = '100% 50%';
        imagRight.style.objectPosition = '100% 50%';
      }
    }

    function hideTopBottomAndSideBar() {
      document.body.classList.add('game-view');
    }

    function showVSComponent() {
      const vsScreen = document.querySelector('.vs-screen') as HTMLElement;
      vsScreen.style.display = 'flex';
    }

    function slideOutToBlack(container: HTMLElement, blackOverlay: HTMLElement, onTransitionEnd: () => void) {
      container.classList.add('slide-out-vs-left-to-black');
      blackOverlay.className = 'black-overlay-right';
      container.appendChild(blackOverlay);
      setTimeout(() => {
        onTransitionEnd();
      }, 500); //css duration
    }

    function removeBlackOverlay(container: HTMLElement, blackOverlay: HTMLElement) {
      blackOverlay.classList.add('black-overlay-cover');
      blackOverlay.classList.remove('black-overlay-right');
      container.classList.remove('slide-out-vs-left-to-black');
      container.classList.add('game-view');
      setTimeout(() => {
        container.removeChild(blackOverlay);
        //onTransitionEnd();
      }, 1000);//css duration
    }

    function showWhiteFlash() {
      const flash = document.createElement('div');
      const vsScreen = document.querySelector('.vs-screen') as HTMLElement;
      const diagonal = document.querySelector('.diagonal') as HTMLElement;
      flash.className = 'white-flash';
      vsScreen.appendChild(flash);
      flash.style.opacity = '1';
      diagonal.style.backgroundColor = 'white';
      setTimeout(() => {
        flash.style.opacity = '0';
        diagonal.style.backgroundColor = 'black';
        setTimeout(() => {
          vsScreen.removeChild(flash);
        }, 500);//css duration
      }, 1000); //flash length

      flash.style.transition = 'opacity 500ms ease-out';
    }

    onMounted(() => {
      playVsAnimation(() => {
        if(state.socket && versusScreenData){
          state.socket.emit(I_RANKED_SCREEN_TRANSITION_CONFIRMATION, versusScreenData.matchID);
        }
      });
    });

    return {
      versusScreenData,
      getRankImagePath,
      getDefaultProfilePbURL,
    };
  },
});
</script>

<style scoped>
.vs-screen {
  z-index: 1;
  display: none;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
}

.diagonal {
  width: 40%;
  height: 200%;
  transform: rotate(13deg);
  background-color: black;
  z-index: 4;
  transition: 0.4s;
}

.diagonal-wrapper {
  width: 36%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
}

.diagonal-wrapper .transition {
  width: 130%;
  height: 120%;
  object-fit: cover;
  position: absolute;
  z-index: 3;
  transform: rotate(13deg);
  top: -11%;
  left: -14%;
  transition: object-position 1s ease;
}

.diagonal-wrapper.left .transition {
  object-position: 100% 150%;
}

.diagonal-wrapper.right .transition {
  object-position: 100% -50%;
}

.diagonal-wrapper.left {
  left: 0;
}

.diagonal-wrapper.right {
  right: 0;
}

.diagonal-wrapper .profilePic {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.diagonal-wrapper::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0.4;
  background-color: black;
}

.vs-wrapper {
  font-size: 13em;
  color: white;
  z-index: 5;
  position: absolute;
  top: 48%;
  left: 50%;
  transform: rotate(-13deg) translate(-50%, -50%);
}

.vsText {
  transition: opacity 0.5s;
  animation: shakeX 0.6s infinite;
}

.profile {
  position: absolute;
  z-index: 5;
  color: white;
  width: 125%;
}

.left .profile > * {
  transform: translateX(-130%);
  transition: transform 0.3s;
}

.right .profile > * {
  transform: translateX(130%);
  transition: transform 0.3s;
}

.profile .name img {
  height: 4vw;
}

.profile .name {
  position: relative;
  margin-bottom: 4%;
  display: flex;
  gap: 3%;
}

.profile .name p {
  display: flex;
  align-items: center;
  font-size: 3.1em;
  margin-bottom: unset;
}

.left .profile .name {
  justify-content: flex-end;
}

.right .profile .name {
  justify-content: flex-start;
}

.profile .name:after {
  content: "";
  position: absolute;
  bottom: -8%;
  left: 50%;
  width: 100%;
  height: 0;
  border-top: 4px solid rgb(255, 255, 255);
  transform: translateX(-50%);
}

.left .profile .name:after {
  border-right: 20vw solid transparent;
}

.right .profile .name:after {
  border-left: 20vw solid transparent;
}

.profile p {
  margin-bottom: 10px;
  font-size: 2.2em;
}

.profile p span {
  font-size: 50%;
  opacity: 0.5;
}

.left .profile {
  left: 0;
  text-align: right;
  bottom: 5%;
}

.right .profile {
  top: 5%;
  right: 0;
}

p {
  margin: unset;
}


@keyframes shakeX {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }

  10% {
    transform: translate(1px, -2px) rotate(-1deg);
  }

  20% {
    transform: translate(3px, 0px) rotate(1deg);
  }

  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }

  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }

  50% {
    transform: translate(1px, 2px) rotate(-1deg);
  }

  60% {
    transform: translate(3px, 1px) rotate(0deg);
  }

  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }

  80% {
    transform: translate(1px, -1px) rotate(1deg);
  }

  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }

  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>