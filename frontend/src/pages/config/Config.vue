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
            <h2>Handling Settings</h2>
            <div class="handling-settings">
              <div class="handling-setting setting">
                <div class="desc" :title="DEFAULT_APS.description">
                  <h3>{{ DEFAULT_APS.name }}</h3>
                </div>
                <div class="keys">
                  <div @click="resetSlider('defaultAPS', $event.currentTarget)" class="resetColumn">
                    <span>Reset</span>
                  </div>
                  <div class="slidecontainer">
                    <input v-model="defaultApsValue" @change="updateDefaultAPS" type="range" :min="DEFAULT_APS.min" :max="DEFAULT_APS.max" class="slider" id="defaultApsRange">
                    <p>Value: <span>{{ defaultApsValue }}</span></p>
                  </div>
                </div>
              </div>
              <div class="handling-setting setting">
                <div class="desc" :title="TOGGLE_APS.description">
                  <h3>{{ TOGGLE_APS.name }}</h3>
                </div>
                <div class="keys">
                  <div @click="resetSlider('toggleAPS', $event.currentTarget)" class="resetColumn">
                    <span>Reset</span>
                  </div>
                  <div class="slidecontainer">
                    <input v-model="toggleApsValue" @change="updateToggleAPS" type="range" :min="TOGGLE_APS.min" :max="TOGGLE_APS.max" class="slider" id="toggleApsRange">
                    <p>Value: <span>{{ toggleApsValue }}</span></p>
                  </div>
                </div>
              </div>
            </div>
            <h2>Input Settings</h2>
            <div class="input-settings" v-if="allInputs && allInputs.length > 0">
              <div v-for="(input, index) in allInputs" :key="index" class="input-setting setting">
                <div class="desc" :title="input.description">
                  <h3 :title="input.description">{{ input.name }}</h3>
                </div>
                <div class="keys">
                  <div @click="resetInput(input, $event.currentTarget)" class="resetColumn">
                    <span>Reset</span>
                  </div>
                  <div v-if="input.customKeyMap" class="customKeys">
                    <div v-for="(key, keyIndex) in input.customKeyMap" :key="`key-${keyIndex}`"
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
          <div class="tab-wrapper">
            <h2>Audio Settings</h2>
            <div class="audio-settings">
              <div class="audio-setting setting">
                <div class="desc" :title="MUSIC_VOLUME.description">
                  <h3>{{ MUSIC_VOLUME.name }}</h3>
                </div>
                <div class="keys">
                  <div @click="resetMusicVolume" class="resetColumn">
                    <span>Reset</span>
                  </div>
                  <div class="slidecontainer">
                    <input v-model="musicVolumeValue" @input="updateMusicVolume" @change="updateMusicVolume" type="range" :min="MUSIC_VOLUME.min" :max="MUSIC_VOLUME.max" step="0.01" class="slider" id="musicVolumeRange">
                    <p>Value: <span>{{ Math.round(musicVolumeValue * 100) }}%</span></p>
                  </div>
                </div>
              </div>
              <div class="audio-setting setting">
                <div class="desc" :title="SFX_VOLUME.description">
                  <h3>{{ SFX_VOLUME.name }}</h3>
                </div>
                <div class="keys">
                  <div @click="resetSfxVolume" class="resetColumn">
                    <span>Reset</span>
                  </div>
                  <div class="slidecontainer">
                    <input v-model="sfxVolumeValue" @input="updateSfxVolume" @change="updateSfxVolume" type="range" :min="SFX_VOLUME.min" :max="SFX_VOLUME.max" step="0.01" class="slider" id="sfxVolumeRange">
                    <p>Value: <span>{{ Math.round(sfxVolumeValue * 100) }}%</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
import { Ref, SetupContext, computed, ref } from 'vue';
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { httpClient } from '@/ts/networking/networking.http-client';
import { checkUserAuthentication, logUserOut } from '@/ts/networking/networking.auth';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';
import { saveSettings } from '@/ts/input/input.input-manager';
import eventBus from '@/ts/page/page.event-bus';
import { allInputs } from '@/ts/input/input.all-inputs';
import { Input } from '@/ts/input/i/input.i.input';
import { DEFAULT_APS, TOGGLE_APS } from '@/ts/game/settings/ref/game.settings.ref.all-handling-settings';
import { MUSIC_VOLUME, SFX_VOLUME, resetMusicVolume, resetSfxVolume, setMusicVolume, setSfxVolume } from '@/ts/asset/asset.howler-load';
import { goToState } from '@/ts/page/page.page-manager';

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
      { pageState: PAGE_STATE.multiMenu, iconSrc: require('@/img/icons/multi.png'), disabled: true },
      { pageState: PAGE_STATE.soloMenu, iconSrc: require('@/img/icons/solo.png'), disabled: true },
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
          allInputs[inputIndex].customKeyMap[keyIndex] = inputEvent.code;
          saveSettings();
        }
      }

      window.addEventListener('keydown', captureInput);
    }


    function handleResetCustomKey(event: MouseEvent, keyIndex: number, input: Input) {
      event.preventDefault();
      // Find the corresponding input configuration in allInputs
      const inputIndex = allInputs.findIndex(item => item === input);
      if (inputIndex !== -1 && allInputs[inputIndex].customKeyMap && Array.isArray(allInputs[inputIndex].customKeyMap)) {
        // Set the custom key code to an empty string
        allInputs[inputIndex].customKeyMap[keyIndex] = "";
        saveSettings();

        // Update text to "Not Set"
        const clickedDiv = event.currentTarget as HTMLElement;
        const paragraphElement = clickedDiv ? clickedDiv.querySelector('p') : null;
        if (paragraphElement) {
          paragraphElement.innerText = 'Not Set';
        }
      }
    }

    async function handleFileChange(fileType: string, event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) {
        eventBus.emit('show-info-message', { message: 'No file selected.', type: 'info' });
        return;
      }
      const file = input.files[0];

      if (file.size > 2 * 1024 * 1024) {
        eventBus.emit('show-info-message', { message: 'File size should not exceed 2MB.', type: 'info' });
        return;
      }

      if (!file.type.match(/^(image\/jpeg|image\/png)$/)) {
        eventBus.emit('show-info-message', { message: 'Invalid file type. Only JPEG and PNG are allowed.', type: 'info' });
        return;
      }

      selectedFile.value = file;

      await uploadImage(fileType);
    }

    function resetInput(input: Input, e: EventTarget | null): void {
      const element = e as HTMLElement;
      const customKeyElems = element.parentElement?.querySelector('.customKeys')?.querySelectorAll('p');
      if (customKeyElems) {
        customKeyElems.forEach(p => p.innerText = 'Not Set');
        customKeyElems[0].innerText = input.defaultKeyCode;
      }
      input.customKeyMap[0] = input.defaultKeyCode;
      input.customKeyMap[1] = "";
      input.customKeyMap[2] = "";
      saveSettings();
    }

    async function uploadImage(fileType: string) {
      if (!selectedFile.value) {
        eventBus.emit('show-info-message', { message: 'No file selected.', type: 'info' });
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
        eventBus.emit('show-info-message', { message: 'Image uploaded successfully.', type: 'success' });
      } catch (error) {
        eventBus.emit('show-info-message', { message: 'Failed to upload image.', type: 'error' });
      }
    }

    function logOut() {
      goToState(PAGE_STATE.mainMenu);
      logUserOut();
    }

    const defaultApsValue = computed({
      get() {
        return DEFAULT_APS.refNumber.value;
      },
      set(newValue) {
        DEFAULT_APS.refNumber.value = newValue;
      },
    });

    const toggleApsValue = computed({
      get() {
        return TOGGLE_APS.refNumber.value;
      },
      set(newValue) {
        TOGGLE_APS.refNumber.value = newValue;
      },
    });

    const musicVolumeValue = computed({
      get() {
        return MUSIC_VOLUME.refNumber.value;
      },
      set(newValue) {
        MUSIC_VOLUME.refNumber.value = newValue;
      },
    });

    const sfxVolumeValue = computed({
      get() {
        return SFX_VOLUME.refNumber.value;
      },
      set(newValue) {
        SFX_VOLUME.refNumber.value = newValue;
      },
    });

    function updateDefaultAPS(){
      const sliderEle = document.getElementById('defaultApsRange') as HTMLInputElement;
      const sliderValueEle = sliderEle.nextElementSibling?.querySelector('span');
      if (!sliderValueEle) return;
      sliderValueEle.innerText = sliderEle.value;
      DEFAULT_APS.refNumber.value = parseInt(sliderEle.value);
      saveSettings();
    }

    function updateToggleAPS(){
      const sliderEle = document.getElementById('toggleApsRange') as HTMLInputElement;
      const sliderValueEle = sliderEle.nextElementSibling?.querySelector('span');
      if (!sliderValueEle) return;
      sliderValueEle.innerText = sliderEle.value;
      TOGGLE_APS.refNumber.value = parseInt(sliderEle.value);
      saveSettings();
    }

    function updateMusicVolume(){
      const sliderEle = document.getElementById('musicVolumeRange') as HTMLInputElement;
      const sliderValueEle = sliderEle.nextElementSibling?.querySelector('span');
      if (!sliderValueEle) return;
      const floatValue = parseFloat(sliderEle.value);
      sliderValueEle.innerText = Math.round(floatValue * 100).toString() + "%";
      setMusicVolume(floatValue);      
      saveSettings();
    }

    function updateSfxVolume(){
      const sliderEle = document.getElementById('sfxVolumeRange') as HTMLInputElement;
      const sliderValueEle = sliderEle.nextElementSibling?.querySelector('span');
      if (!sliderValueEle) return;
      const floatValue = parseFloat(sliderEle.value);
      sliderValueEle.innerText = Math.round(floatValue * 100).toString() + "%";
      setSfxVolume(floatValue);
      saveSettings();
    }

    function resetSlider(sliderType: string, e: EventTarget | null){
      const element = e as HTMLElement;
      const sliderEle = element.nextElementSibling?.querySelector('input') as HTMLInputElement;
      const sliderValueEle = sliderEle.nextElementSibling?.querySelector('span');
      if (!sliderValueEle) return;
      sliderEle.value = sliderType === 'defaultAPS' ? DEFAULT_APS.defaultValue.toString() : TOGGLE_APS.defaultValue.toString();
      sliderValueEle.innerText = sliderEle.value;
    }

    return {
      PAGE_STATE,
      goToState,
      handleFileChange,
      isLoggedIn,
      logUserOut,
      logOut,
      isAuthenticated,
      backButtonData,
      allInputs,
      handleCustomKey,
      handleResetCustomKey,
      resetInput,
      DEFAULT_APS,
      TOGGLE_APS,
      updateDefaultAPS,
      updateToggleAPS,
      resetSlider,
      defaultApsValue,
      toggleApsValue,
      MUSIC_VOLUME,
      SFX_VOLUME,
      musicVolumeValue,
      sfxVolumeValue,
      updateMusicVolume,
      updateSfxVolume,
      setSfxVolume,
      setMusicVolume,
      resetMusicVolume,
      resetSfxVolume,
    }
  }
}
</script>

<style scoped>
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

.input-setting,
.handling-setting,
.audio-setting {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.input-setting .desc,
.handling-setting .desc,
.audio-setting .desc {
  width: 30%;
  position: relative;
}

.input-setting .keys,
.handling-setting .keys,
.audio-setting .keys {
  width: 70%;
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.input-setting .keys,
.handling-setting .keys,
.audio-setting .keys{
  display: flex;
  flex-direction: row;
}

.input-setting .resetColumn,
.handling-setting .resetColumn,
.handling-setting .keys .slidecontainer > p,
.handling-setting .desc,
.audio-setting .resetColumn,
.audio-setting .keys .slidecontainer > p,
.audio-setting .desc,
.input-setting .desc,
.input-setting .customKeys>div {
  background-color: rgb(53, 53, 53);
  height: 40px;
  padding: 0 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-setting .resetColumn,
.handling-setting .resetColumn,
.audio-setting .resetColumn {
  background-color: rgb(53, 53, 53);
  transition: 200ms;
  cursor: pointer;
}

.input-setting .resetColumn:hover
.handling-setting .resetColumn:hover,
.audio-setting .resetColumn:hover{
  background-color: rgb(73, 73, 73);
}

.input-setting .desc,
.handling-setting .desc,
.audio-setting .desc {
  justify-content: flex-start;
}

.input-setting .keys .resetColumn,
.handling-setting .keys .resetColumn,
.audio-setting .keys .resetColumn {
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

.handling-setting .keys .slidecontainer>p,
.audio-setting .keys .slidecontainer>p {
  width: 10%;
  background-color: unset;
}

.handling-setting .keys .slidecontainer>p>span,
.audio-setting .keys .slidecontainer>p>span {
  min-width: 50%;
  margin-left: 10px;
}

.input-setting .customKeys>div:hover {
  background-color: rgb(63, 63, 63);
}

.input-setting h3,
.handling-setting h3,
.audio-setting h3 {
  margin-bottom: unset;
}

.input-setting:first-of-type .keys .customKeys>div::before,
.input-setting:first-of-type .keys .resetColumn::before {
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

.input-setting .keys .customKeys,
.handling-setting .keys .slidecontainer,
.audio-setting .keys .slidecontainer {
  width: 85%;
  display: flex;
  flex-direction: row;
  align-items: center;
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

.slidecontainer {
  width: 100%;
  gap: 15px;
  flex-direction: row-reverse !important;
}

.slider {
  width: 90%;
  height: 15px;
  border-radius: 10px;
  background: rgb(53, 53, 53);
  outline: none;
  transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: var(--config-color);
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: var(--config-color);
  cursor: pointer;
}
</style>