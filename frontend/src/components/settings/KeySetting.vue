<template>
    <div class="setting key-setting" :data-input-index="inputIndex">
        <div class="text">
            <h3>{{ title }}</h3>
            <p class="dsc">{{ description }}</p>
        </div>
        <div class="keys">
            <button class="resetBtn secondary" @click="resetKeys(inputIndex)">Reset</button>
            <div class="customKeys">
                <button v-for="(key, index) in customKeys" :key="index" class="keyBtn secondary"
                    @click="changeKey(index, inputIndex)">
                    {{ key || "Not Set" }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { allInputs } from '@/ts/input/allInputs';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'KeySetting',
    props: {
        inputIndex: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        customKeys: {
            type: Array as PropType<string[]>,
            required: true,
        },
        defaultKey: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            isSettingKey: false,
            currentKeyIndex: -1,
            currentInputIndex: -1,
        };
    },
    methods: {
        resetKeys(inputIndex: number) {
            const defaultKeyCode = allInputs[inputIndex].defaultKeyCode;
            allInputs[inputIndex].customKeyMap = [defaultKeyCode, "", ""];
            this.resetKeysMarkup(inputIndex);
        },
        resetKeysMarkup(inputIndex: number) {
            const keyBtns = document.querySelectorAll(".key-setting[data-input-index='" + inputIndex + "'] .keyBtn");
            keyBtns.forEach((btn, index) => {
                btn.textContent = index === 0 ? allInputs[inputIndex].defaultKeyCode : "Not Set";
            });
        },
        changeKey(index: number, inputIndex: number) {
            this.isSettingKey = true;
            this.currentInputIndex = inputIndex;
            this.currentKeyIndex = index;
            this.showPressAnyKeyMarkupText();
            window.addEventListener("keydown", this.handleKeydown);
        },
        showPressAnyKeyMarkupText() {
            const keyBtns = document.querySelectorAll(".key-setting[data-input-index='" + this.currentInputIndex + "'] .keyBtn");
            keyBtns[this.currentKeyIndex].textContent = "Press any key";
        },
        handleKeydown(event: KeyboardEvent) {
            if (this.isSettingKey) {
                const newKeys = [...this.customKeys];
                newKeys[this.currentKeyIndex] = event.code;
                this.updateCustomKeyMarkup(event.code);
                this.updateCustomKeys(newKeys);
                this.isSettingKey = false;
                window.removeEventListener("keydown", this.handleKeydown);
            }
        },
        updateCustomKeyMarkup(keyCode: string) {
            const keyBtns = document.querySelectorAll(".key-setting[data-input-index='" + this.currentInputIndex + "'] .keyBtn");
            keyBtns[this.currentKeyIndex].textContent = keyCode;

        },
        updateCustomKeys(newKeys: string[]) {
            allInputs[this.currentInputIndex].customKeyMap = newKeys;
        },
    },
});
</script>

<style scoped>
.customKeys button {
    width: calc(100% / 3);
}

.customKeys {
    flex-grow: 1;
    display: flex;
    gap: 15px;
}
</style>
