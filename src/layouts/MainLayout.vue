<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Mortgage Calculator
        </q-toolbar-title>

        
      </q-toolbar>
    </q-header>

    <div class="calculatorInput-container">
     
      <div class="wrapper" >
        <div class="sliderWrapper">
          <q-badge color="secondary">
            purchase price: ${{ PurchasePrice }}
          </q-badge>
          <q-slider
            v-model="PurchasePrice"
            :min="50000"
            :max="1000000"
            :step="50000"
          />
        </div>


        <div class="sliderWrapper">
          <q-badge color="secondary">
            down payment: ${{DownPayment }}
          </q-badge>
          <q-slider
            v-model="DownPayment"
            :min="1000"
            :max="1000000"
            :step="1000"
          />
        </div>

        <div class="sliderWrapper">
          <q-badge color="secondary">
            repayment Year: {{repaymentTime }} years
          </q-badge>
          <q-slider
            v-model="repaymentTime"
            :min="5"
            :max="25"
            :step="1"
          />
        </div>

        <div class="sliderWrapper">
          <q-badge >
            interest Rate : {{interestRate }}%
          </q-badge>
          <q-slider
            v-model="interestRate"
            :min="2"
            :max="11"
            :step="1"
          />
        </div>

        <div class="sliderWrapper">
          <q-input disable v-model="loanAmount" label="loan amount" :dense="dense" />
        </div>

        <div class="sliderWrapper">
          <q-input disable v-model="paymentPerMonth" label="estimated per month" :dense="dense" />
        </div>

        <div class="button-wrapper">
          <q-btn @click="storeHistory" color="indigo" no-caps>
            save
          </q-btn>
        </div>
      </div>
    </div>


    <!-- show calculation list history -->
    <div class="calculatorInput-container-historylist">
      <h5>calculation list history</h5>
      <div class="wrapper-list" v-for="historylist in calculationHistorys.historyArray" :key="historylist">
        purchasePrice: {{ historylist.purchasePrice }}<br>
        downPayment: {{ historylist.downPayment}}<br>
        repaymentTime: {{ historylist.repaymentTime }}<br>
        interestRate: {{ historylist.interestRate }}<br>
        loanAmount:{{ historylist.loanAmount }}<br>
        monthlyPayment: {{ historylist.monthlyPayment }}<br>
      </div>
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, ref, watch } from 'vue'
import { CalculationHistory } from 'src/stores/HistoryOfCalculation';

const calculationHistorys= CalculationHistory();
let historylistArray;



const PurchasePrice = ref(50000);
const DownPayment = ref(1000);
const repaymentTime = ref(5);
const interestRate = ref(2);
const loanAmount = ref();
const paymentPerMonth = ref();
let calculatedLoanAmount ;
let monthlyPayment;

function calculateLoan() {
  calculatedLoanAmount= PurchasePrice.value - DownPayment.value;
  const monthlyRate = interestRate.value / 100 / 12;
  const totalPayments = repaymentTime.value * 12;
  const numerator = calculatedLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments);
  const denominator = Math.pow(1 + monthlyRate, totalPayments) - 1;
  monthlyPayment = (numerator / denominator).toFixed(2);

  loanAmount.value = calculatedLoanAmount.toFixed(2);
  paymentPerMonth.value = monthlyPayment;

}

function storeHistory(){
// Storing calculation results in state management pinia
const content={
  purchasePrice: PurchasePrice.value,
  downPayment: DownPayment.value,
  repaymentTime: repaymentTime.value,
  interestRate: interestRate.value,
  loanAmount: calculatedLoanAmount.toFixed(2),
  monthlyPayment: monthlyPayment
}
calculationHistorys.appendHistoryObject(content);
historylistArray= calculationHistorys.getHistoryOfCalculation;
console.log(historylistArray)
}


watch([PurchasePrice, DownPayment, repaymentTime, interestRate ], () => {
  calculateLoan();
});

// Initial calculation
calculateLoan();



</script>

<style scoped>
.calculatorInput-container{
 display: flex;
 justify-content: center;
  margin-top: 150px;
  padding: 10px;
  /* background: gray; */
}

.wrapper{
  display:flex;
  /* margin: auto; */
  justify-content: space-between;
  flex-wrap: wrap;
  width: 40vw;
  padding: 30px;
  border-radius: 10px;
  background: rgb(220, 219, 219);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.sliderWrapper{
  width: 30%;
  margin-bottom: 20px;
}

.button-wrapper{
  display: inline-block;
  margin-left: 10px;
  margin-top: 20px;
}

.calculatorInput-container-historylist{
  display: flex;
  flex-direction: column;
 justify-content: center;
  margin-top: 150px;
  padding: 10px;
  align-items: center;
}

.wrapper-list{
  display:flex;
  /* margin: auto; */
  justify-content: space-between;
  flex-wrap: wrap;
  width: 40vw;
  padding: 30px;
  border-radius: 10px;
  background: rgb(220, 219, 219);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}
</style>