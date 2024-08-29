<template>
  <div class="history-wrapper">
    <div v-if="loading" class="loader"></div>
    <div v-if="historyData.length > 0" class="history">
      <div class="head">
        <div class="row">
          <div class="cell" v-for="field in orderedFields" :key="field"
            @click="updateSort(field)">
            {{ getFullName(field) }}
            <span v-if="sortByVal === field">
              <span v-if="sortDirectionVal === 'asc'"><i class="fa-solid fa-caret-up"></i></span>
              <span v-else><i class="fa-solid fa-caret-down"></i></span>
            </span>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="row" v-for="(entry, index) in historyData" :key="index" :data-id="entry.id">
          <div class="cell" v-for="field in orderedFields" :key="field">
            {{ formatFieldValue(entry[field], field) }}
          </div>
        </div>
      </div>
    </div>
    <p class="no-entries" v-if="historyData.length <= 0 && !loading">No history data available.</p>
  </div>
</template>

<script lang="ts">
import { GameStats } from '@/ts/game/i/game.i.game-stats';
import { httpClient } from '@/ts/networking/networking.http-client';
import { GameMode, SortDirection } from '@/ts/page/e/page.e-leaderboard';
import { formatFieldValue, getFullName } from '@/ts/page/i/page.i.stat-display';
import eventBus from '@/ts/page/page.event-bus';
import { PropType, defineComponent, onMounted, onUnmounted, ref, watchEffect } from 'vue';

interface HistoryEntry extends GameStats {
  userId: number;
  submittedAt: string;
  // eslint-disable-next-line
  [key: string]: any;
}

export default defineComponent({
  name: 'HistoryComponent',
  props: {
    gameMode: {
      type: String as PropType<GameMode>,
      required: true,
      validator: (value: string): boolean => Object.values(GameMode).includes(value as GameMode),
    },
    fields: {
      type: Array as PropType<string[]>,
      required: true,
    },
    sortBy: {
      type: String,
      required: true,
    },
    sortDirection: {
      type: String,
      required: false,
      validator: (value: string): boolean => Object.values(SortDirection).includes(value as SortDirection),
      default: SortDirection.Desc,
    },
    limit: {
      type: Number,
      default: 20,
    },
  },
  setup(props) {
    const loading = ref(true);
    const historyData = ref<HistoryEntry[]>([]);
    const sortByVal = ref(props.sortBy);
    const sortDirectionVal = ref(props.sortDirection);
    const orderedFields = ref<string[]>([]);

    async function updateSort(newSortBy: string) {
      let newSortDirection = sortDirectionVal.value === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc;
      if (sortByVal.value !== newSortBy) {
        newSortDirection = SortDirection.Asc;
      }
      sortByVal.value = newSortBy;
      sortDirectionVal.value = newSortDirection;
      await fetchHistoryData();
    }

    async function fetchHistoryData() {
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const response = await httpClient.get("/" + props.gameMode + "/history", {
          params: {
            sortBy: sortByVal.value,
            sortDirection: sortDirectionVal.value,
            limit: props.limit,
          },
          headers: headers
        });

        historyData.value = response.data;
        loading.value = false;
      } catch (error) {
        console.error("Failed to fetch History data: ", error);
        loading.value = false;
      }
    }

    function sortAndFilterFields() {
      const fieldsWithoutSortBy = props.fields.filter(field => field !== props.sortBy);
      orderedFields.value = [props.sortBy, ...fieldsWithoutSortBy];
    }

    onMounted(async () => {
      await fetchHistoryData();
      sortAndFilterFields();
      setupHistoryClickEvents();
    });

    onUnmounted(() => {
      removeHistoryClickEvents();
    });

    watchEffect(() => {
      fetchHistoryData();
    });

    function setupHistoryClickEvents() {
      // eslint-disable-next-line
      const historyRecords = document.querySelectorAll('.history .row') as NodeListOf<HTMLElement>;
      historyRecords.forEach((record) => {
        const handleClick = () => {
          eventBus.emit('historyRecordClicked', record.dataset.id);
        };
        record.addEventListener('click', handleClick);
        record.dataset.clickHandler = handleClick.toString();
      });
    }

    function removeHistoryClickEvents() {
      // eslint-disable-next-line
      const historyRecords = document.querySelectorAll('.history .row') as NodeListOf<HTMLElement>;
      historyRecords.forEach((record) => {
        const handleClick = new Function(`return ${record.dataset.clickHandler}`)();
        record.removeEventListener('click', handleClick);
        delete record.dataset.clickHandler;
      });
    }

    return {
      loading,
      orderedFields,
      historyData,
      getFullName,
      formatFieldValue,
      updateSort,
      sortByVal,
      sortDirectionVal,
    };
  },
});
</script>

<style scoped>
.history {
  width: 100%;
  height: 100%;
}

.head .cell {
  cursor: pointer;
}

.head {
  background-color: rgba(149, 149, 149, 0.3);
  font-size: 70%;
}

p {
  margin: unset;
}

.row {
  display: flex;
  flex-direction: row;
  text-align: center;
  padding: 0 15px;
  cursor: pointer;
  transition: 0.2s;
}

.row:hover {
  background-color: rgba(149, 149, 149, 0.1);
}

.cell {
  flex: 1;
  padding: 15px 0px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  font-size: 1.5em;
  text-transform: uppercase;
  font-weight: bold;
}

.cell span i {
  margin-left: 10px;
  font-size: 180%;
}

.row .cell:first-of-type {
  justify-content: flex-start;
  padding-left: 15px;
}

.history {
  width: 100%;
}

.history-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
}

</style>
@/ts/interface/game.i.game-stats@/ts/interface/page.i.stat-display@/ts/constant/page.e-leaderboard@/ts/network/networking.http-client