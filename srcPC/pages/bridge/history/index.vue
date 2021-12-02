<template>
  <wallet-table
    :headList="headList"
    :contentList="contentList"
    class="bridge-history-table"
  ></wallet-table>
</template>

<script>
import walletTable from "pcComponents/table/index.vue";
import { getTxs } from "pcServices/conversion";
import d from "dayjs";

export default {
  props: [],
  components: { walletTable },
  mounted() {
    const address = this.$store.state.wallet.currHDAcc?.activeAddr;
    getTxs({ fromAddress: address, fromNet: "VITE" }).then((data) => {
      (data || []).forEach((item) => {
        item["status"] = item.toHash ? "success" : "pending";
        item["time"] = d.unix(item["time"]).format("YYYY-MM-DD HH:mm");
      });
      this.contentList = data;
    });
  },
  data() {
    return {
      headList: [
        {
          text: "Token",
          cell: "token",
          class: "bridge-history-item--token",
        },
        {
          text: "Time",
          cell: "time",
          class: "bridge-history-item--time",
        },
        {
          text: "Amount",
          cell: "amount",
          class: "bridge-history-item--amount",
        },
        {
          text: "Status",
          cell: "status",
          class: "bridge-history-item--status",
        },
        {
          text: "From",
          cell: "fromAddress",
          class: "bridge-history-item--address",
        },
        {
          text: "To",
          cell: "toAddress",
          class: "bridge-history-item--address",
        },
        {
          text: "Fee",
          cell: "fee",
          class: "bridge-history-item--fee",
        },
      ],
      contentList: [],
    };
  },
};
</script>
