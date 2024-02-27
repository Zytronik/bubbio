<template>
  <section id="config" class="page">
    <h1>Config</h1>
    <h2>Input Settings</h2>
    <h2>Game Settings</h2>
    <span>{{ allGameSettings.gridWidth.name }}: {{ allGameSettings.gridWidth.refValue }}</span>
    <br>
    <input type="range" v-model="allGameSettings.gridWidth.refValue" :min="allGameSettings.gridWidth.min"
      :max="allGameSettings.gridWidth.max" step="1">
    <br>
    <div v-if="isAuthenticated">
      <h2>Accounts Settings</h2>
      <button @click="logOut">Log Out</button>
      <div v-if="isLoggedIn">
        <div class="account-setting">
          <h3>Change Profile Picture:</h3>
          <p>The img must be less then 2MB and in jpg or png format.</p>
          <button>
            <label for="pb-upload" class="custom-file-upload">Change Picture</label>
          </button>
          <input id="pb-upload" type="file" @change="handleFileChange('pb', $event)" accept="image/png, image/jpeg"
            style="display: none;" />
        </div>
        <div class="account-setting">
          <h3>Change Profile Banner:</h3>
          <p>We recommend the following img dimensions: 1920px x 170px</p>
          <button>
            <label for="banner-upload" class="custom-file-upload">Change Banner</label>
          </button>
          <input id="banner-upload" type="file" @change="handleFileChange('banner', $event)"
            accept="image/png, image/jpeg" style="display: none;" />
        </div>
      </div>
    </div>
    <MenuBackButtons :buttonData="backButtonData" />
  </section>
</template>

<script lang="ts">
import { goToState } from '@/ts/page/page.page-manager';
import { Ref, SetupContext, computed, onMounted, ref } from 'vue';
import { PAGE_STATE } from '@/ts/page/page.e-page-state';
import { allGameSettings } from '@/ts/game/settings/game.settings.game';
import { httpClient } from '@/ts/networking/networking.http-client';
import { checkUserAuthentication, logUserOut } from '@/ts/networking/networking.auth';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';

export default {
  name: 'ConfigPage',
  components: { MenuBackButtons },
  setup(_: unknown, { emit }: SetupContext) {
    const selectedFile: Ref<File | null> = ref(null);
    const isAuthenticated = computed(() => checkUserAuthentication());
    const isLoggedIn = computed(() => checkUserAuthentication() && !sessionStorage.getItem('isGuest'));
    const backButtonData = ref([
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/solo.png') },
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/multi.png') },
      { pageState: PAGE_STATE.mainMenu, iconSrc: require('@/img/icons/config.png') },
    ]);

    onMounted(() => {
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
    }
  }
}
</script>

<style scoped>
.account-setting {
  margin: 30px 0;
}

.account-setting p {
  margin: unset;
}
</style>
