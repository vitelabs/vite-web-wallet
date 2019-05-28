<template>
    <div class="pie">
        <svg class="pie__graph">
            <slot name="colorMap">
                <defs>
                    <linearGradient
                        id="pie_linear0"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stop-color="#19B4FD" />
                        <stop offset="100%" stop-color="#007AFF" />
                    </linearGradient>
                    <linearGradient
                        id="pie_linear1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stop-color="#66D6CA" />
                        <stop offset="100%" stop-color="#0ACDAF" />
                    </linearGradient>
                    <linearGradient
                        id="pie_linear2"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stop-color="#FFD357" />
                        <stop offset="100%" stop-color="#FFC41D" />
                    </linearGradient>
                    <linearGradient
                        id="pie_linear3"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stop-color="#FF6848" />
                        <stop offset="100%" stop-color="#FF8633" />
                    </linearGradient>
                    <linearGradient
                        id="pie_linear4"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stop-color="#1F5086" />
                        <stop offset="100%" stop-color="#004086" />
                    </linearGradient>
                </defs>
            </slot>
            <g class="arc__group">
                <path
                    v-for="(path, i) in paths"
                    :d="path"
                    :key="i"
                    class="arc"
                    :fill="colorGen(per[i], i)"
                ></path>
            </g>
            <g class="text__group">
                <text>{{ title }}</text>
            </g>
        </svg>
        <div class="legend__group">
            <div class="legend" v-for="(v, i) in per" :key="i">
                <svg class="tag">
                    <rect :fill="colorGen(v, i)"></rect>
                </svg>
                <div class="text">{{ labelGen(v, i) }}</div>
            </div>
        </div>
    </div>
</template>
<script>
import { path } from "d3-path";

const sR = 33;
const lR = 47;

function genPiePath(data, sR, lR) {
    const startAngle = 0;
    const polar2cartesian = function(angle, r) {
        return [r * Math.cos(angle), r * Math.sin(angle)];
    };
    let arcStartAngle = startAngle;
    const paths = data.map(v => {
        const piePath = path();
        const p1 = polar2cartesian(arcStartAngle, sR);
        const arcEndAngle = arcStartAngle + v * 2 * Math.PI;
        piePath.moveTo(...p1);
        piePath.arc(0, 0, lR, arcStartAngle, arcEndAngle);
        piePath.arc(0, 0, sR, arcEndAngle, arcStartAngle, true);
        piePath.closePath();
        arcStartAngle = arcEndAngle;
        return piePath.toString();
    });
    return paths;
}
export default {
    props: {
        colorGen: {
            type: Function,
            default: (v, i) => `url(#pie_linear${i})`
        },
        labelGen: {
            type: Function,
            default: v => `${(100 * v).toFixed(1)}%`
        },
        pieData: {
            type: Array,
            default: () => []
        },
        title: {
            type: String,
            default: ""
        }
    },
    computed: {
        paths() {
            return genPiePath(this.per, sR, lR);
        },
        per() {
            if (!this.pieData.length) {
                return [];
            }
            const sum = this.pieData
                .map(v => Number(v))
                .reduce((pre, cur) => pre + cur, 0);
            if (!sum) {
                return this.pieData.map(v => Number(v));
            }
            return this.pieData.map(v => Number(v)).map(v => v / sum);
        }
    }
};
</script>
<style lang="scss" scoped>
.pie {
    display: flex;
    align-items: center;
    &__graph {
        height: 94px;
        width: 94px;
        margin-right: 30px;
    }
    .arc__group,
    .text__group {
        transform: translate(50%, 50%);
        .arc {
            transition: ease-in-out 0.1s;
        }
    }
    .text__group {
        text-anchor: middle;
        dominant-baseline: middle;
        fill: #5e6875;
        font-size: 12px;
    }
    .legend__group {
        flex-wrap: wrap;
        display: flex;
        height: 60px;
        flex-direction: column;
        width:250px;
        .legend {
            display: flex;
            align-items: center;
            .tag {
                width: 9px;
                height: 9px;
                margin-right: 10px;
                > rect {
                    width: 9px;
                    height: 9px;
                }
            }
            .text {
                font-size: 12px;
                color: #24272b;
                margin-right: 20px;
            }
        }
    }
}
</style>
