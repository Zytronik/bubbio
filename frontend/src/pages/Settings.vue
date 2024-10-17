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
        <ButtonSetting title="Lorem ipsum" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          buttonText="Lorem Ipsum" :action="() => { }" />
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
import { logUserOut } from '@/ts/network/auth';

export default defineComponent({
  name: 'SettingsPage',
  components: {
    KeySetting,
    SliderSetting,
    ButtonSetting,
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
  width: 40%;
}

.settings .keys {
  width: 60%;
  display: flex;
  align-items: center;
}

.settings-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
