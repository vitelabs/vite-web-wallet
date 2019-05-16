<template>
    <div v-if="isShowGuide" class="beginner-guide">
        <div v-show="guideStep === 1">1
            <div @click="close">close</div>
            <div @click="next">next</div>
        </div>
        <div v-show="guideStep === 2">2
            <div @click="close">close</div>
            <div @click="next">next</div>
        </div>
        <div v-show="guideStep === 3">3
            <div @click="close">close</div>
            <div @click="next">next</div>
        </div>
        <div v-show="guideStep === 4">4
            <div @click="close">close</div>
            <div @click="next">next</div>
        </div>
    </div>
</template>

<script>
import storage from 'utils/store';

const GuideKey = 'beginnerGuide';

export default {
    data() {
        const isShowGuide = !storage.getItem(GuideKey);

        return {
            isShowGuide,
            guideStep: 1
        };
    },
    methods: {
        next() {
            this.guideStep++;
            if (this.guideStep > 4) {
                this.close();
            }
        },
        close() {
            this.isShowGuide = false;
            storage.setItem(GuideKey, 1);
        }
    }
};
</script>

<style lang="scss">
.beginner-guide {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}
</style>
