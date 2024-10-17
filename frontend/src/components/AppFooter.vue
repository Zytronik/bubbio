<template>
  <div class="bottomBar">
    <button class="openChannelButton">Community</button>
    <svg width="964" height="200" viewBox="0 0 964 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M862 0H102L0 100L102 200H862L964 100L862 0Z" fill="black" />
    </svg>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AppFooter',
  components: {},
  setup() {

    return {
    };
  },
};
</script>

<style scoped>
.bottomBar {
  position: absolute;
  width: 100vw;
  height: calc(var(--header-height) / 2);
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.bottomBar::after {
  content: "";
  position: absolute;
  width: 100vw;
  height: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: black;
  z-index: 0;
}

.openChannelButton:hover {
  background-color: rgb(4, 4, 4);
}

svg {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: var(--header-height);
}

.openChannelButton {
  position: absolute;
  background-color: transparent;
  bottom: 0;
  z-index: 1;
  font-size: 2em;
  left: 50%;
  transform: translateX(-50%);
  outline: none;
  border: none;
  height: var(--header-height);
  width: var(--header-profile-width);
  cursor: pointer;
  transition: 200ms;
  text-transform: uppercase;
  color: white;
  margin-top: unset;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
