<template>
    <div class="tab-wrapper">
        <div class="settings-wrapper">
            <KeySetting v-for="(input, index) in allInputs" :key="input.name" :inputIndex="index" :title="input.name"
                :description="input.description" :customKeys="input.customKeyMap" :defaultKey="input.defaultKeyCode" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import KeySetting from '@/components/settings/KeySetting.vue';
import { allInputs } from '@/ts/input/allInputs';

export default defineComponent({
    name: 'InputSettingsTab',
    components: { KeySetting },
    setup() {
        return {
            allInputs,
        };
    },
});
</script>
