<template>
  <div v-if="showPatchNotes" class="overlay patchNotes">
    <div class="overlay-container">
      <p>Patch Notes</p>
      <div class="patchNote">
        <h2>{{ latestPatchNote.version }}</h2>
        <p>{{ latestPatchNote.date }}</p>
        <div v-for="(section, sectionIndex) in latestPatchNote.sections" :key="sectionIndex" class="patchNote-section">
          <h3>{{ section.title }}</h3>
          <p v-if="section.desc">{{ section.desc }}</p>
          <ul v-if="section.entries && section.entries.length">
            <li v-for="(entry, entryIndex) in section.entries" :key="entryIndex">
              {{ entry }}
            </li>
          </ul>
        </div>
      </div>
      <button class="primary" @click="close()">Got it!</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { patchNotes } from '@/ts/_constant/patchNotes';

export default {
  name: 'PatchNotes',
  setup() {
    const showPatchNotes = ref(false);
    const latestPatchNote = patchNotes[0];

    const lastSeenVersion = localStorage.getItem('lastSeenPatchNoteVersion');

    onMounted(() => {
      if (!lastSeenVersion || lastSeenVersion !== latestPatchNote.version) {
        showPatchNotes.value = true;
      }
    });

    function close() {
      showPatchNotes.value = false;
      localStorage.setItem('lastSeenPatchNoteVersion', latestPatchNote.version);
    }

    return {
      showPatchNotes,
      latestPatchNote,
      close,
    };
  },
};
</script>

<style scoped>
h2 {
  margin-top: 5px;
}

.patchNote-section {
  margin-top: 15px;
}

.patchNote-section h3 {
  display: flex;
  align-items: center;
  text-wrap: nowrap;
  color: rgb(244, 205, 33);
}

.patchNote-section h3::after {
  content: "";
  background-color: rgb(244, 205, 33);
  display: flex;
  width: 100%;
  height: 2px;
  margin-left: 5%;
}
</style>
