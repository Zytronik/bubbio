<template>
  <div class="chartContainer">
    <div class="chartWrapper">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import Chart, { ChartConfiguration, ChartData } from 'chart.js/auto';

export default defineComponent({
  name: 'LineChart',
  setup() {
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    const chartInstance = ref<unknown>(null);

    onMounted(() => {
      if (chartCanvas.value) {
        const datapoints = [0, 20, 20, 60.00, 60.12, 120.67, 90, 180, 120, 125, 105, 110, 170];
        const labels = Array.from({ length: datapoints.length }, (_, i) => i.toString());

        const data = {
          labels: labels,
          datasets: [
            {
              label: 'Cubic interpolation',
              data: datapoints,
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
              /*  tooltip: {
                 enabled: false
               }, */
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
                  text: "Time (s)",
                },
                ticks: {
                  color: 'white',
                  callback: function(val) {
                    return val + "s";
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
  width: 90%;
  height: 100%;
}

.chartContainer canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
