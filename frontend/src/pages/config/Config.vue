<template>
  <section id="config" class="page">
    <h1>Config</h1>
    <button @click="goToState(PAGE_STATE.mainMenu)">Go to Menu</button>
    <h2>Input Settings</h2>
    <h2>Game Settings</h2>
    <label></label>
    <input type="range" v-model="allGameSettings.gridWidth.refValue" v-min="allGameSettings.gridWidth.min" v-max="allGameSettings.gridWidth.max" step="1">
    <h2>Accounts Settings</h2>
    <p>Change Profile Picture (TODO)</p>
    <input type="file" @change="handleFileChange" accept="image/png, image/jpeg" />
    <button @click="uploadImage">Upload Image</button>
    <button @click="goToState(PAGE_STATE.mainMenu)">Go to Menu</button>
  </section>
</template>

<script lang="ts">
import { goToState } from '@/ts/page/page.page-manager';
import { Ref, onMounted, ref } from 'vue';
import { PAGE_STATE } from '@/ts/page/page.e-page-state';
import { allGameSettings } from '@/ts/settings/settings.game';

export default {
  name: 'ConfigPage',
  setup() {
    const selectedFile: Ref<File | null> = ref(null);

    onMounted(() => {
      console.log('Vue app mounted | Config Page');
    });

    function handleFileChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) {
        alert('No file selected');
        return;
      }
      const file = input.files[0];

      // Check file size (e.g., max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should not exceed 2MB');
        return;
      }

      selectedFile.value = file;
    }

    async function uploadImage() {
      if (!selectedFile.value) {
        alert('No file selected');
        return;
      }

      const formData = new FormData();
      formData.append('profilePic', selectedFile.value);

      try {
        //await httpClient.post('/api/user/updateProfilePic', formData);
        alert('Image uploaded successfully');
      } catch (error) {
        console.error('Failed to upload image', error);
        alert('Failed to upload image');
      }
    }

    return {
      PAGE_STATE,
      goToState,
      handleFileChange,
      uploadImage,
      allGameSettings,
    }
  }
}
</script>

<style></style>
