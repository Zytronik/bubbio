<template>
    <div class="tab-wrapper">
        <div class="settings-wrapper">
            <SliderSetting title="Music Volume" description="Adjust the volume of the music" :min="0" :max="100"
                :initialValue="musicVolume" :defaultValue="defaultMusicVolume * 100" @update:value="setMusicVolume" />
            <SliderSetting title="SFX Volume" description="Adjust the volume of the sound effects" :min="0" :max="100"
                :initialValue="sfxVolume" :defaultValue="defaultSfxVolume * 100" @update:value="setSfxVolume" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SliderSetting from '@/components/settings/SliderSetting.vue';
import { useSoundStore } from '@/stores/soundStore';

export default defineComponent({
    name: 'AudioSettingsTab',
    components: { SliderSetting },
    setup() {
        const soundStore = useSoundStore();
        const defaultMusicVolume = soundStore.defaultMusicVolume;
        const defaultSfxVolume = soundStore.defaultSfxVolume;
        const musicVolume = soundStore.musicVolume * 100;
        const sfxVolume = soundStore.sfxVolume * 100;

        function setMusicVolume(value: number) {
            soundStore.setMusicVolume(value / 100);
        }

        function setSfxVolume(value: number) {
            soundStore.setSfxVolume(value / 100);
        }

        return {
            musicVolume,
            sfxVolume,
            defaultMusicVolume,
            defaultSfxVolume,
            setMusicVolume,
            setSfxVolume,
        };
    },
});
</script>
