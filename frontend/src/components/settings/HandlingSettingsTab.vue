<template>
    <div class="tab-wrapper">
        <div class="settings-wrapper">
            <SliderSetting title="Lorem ipsum" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                :min="0" :max="100" :initialValue="50" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SliderSetting from '@/components/settings/SliderSetting.vue';

export default defineComponent({
    name: 'HandlingSettingsTab',
    components: { SliderSetting },
});
</script>