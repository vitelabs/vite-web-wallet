<template>
  <wallet-table :headList=""></wallet-table>
</template>

<script>
import walletTable from "pcComponents/table/index.vue";
export default {
  components: { walletTable },
  data() {
    return {
      headList: [
        {
          text: "Token",
          cell: "tokenSymbol",
          class: "keystore-table-item",
        },
        {
          text: "Time",
          cell: "time",
          class: "keystore-table-item",
        },
        {
          text: "Amount",
          cell: "amount",
          class: "keystore-table-item",
        },
        {
          text: "Status",
          cell: "status",
          class: "keystore-table-item",
        },
        {
          text: "From",
          cell: "fromAddress",
          class: "keystore-table-item",
        },
        {
          text: "To",
          cell: "toAddress",
          class: "keystore-table-item",
        },
        {
          text: "Fee",
          cell: "fee",
          class: "keystore-table-item",
        },
      ],
    };
  },
};
</script>
