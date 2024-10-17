<template>
    <div class="setting key-setting">
        <div class="text">
            <h3>{{ title }}</h3>
            <p class="dsc">{{ description }}</p>
        </div>
        <div class="keys">
            <button class="resetBtn secondary" @click="resetKeys">Reset</button>
            <div class="customKeys">
                <button v-for="(key, index) in keys" :key="index" class="keyBtn secondary">
                    {{ key }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'KeySetting',
    props: {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        keys: {
            type: Array as PropType<string[]>,
            required: true,
        },
    },
    methods: {
        resetKeys() {
            console.log('Reset keys');
        },
    },
});
</script>

<style scoped>
.customKeys button {
    flex-grow: 1;
}

.customKeys {
    flex-grow: 1;
    display: flex;
    gap: 15px;
}
</style>