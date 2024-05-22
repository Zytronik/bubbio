<template>
    <div class="scrollable">
        <h2 @click="toggleInput">Input History</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Input</th>
                    <th>Angle</th>
                    <th>Frame Time</th>
                    <th>Garbage Amount</th>
                </tr>
            </thead>
            <tbody v-show="showInput">
                <tr v-for="input in inputHistory" :key="input.indexID" class="row">
                    <td>{{ input.indexID }}</td>
                    <td>{{ input.input }}</td>
                    <td>{{ input.angle }}</td>
                    <td>{{ input.frameTime }}</td>
                    <td>{{ input.garbageAmount }}</td>
                </tr>
            </tbody>
        </table>
        
        <h2 @click="toggleBoard">Board History</h2>
        <table>
            <thead>
                <tr>
                    <th>Frame Time</th>
                    <th>Board String</th>
                </tr>
            </thead>
            <tbody v-show="showBoard">
                <tr v-for="boardFrame in boardHistory" :key="boardFrame.indexID" class="row">
                    <td>{{ boardFrame.frameTime }}</td>
                    <td>{{ boardFrame.boardState }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import { playerGameInstance } from '@/ts/game/game.master';
    import { onMounted, ref } from 'vue';

    export default {
        name: 'NetworkEvaluation',
        setup() {
            const inputHistory = playerGameInstance.gameStateHistory.inputHistory;
            const boardHistory = playerGameInstance.gameStateHistory.boardHistory;
            const bubbleQueueHistory = playerGameInstance.gameStateHistory.bubbleQueueHistory;
            const angleHistory = playerGameInstance.gameStateHistory.angleHistory;
            const sentgarbagehistory = playerGameInstance.gameStateHistory.sentgarbagehistory;
            const receivedgarbagehistory = playerGameInstance.gameStateHistory.receivedgarbagehistory;
            const showInput = ref(true);
            const showBoard = ref(true);

            const toggleInput = () => {
                showInput.value = !showInput.value;
            };
            const toggleBoard = () => {
                showBoard.value = !showBoard.value;
            };

            onMounted(() => {
                console.log("getbackenddata")
                console.log(playerGameInstance.gameStateHistory)
                console.log(inputHistory)
            });

            return {
                inputHistory,
                boardHistory,
                bubbleQueueHistory,
                angleHistory,
                sentgarbagehistory,
                receivedgarbagehistory,
                toggleInput,
                toggleBoard,
                showInput,
                showBoard,
            }
        }
    };
</script>

<style scoped>
    table {
        width: 40%;
        border-collapse: collapse;

    }

    .row {
        border: 1px solid rgb(255, 255, 255);
    }

    .collapsed {
        display: none;
    }

    .scrollable {
        overflow: auto;
        height: 60vh;
    }
</style>
