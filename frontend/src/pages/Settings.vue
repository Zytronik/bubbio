<template>
  <div class="tabs">
    <button v-for="tab in tabs" :key="tab" :class="{ active: currentTab === tab }" @click="currentTab = tab">
      {{ tab }}
    </button>
  </div>
  <div v-if="currentTab === 'Input Settings'" class="tab-content input-tab">
    <div class="tab-wrapper">
      <h2>Input Settings</h2>
      <div class="input-settings settings-wrapper">
        <KeySetting title="Lorem ipsum" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          :keys="['A', 'B', 'C']" />
        <SliderSetting title="Lorem ipsum" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          :min="0" :max="100" :initialValue="50" />
      </div>
    </div>
  </div>
  <div v-if="currentTab === 'Handling Settings'" class="tab-content input-tab">
    <div class="tab-wrapper">
      <h2>Handling Settings</h2>
    </div>
  </div>
  <div v-if="currentTab === 'Graphics Settings'" class="tab-content input-tab">
    <div class="tab-wrapper">
      <h2>Graphics Settings</h2>
    </div>
  </div>
  <div v-if="currentTab === 'Audio Settings'" class="tab-content input-tab">
    <div class="tab-wrapper">
      <h2>Audio Settings</h2>
    </div>
  </div>
  <div v-if="currentTab === 'Account Settings'" class="tab-content input-tab">
    <div class="tab-wrapper">
      <h2>Account Settings</h2>
      <div class="account-settings settings-wrapper">
        <FileUploadSetting title="Change Profile Picture"
          description="The img must be less then 2MB and in jpg or png format." buttonText="Upload"
          :uploadFileType=UploadFileType.ProfilePicture />
        <FileUploadSetting title="Change Profile Banner"
          description="We recommend the following img dimensions: 1920px x 170px" buttonText="Upload"
          :uploadFileType=UploadFileType.ProfileBanner />
        <ButtonSetting title="Log out of Account" description="Logs the User out of the Account" buttonText="Log out"
          :action="logUserOut" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import KeySetting from '@/components/settings/KeySetting.vue';
import SliderSetting from '@/components/settings/SliderSetting.vue';
import ButtonSetting from '@/components/settings/ButtonSetting.vue';
import FileUploadSetting from '@/components/settings/FileUploadSetting.vue';
import { logUserOut } from '@/ts/network/auth';
import { UploadFileType } from '@/ts/_enum/uploadFileType';

export default defineComponent({
  name: 'SettingsPage',
  components: {
    KeySetting,
    SliderSetting,
    ButtonSetting,
    FileUploadSetting,
  },
  data() {
    return {
      currentTab: 'Input Settings',
      tabs: ['Input Settings', 'Handling Settings', 'Graphics Settings', 'Audio Settings', 'Account Settings'],
    };
  },
  setup() {
    return {
      logUserOut,
      UploadFileType,
    };
  },
});
</script>

<style>
.settings .resetBtn {
  width: 200px;
  margin-right: 30px;
}

.settings .setting {
  display: flex;
  width: 100%;
  background-color: var(--light-bg-color);
  padding: 10px;
}

.settings .text {
  width: 45%;
}

.settings .keys {
  width: 55%;
  display: flex;
  align-items: center;
}

.settings-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
