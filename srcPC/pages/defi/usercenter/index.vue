<template>
    <div class="defi-user-center">
        <div class="overview__row">
            <div class="overview__col">
                <img src="~assets/imgs/deposit-icon.svg" alt="">
                <div>

                </div>
                <div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Pie from 'pcComponents/pie';
import { getUserAssets } from 'pcServices/defi';

export default {
    data() {
        return { userAssets: [] };
    },
    methods: {
        getUserAssets() {
            getUserAssets().then(data => {
                this.userAssets = data;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.overview__row {
    display: flex;
    flex-direction: row;
    padding: 15px 30px;
    height: 124px;
    box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
    width: 100%;
    @include bg_color_1();
}
</style>
