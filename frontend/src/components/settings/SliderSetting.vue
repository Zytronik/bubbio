<template>
    <div class="setting slider-setting">
        <div class="text">
            <h3>{{ title }}</h3>
            <p class="dsc">{{ description }}</p>
        </div>
        <div class="keys">
            <button class="resetBtn secondary" @click="resetSlider">Reset</button>
            <div class="sliderWrapper">
                <label>Value: {{ value }}</label>
                <input type="range" :min="min" :max="max" v-model="value" step="1" class="slider"
                    @input="updateValue" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
    name: 'SliderSetting',
    props: {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 100,
        },
        defaultValue: {
            type: Number,
            default: 50,
        },
        initialValue: {
            type: Number,
            default: 50,
        },
    },
    emits: ['update:value'],
    setup(props, { emit }) {
        const value = ref(props.initialValue);

        function updateValue() {
            emit('update:value', value.value);
        }

        watch(value, updateValue);

        function resetSlider() {
            value.value = props.defaultValue;
            updateValue();
        }

        return {
            value,
            resetSlider,
            updateValue,
        };
    },
});
</script>


<style scoped>
.sliderWrapper {
    display: flex;
    align-items: center;
    flex-grow: 1;
}

label {
    margin-right: 15px;
}
</style>