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
                <input type="range" :min="min" :max="max" v-model="value" class="slider" @input="updateValue" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

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
        initialValue: {
            type: Number,
            default: 50,
        },
    },
    setup(props) {
        const value = ref(props.initialValue);

        function resetSlider() {
            value.value = props.initialValue;
        }

        function updateValue() {
            console.log('Slider value:', value.value);
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