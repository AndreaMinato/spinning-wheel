<script setup lang="ts">
import "./assets/base.css";
import { ref } from "vue";
import { computed } from "@vue/reactivity";
import { useLocalStorage } from "@vueuse/core";

interface Opzione {
  title: string;
  description: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dialog = ref<any>(null);

function setIsOpen(value: boolean) {
  if (value) {
    dialog.value?.showModal();
  } else {
    dialog.value?.close();
  }
}

// 1. Convinci i turisti a sposarsi (spiega ai turisti i motivi per cui dovrebbero sposarsi) 
// 2. Indovinello 
// 3. Balla al ritmo di una delle tue hit preferite! 
// 4. Cantaci una delle te canzoni preferite! 
// 5. Allenati per il matrimonio (esercizi di ginnastica artistica per ricordare la tua infanzia) 
// 6. Fai l’infermiera (prendi parametri vitali alle persone e rassicurali del loro stato di salute) 
// 7. Cos’è una colonscopia? (spiega alle persone in cosa consiste quest’interessante esame) 
// 8. Esame della vista 
// 9. 3, 2, 1…AZIONE! (recita una parte del copione per cui hai tanto lottato)

const baseOptions: Array<Opzione> = [
  {
    title: "Sposatevi tutti",
    description: "Convinci i turisti a sposarsi, spiega loro i motivi per cui dovrebbero sposarsi",
  },
  { title: "Indovinello", description: "" },
  {
    title: "Balla",
    description: "Balla al ritmo di una delle tue hit preferite!",
  },
  {
    title: "Canta",
    description: "Cantaci una delle te canzoni preferite!",
  },
  {
    title: "Allenati per il matrimonio",
    description: "Ricorda la tua infanzia con qualche esercizio di ginnastica artistica",
  },
  {
    title: "Infermieraa!",
    description: "Fai l'infermiera, prendi parametri vitali alle persone e rassicurali del loro stato di salute",
  },
  { title: "Cos'è una colonscopia?", description: "Spiega alle persone in cosa consiste quest'interessante esame" },
  { title: "Esame della vista", description: "" },
  { title: "3, 2, 1…AZIONE!", description: "Recita una parte del copione per cui hai tanto lottato" },
];

const options = useLocalStorage<Array<Opzione>>(
  "options",
  JSON.parse(JSON.stringify(baseOptions))
);
const spinner = ref<HTMLElement | null>(null);
const spinning = ref(false);
const spinningAngle = ref(0);
const currentlyOn = ref({ title: "", description: "" });

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
  a2: number,
  radiusFactor = 5
) {
  const degtorad = Math.PI / 180;
  const halfOuterDiameter = outerDiameter / 2;
  const cr = halfOuterDiameter - radiusFactor;
  const cx1 = Math.cos(degtorad * a2) * cr + x;
  const cy1 = -Math.sin(degtorad * a2) * cr + y;
  const cx2 = Math.cos(degtorad * a1) * cr + x;
  const cy2 = -Math.sin(degtorad * a1) * cr + y;

  return `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 0 1 ${cx2} ${cy2}Z`;
}

const baseSpin = computed(() => {
  return spinningAngle.value % 360;
});

function spinWheel() {
  if (spinning.value) return;

  const AT_LEAST_FIVE_TURNS = 360 * 5;
  const AT_MAX_TEN_TURNS = 360 * 10;

  spinningAngle.value = randomInt(
    spinningAngle.value + AT_LEAST_FIVE_TURNS,
    spinningAngle.value + AT_MAX_TEN_TURNS
  );

  const selected = wheelSlices.value.find((slice) => {
    return slice.start <= baseSpin.value && slice.end >= baseSpin.value;
  });

  spinning.value = true;

  setTimeout(() => {
    setIsOpen(true);
    currentlyOn.value.title = selected?.title || "";
    currentlyOn.value.description = selected?.description || "";
    spinning.value = false;
  }, 5000);
}

function rimuovi() {
  options.value = options.value.filter(
    ({ title }) => title != currentlyOn.value.title
  );
  currentlyOn.value = { title: "", description: "" };
  setIsOpen(false);
}
function reset() {
  options.value = JSON.parse(JSON.stringify(baseOptions));
}

const outerDiameter = 100;

const wheelSlices = computed(() => {
  const sliceNumber = options.value.length;
  const sliceAngle = 360 / sliceNumber;
  const offset = 0; //sliceAngle / 2;

  return options.value.map((option, index) => {
    return {
      title: option.title,
      description: option.description,
      start: index * sliceAngle - offset,
      end: (index + 1) * sliceAngle - offset,
      color: generateLightColorHex(),
    };
  });
});
</script>

<template>
  <div class="p-4 h-screen overflow-auto bg-cyan-100">
    <header></header>

    <main class="mx-auto max-w-xl w-full">
      <div class="relative w-full aspect-square -rotate-90">
        <svg xmlns="http://www.w3.org/2000/svg"
          class="rotate-90 absolute bottom-0 top-0 my-auto aspect-square w-[6%] z-50 text-cyan-600 right-[0.5%]"
          viewBox="0 0 24 24">
          <g fill="currentColor">
            <path
              d="M12 0a9.5 9.5 0 0 0-4 18.119 2.5 2.5 0 0 1 1.218 1.222l1.873 4.076a1 1 0 0 0 1.817 0l1.876-4.08A2.5 2.5 0 0 1 16 18.118 9.5 9.5 0 0 0 12 0zm4.8 8.2l-2.043 2.015a.249.249 0 0 0-.054.277l1.132 2.6a.654.654 0 0 1-.931.819l-2.778-1.565a.249.249 0 0 0-.245 0L9.1 13.912a.654.654 0 0 1-.931-.819l1.132-2.6a.249.249 0 0 0-.054-.277L7.2 8.2a.613.613 0 0 1 .429-1.07h2.339a.25.25 0 0 0 .227-.144l1.217-2.625a.662.662 0 0 1 1.177 0L13.8 6.982a.248.248 0 0 0 .226.145h2.336A.613.613 0 0 1 16.8 8.2z">
            </path>
          </g>
        </svg>

        <div class="h-full w-full spin-me" ref="spinner" :style="{ '--finish-angle': `${spinningAngle}deg` }">
          <svg class="w-full h-full" :viewBox="`0 0 ${outerDiameter} ${outerDiameter}`">
            <defs>
              <path v-for="slice in wheelSlices" :key="slice.title" :d="
                getSectorPath(
                  outerDiameter / 2,
                  outerDiameter / 2,
                  outerDiameter,
                  slice.start,
                  slice.end,
                  9
                )
              " :id="slice.title" />
            </defs>
            <path v-for="slice in wheelSlices" :key="slice.title" :d="
              getSectorPath(
                outerDiameter / 2,
                outerDiameter / 2,
                outerDiameter,
                slice.start,
                slice.end
              )
            " :fill="slice.color" />

            <text font-size="2px" v-for="slice in wheelSlices" :key="slice.title">
              <textPath :href="`#${slice.title}`" startOffset="50%" text-anchor="middle">
                {{ slice.title }}
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </main>

    <footer class="mx-auto max-w-xl w-full mt-6">
      <div class="flex flex-col gap-2">
        <button class="w-full bg-cyan-600 py-2 rounded-lg text-white uppercase font-semibold tracking-wide"
          @click="spinWheel">
          Tenta la fortuna
        </button>

        <button class="w-full bg-cyan-50 border py-2 rounded-lg text-cyan-600 font-semibold tracking-wide"
          @click="reset">
          Reset
        </button>
      </div>
    </footer>

    <dialog ref="dialog" class="relative z-50">
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div
          class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl my-8 max-w-sm w-full p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ currentlyOn.title }}
          </h3>
          <p class="text-sm text-gray-500">{{ currentlyOn.description }}</p>

          <div class="mt-5 sm:mt-6 flex flex-col gap-3">
            <button @click="rimuovi" type="button"
              class="w-full bg-cyan-50 border py-2 rounded-lg text-cyan-600 font-semibold tracking-wide">
              Rimuovi dalle opzioni
            </button>
            <button @click="setIsOpen(false)" type="button"
              class="w-full bg-cyan-50 border py-2 rounded-lg text-cyan-600 font-semibold tracking-wide">
              Ok
            </button>
          </div>
        </div>
      </div>
    </dialog>
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
