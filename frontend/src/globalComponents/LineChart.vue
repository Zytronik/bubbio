<template>
  <div class="chartContainer">
    <div class="chartWrapper">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, ref } from 'vue';
import Chart, { ChartConfiguration, ChartData } from 'chart.js/auto';
import { formatTimeNumberToStringSec } from '@/ts/page/page.page-utils';

export default defineComponent({
  name: 'LineChart',
  props: {
    data: {
      type: Array as PropType<number[]>,
      required: true,
    },
  },
  setup(props) {
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    const chartInstance = ref<unknown>(null);

    onMounted(() => {
      if (chartCanvas.value) {
        const labels = Array.from({ length: props.data.length }, (_, i) => i.toString());

        const data = {
          labels: labels,
          datasets: [
            {
              label: 'Cubic interpolation',
              data: props.data,
              borderColor: 'rgb(255, 255, 255)',
              fill: false,
              tension: 0.4,
            },
          ],
        };

        const config: ChartConfiguration<'line'> = {
          type: 'line',
          data: data as ChartData<'line', (number | null)[], string>,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${Math.round(context.parsed.y * 100) / 100} BPS`;
                  },
                  title: function () {
                    return '';
                  },
                  footer: function () {
                    return '';
                  },
                },
                displayColors: false,
              },
            },
            interaction: {
              intersect: false,
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.2)',
                },
                display: true,
                title: {
                  display: true,
                  text: "Time (m:s)",
                },
                ticks: {
                  color: 'white',
                  callback: function (val) {
                    return formatTimeNumberToStringSec(parseInt(val.toString()) * 1000);
                  },
                },
              },
              y: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.2)',
                },
                display: true,
                title: {
                  display: true,
                  text: 'BPS',
                },
                ticks: {
                  color: 'white',
                },
                suggestedMin: 0,
              },
            },
          },
        };

        chartInstance.value = new Chart(chartCanvas.value, config as ChartConfiguration<'line'>);
      }
    });

    return {
      chartCanvas,
    };
  },
});
</script>

<style scoped>
.chartContainer {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: center;
  margin-bottom: 15px
}

.chartWrapper {
  width: 100%;
  height: 100%;
}

.chartContainer canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
