<template>
    <div class="setting button-setting">
        <div class="text">
            <h3>{{ title }}</h3>
            <p class="dsc">{{ description }}</p>
        </div>
        <div class="keys">
            <button class="actionBtn secondary" @click="triggerAction">{{ buttonText }}</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ButtonSetting',
    props: {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        buttonText: {
            type: String,
            required: true,
        },
    },
    methods: {
        triggerAction() {
            console.log('Button action triggered');
        },
    },
});
</script>

<style scoped>
.keys {
    justify-content: flex-end;
}
</style>