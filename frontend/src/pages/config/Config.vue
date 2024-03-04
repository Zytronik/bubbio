<template>
  <section id="config" class="page">
    <MenuBackButtons :buttonData="backButtonData" />
    <div class="page-wrapper">
      <div class="page-container">
        <div class="tabs">
          <button v-for="tab in tabs" :key="tab" :class="{ active: currentTab === tab }" @click="currentTab = tab">
            {{ tab }}
          </button>
        </div>
        <div v-if="currentTab === 'Input Settings'" class="tab-content input-tab">
          <div class="tab-wrapper">
            <h2>Input Settings</h2>
            <div class="input-settings" v-if="allInputs && allInputs.length > 0">
              <div v-for="(input, index) in allInputs" :key="index" class="input-setting setting">
                <div class="desc" :title="input.description">
                  <h3 :title="input.description">{{ input.name }}</h3>
                </div>
                <div class="keys">
                  <div class="defaultKey">
                    <p>{{ input.defaultKeyCode }}</p>
                  </div>
                  <div v-if="input.customKeyMap.map" class="customKeys">
                    <div v-for="(key, keyIndex) in input.customKeyMap.map" :key="`key-${keyIndex}`"
                      @click="handleCustomKey($event, keyIndex, index)"
                      @contextmenu.prevent="handleResetCustomKey($event, keyIndex, input)">
                      <p>{{ key || 'Not Set' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p>Press Right-Click to unbind.</p>
          </div>
        </div>
        <div v-if="currentTab === 'Graphics Settings'" class="tab-content graphics-tab">
          <div class="tab-wrapper"></div>
        </div>
        <div v-if="currentTab === 'Audio Settings'" class="tab-content audio-tab">
          <div class="tab-wrapper"></div>
        </div>
        <div v-if="isAuthenticated && currentTab === 'Account Settings'" class="tab-content account-tab">
          <div class="tab-wrapper">
            <h2>Accounts Settings</h2>
            <div v-if="isLoggedIn" class="account-settings">
              <div class="account-setting setting">
                <div>
                  <h3>Change Profile Picture</h3>
                  <p>The img must be less then 2MB and in jpg or png format.</p>
                </div>
                <button>
                  <label for="pb-upload" class="custom-file-upload">Upload</label>
                </button>
                <input id="pb-upload" type="file" @change="handleFileChange('pb', $event)"
                  accept="image/png, image/jpeg" style="display: none;" />
              </div>
              <div class="account-setting setting">
                <div>
                  <h3>Change Profile Banner</h3>
                  <p>We recommend the following img dimensions: 1920px x 170px</p>
                </div>
                <button>
                  <label for="banner-upload" class="custom-file-upload">Upload</label>
                </button>
                <input id="banner-upload" type="file" @change="handleFileChange('banner', $event)"
                  accept="image/png, image/jpeg" style="display: none;" />
              </div>
            </div>
            <div class="account-setting setting">
              <div>
                <h3>LogOut of Account</h3>
                <p>Logs the User out of the Account</p>
              </div>
              <button class="logOutBtn" @click="logOut">Log Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { changeBackgroundTo, goToState } from '@/ts/page/page.page-manager';
import { Ref, SetupContext, computed, onMounted, ref } from 'vue';
import { PAGE_STATE } from '@/ts/page/page.e-page-state';
import { allGameSettings } from '@/ts/game/settings/game.settings.game';
import { httpClient } from '@/ts/networking/networking.http-client';
import { checkUserAuthentication, logUserOut } from '@/ts/networking/networking.auth';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';
import { allInputs } from '@/ts/input/input.possible-inputs';
import { Input } from '@/ts/input/input.i-input';
import { saveInputs } from '@/ts/input/input.input-manager';

export default {
  name: 'ConfigPage',
  components: { MenuBackButtons },
  data() {
    return {
      currentTab: 'Input Settings',
      tabs: ['Input Settings', 'Graphics Settings', 'Audio Settings', 'Account Settings'],
    };
  },
  setup(_: unknown, { emit }: SetupContext) {
    const selectedFile: Ref<File | null> = ref(null);
    const isAuthenticated = computed(() => checkUserAuthentication());
    const isLoggedIn = computed(() => checkUserAuthentication() && !sessionStorage.getItem('isGuest'));
    const backButtonData = ref([
      { pageState: PAGE_STATE.soloMenu, iconSrc: require('@/img/icons/solo.png'), disabled: true },
      { pageState: PAGE_STATE.multiMenu, iconSrc: require('@/img/icons/multi.png'), disabled: true },
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/config.png'), disabled: false },
    ]);

    function handleCustomKey(event: MouseEvent, keyIndex: number, inputIndex: number) {
      const clickedDiv = event.currentTarget as HTMLElement;
      if (!clickedDiv) return;
      const paragraphElement = clickedDiv.querySelector('p');
      if (!paragraphElement) return;
      paragraphElement.innerText = 'Press a key...';

      function captureInput(inputEvent: KeyboardEvent) {
        window.removeEventListener('keydown', captureInput);
        if (paragraphElement) {
          paragraphElement.innerText = inputEvent.code;
          allInputs[inputIndex].customKeyMap.map[keyIndex] = inputEvent.code;
          console.log(allInputs, inputIndex, keyIndex, allInputs[inputIndex]);
          saveInputs();
        }
      }

      window.addEventListener('keydown', captureInput);
    }


    function handleResetCustomKey(event: MouseEvent, keyIndex: number, input: Input) {
      event.preventDefault();
      // Find the corresponding input configuration in allInputs
      const inputIndex = allInputs.findIndex(item => item === input);
      if (inputIndex !== -1 && allInputs[inputIndex].customKeyMap && Array.isArray(allInputs[inputIndex].customKeyMap.map)) {
        // Set the custom key code to an empty string
        allInputs[inputIndex].customKeyMap.map[keyIndex] = "";
        saveInputs();

        // Update text to "Not Set"
        const clickedDiv = event.currentTarget as HTMLElement;
        const paragraphElement = clickedDiv ? clickedDiv.querySelector('p') : null;
        if (paragraphElement) {
          paragraphElement.innerText = 'Not Set';
        }
      }
    }


    onMounted(() => {
      changeBackgroundTo('linear-gradient(45deg, rgba(69,51,59,1) 0%, rgba(24,193,169,1) 100%)');
      console.log('Vue app mounted | Config Page');
    });

    async function handleFileChange(fileType: string, event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) {
        emit('showInfoMessage', 'No file selected.', 'info');
        return;
      }
      const file = input.files[0];

      if (file.size > 2 * 1024 * 1024) {
        emit('showInfoMessage', 'File size should not exceed 2MB.', 'info');
        return;
      }

      if (!file.type.match(/^(image\/jpeg|image\/png)$/)) {
        emit('showInfoMessage', 'Invalid file type. Only JPEG and PNG are allowed.', 'info');
        return;
      }

      selectedFile.value = file;

      await uploadImage(fileType);
    }

    async function uploadImage(fileType: string) {
      if (!selectedFile.value) {
        emit('showInfoMessage', 'No file selected.', 'info');
        alert('No file selected');
        return;
      }

      const formData = new FormData();
      const formDataKey = fileType === 'pb' ? 'profilePic' : 'profileBanner';
      formData.append(formDataKey, selectedFile.value);

      try {
        const token = localStorage.getItem('authToken');
        const url = fileType === 'pb' ? 'users/updateProfilePic' : 'users/updateProfileBanner';
        await httpClient.post(url, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        emit('updateProfileData');
        emit('showInfoMessage', 'Image uploaded successfully.', 'success');
      } catch (error) {
        emit('showInfoMessage', 'Failed to upload image.', 'error');
      }
    }

    function logOut() {
      goToState(PAGE_STATE.mainMenu);
      logUserOut();
    }

    return {
      PAGE_STATE,
      goToState,
      handleFileChange,
      isLoggedIn,
      logUserOut,
      logOut,
      isAuthenticated,
      allGameSettings,
      backButtonData,
      changeBackgroundTo,
      allInputs,
      handleCustomKey,
      handleResetCustomKey,
    }
  }
}
</script>

<style scoped>
.back-buttons::before {
  background: linear-gradient(45deg, rgba(181, 43, 221, 1) 0%, rgba(198, 63, 63, 1) 100%);
}

.setting {
  margin: 5px 0;
}

.setting button,
button.logOutBtn {
  height: 40px;
  width: 20%;
  font-size: 20px;
  background-color: rgb(30, 30, 30);
  border: none;
  outline: none;
  border-radius: 0;
  color: white;
  cursor: pointer;
  transition: 300ms;
}

button.logOutBtn {
  padding: 0 15px;
}

.setting button>label {
  cursor: pointer;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
}

.setting button:hover,
button.logOutBtn:hover {
  background-color: rgb(40, 40, 40);
}

.account-setting {
  display: flex;
  flex-direction: row;
  background-color: rgb(53, 53, 53);
  padding: 10px 15px;
  justify-content: space-between;
  align-items: center;
}

.setting p {
  margin: unset;
}

.input-setting {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.input-setting .desc {
  width: 30%;
  position: relative;
}

.input-setting .keys {
  width: 70%;
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.input-setting .keys {
  display: flex;
  flex-direction: row;
}

.input-setting .defaultKey,
.input-setting .desc,
.input-setting .customKeys>div {
  background-color: rgb(53, 53, 53);
  height: 40px;
  padding: 0 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-setting .desc {
  justify-content: flex-start;
}

.input-setting .keys .defaultKey {
  width: 15%;
  position: relative;
  opacity: 0.7;
}

.input-setting .customKeys>div {
  width: 33.33333%;
  position: relative;
  cursor: pointer;
  transition: 300ms;
}

.input-setting .customKeys>div:hover {
  background-color: rgb(63, 63, 63);
}

.input-setting h3 {
  margin-bottom: unset;
}

.input-setting:first-of-type .keys .defaultKey::before {
  content: "Default";
}

.input-setting:first-of-type .keys .customKeys>div::before,
.input-setting:first-of-type .keys .defaultKey::before {
  position: absolute;
  bottom: calc(100% + 15px);
}

.input-setting:first-of-type .keys .customKeys>div:first-of-type::before {
  content: "Custom 1";
}

.input-setting:first-of-type .keys .customKeys>div:nth-of-type(2)::before {
  content: "Custom 2";
}

.input-setting:first-of-type .keys .customKeys>div:nth-of-type(3)::before {
  content: "Custom 3";
}

.input-setting .keys .customKeys {
  width: 85%;
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.tab-content {
  padding: 15px 15px;
  background-color: rgb(30, 30, 30);
  flex-grow: 1;
}

.tabs button {
  padding: 10px;
  border: none;
  background-color: rgb(30, 30, 30);
  cursor: pointer;
  margin-right: 15px;
  opacity: 0.4;
  color: white;
  font-size: 20px;
  z-index: 1;
  position: relative;
}

.tabs button.active {
  background-color: rgb(30, 30, 30);
  opacity: 1;
}
</style>
