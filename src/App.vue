<script setup lang="ts">
import "./assets/base.css";
import { ref } from "vue";
import { computed } from "@vue/reactivity";
import { useLocalStorage } from "@vueuse/core";

const baseOptions = [
  "flessioni",
  "biscotti",
  "colonscopia",
  "altre cose divertenti",
  "ma molto divertenti",
  "fai le puzze",
  "1",
  "2",
  "3",
  "4",
];

const options = useLocalStorage("options", baseOptions);
const spinner = ref<HTMLElement | null>(null);
const spinning = ref(false);
const spinningAngle = ref(0);

function generateLightColorHex() {
  let color = "#";
  for (let i = 0; i < 3; i++)
    color += (
      "0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)
    ).slice(-2);
  return color;
}

function randomInt(min = 0, max = 10) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function getSectorPath(
  x: number,
  y: number,
  outerDiameter: number,
  a1: number,
  a2: number
) {
  const degtorad = Math.PI / 180;
  const halfOuterDiameter = outerDiameter / 2;
  const cr = halfOuterDiameter - 5;
  const cx1 = Math.cos(degtorad * a2) * cr + x;
  const cy1 = -Math.sin(degtorad * a2) * cr + y;
  const cx2 = Math.cos(degtorad * a1) * cr + x;
  const cy2 = -Math.sin(degtorad * a1) * cr + y;

  return `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 0 1 ${cx2} ${cy2}Z`;
}
function getReducedSectorPath(
  x: number,
  y: number,
  outerDiameter: number,
  a1: number,
  a2: number
) {
  const degtorad = Math.PI / 180;
  const halfOuterDiameter = outerDiameter / 2;
  const cr = halfOuterDiameter - 10;
  const cx1 = Math.cos(degtorad * a2) * cr + x;
  const cy1 = -Math.sin(degtorad * a2) * cr + y;
  const cx2 = Math.cos(degtorad * a1) * cr + x;
  const cy2 = -Math.sin(degtorad * a1) * cr + y;

  return `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 0 1 ${cx2} ${cy2}Z`;
}

function spinWheel() {
  if (spinning.value) return;

  const AT_LEAST_FIVE_TURNS = 360 * 5;
  const AT_MAX_TEN_TURNS = 360 * 10;

  spinningAngle.value = randomInt(
    spinningAngle.value + AT_LEAST_FIVE_TURNS,
    spinningAngle.value + AT_MAX_TEN_TURNS
  );

  spinning.value = true;
  //   spinner.value?.classList.add("spin-me");

  setTimeout(() => {
    spinning.value = false;
    // spinner.value?.classList.remove("spin-me");
  }, 5000);
}

function rimuovi() {
  options.value.shift();
}
function reset() {
  options.value = baseOptions;
}

const outerDiameter = 100;

const wheelSlices = computed(() => {
  const sliceNumber = options.value.length;
  const sliceAngle = 360 / sliceNumber;
  const offset = sliceAngle / 2;
  console.log(offset, sliceAngle);

  return options.value.map((option, index) => {
    return {
      title: option,
      start: index * sliceAngle - offset,
      end: (index + 1) * sliceAngle - offset,
      color: generateLightColorHex(),
    };
  });
});
</script>

<template>
  <div class="p-4 h-screen overflow-auto">
    <header></header>

    <main class="mx-auto max-w-xl w-full">
      <div class="relative border w-full aspect-square bg-cyan-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute left-0 right-0 mx-auto aspect-square w-[6%] z-50 text-gray-700 top-[0.5%]"
          viewBox="0 0 24 24"
        >
          <g fill="currentColor">
            <path
              d="M12 0a9.5 9.5 0 0 0-4 18.119 2.5 2.5 0 0 1 1.218 1.222l1.873 4.076a1 1 0 0 0 1.817 0l1.876-4.08A2.5 2.5 0 0 1 16 18.118 9.5 9.5 0 0 0 12 0zm4.8 8.2l-2.043 2.015a.249.249 0 0 0-.054.277l1.132 2.6a.654.654 0 0 1-.931.819l-2.778-1.565a.249.249 0 0 0-.245 0L9.1 13.912a.654.654 0 0 1-.931-.819l1.132-2.6a.249.249 0 0 0-.054-.277L7.2 8.2a.613.613 0 0 1 .429-1.07h2.339a.25.25 0 0 0 .227-.144l1.217-2.625a.662.662 0 0 1 1.177 0L13.8 6.982a.248.248 0 0 0 .226.145h2.336A.613.613 0 0 1 16.8 8.2z"
            ></path>
          </g>
        </svg>

        <div
          class="h-full w-full spin-me"
          ref="spinner"
          :style="{ '--finish-angle': `${spinningAngle}deg` }"
        >
          <svg
            class="w-full h-full"
            :viewBox="`0 0 ${outerDiameter} ${outerDiameter}`"
          >
            <defs>
              <path
                v-for="slice in wheelSlices"
                :key="slice.title"
                :d="
                  getReducedSectorPath(
                    outerDiameter / 2,
                    outerDiameter / 2,
                    outerDiameter,
                    slice.start,
                    slice.end
                  )
                "
                :id="slice.title"
              />
            </defs>
            <path
              v-for="slice in wheelSlices"
              :key="slice.title"
              :d="
                getSectorPath(
                  outerDiameter / 2,
                  outerDiameter / 2,
                  outerDiameter,
                  slice.start,
                  slice.end
                )
              "
              :fill="slice.color"
            />

            <text
              font-size="3px"
              v-for="slice in wheelSlices"
              :key="slice.title"
            >
              <textPath
                :href="`#${slice.title}`"
                startOffset="50%"
                text-anchor="middle"
              >
                {{ slice.title }}
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </main>

    <footer class="mx-auto max-w-xl w-full mt-6">
      <div class="flex flex-col gap-2">
        <button
          class="w-full bg-cyan-600 py-2 rounded-lg text-white uppercase font-semibold tracking-wide"
          @click="spinWheel"
        >
          Tenta la fortuna
        </button>
        <button
          class="w-full bg-white border py-2 rounded-lg text-cyan-600 font-semibold tracking-wide"
          @click="rimuovi"
        >
          Rimuovi {{ options[0] }}
        </button>
        <button
          class="w-full bg-white border py-2 rounded-lg text-cyan-600 font-semibold tracking-wide"
          @click="reset"
        >
          Reset
        </button>
      </div>
    </footer>
  </div>
</template>

<style>
.spin-me {
  transform: rotate(var(--finish-angle));
  transition-property: transform;
  transition-duration: 5000ms;
  transition-timing-function: ease-out;
}
</style>
