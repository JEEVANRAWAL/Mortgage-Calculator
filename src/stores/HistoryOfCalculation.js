import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const CalculationHistory = defineStore('calculationHistory', () => {
    const historyArray=ref([]);

    const getHistoryOfCalculation = computed(() => historyArray.value);


  function appendHistoryObject(content){
           
    historyArray.value.push(content)
    // console.log(content);
  }

  return { historyArray, appendHistoryObject, getHistoryOfCalculation}
})
