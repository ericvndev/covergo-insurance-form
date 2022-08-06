<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import CallToAction from '@/components/CallToAction.vue';
import MainForm from '@/components/MainForm.vue';
import FormSummary from '@/components/FormSummary.vue';
import type FormData from '@/types/FormData';
import type ServerData from '@/types/ServerData';

const router = useRouter();

const dataFromServer: ServerData = {
	countries: [
		{
			name: 'Hong Kong',
			currencyCode: 'HKD',
			exchangeRate: 1,
		},
		{
			name: 'USA',
			currencyCode: 'USD',
			exchangeRate: 2,
		},
		{
			name: 'Australia',
			currencyCode: 'AUD',
			exchangeRate: 3,
		},
	],
	packages: [
		{
			id: 'standard',
			name: 'Standard',
			extraPercent: 0,
		},
		{
			id: 'safe',
			name: 'Safe',
			extraPercent: 50,
		},
		{
			id: 'super-safe',
			name: 'Super Safe',
			extraPercent: 75,
		},
	],
};

const step = ref<number>(-1);
const formData = ref<FormData>({
	name: '',
	age: null,
	country: 'HKD',
	package: 'standard',
});

// Watch for route changes when user click Back button also
watch(router.currentRoute, (currentRoute) => {
	step.value = parseInt(currentRoute.query.step?.toString() || '0');
});

onMounted(() => {
	const query = router.currentRoute.value.query;

	// Delay a little bit for smooth transition at startup
	setTimeout(() => {
		step.value = parseInt(`${query.step || 0}`);
	}, 300);
});

function updateStep(isUp: boolean): number {
	let newValue = step.value;
	if (isUp) {
		newValue += 1;
	} else {
		newValue -= 1;
	}

	// Change back to -1 first to avoid animation glitch
	step.value = -1;
	setTimeout(() => {
		// Make sure step value is not out of range
		step.value = Math.max(Math.min(newValue, 2), 0);

		// Push step query to browser history to keep user progress
		router.push({ query: { step: step.value } });
	}, 300);

	return newValue;
}

function goNext(): number {
	return updateStep(true);
}

function goBack(): number {
	return updateStep(false);
}

function submit(): void {
	alert('submitted');
}
</script>

<template>
	<div class="container mx-auto flex flex-col">
		<Transition>
			<div
				v-if="step === 0"
				class="fixed transform top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 px-8 py-20 sm:px-20 bg-gray-50 text-center w-11/12 max-w-2xl"
			>
				<CallToAction @goNext="goNext" />
			</div>
		</Transition>
		<Transition>
			<div
				v-if="step > 0"
				class="mx-auto max-w-lg w-11/12 flex justify-between absolute top-10 z-10 left-1/2 transform -translate-x-1/2"
			>
				<div
					class="h-2 w-1/2"
					:class="{
						'bg-blue-600': step === 1,
						'bg-gray-200': step !== 1,
					}"
				></div>
				<span class="w-1" />
				<div
					class="h-2 w-1/2"
					:class="{
						'bg-blue-600': step === 2,
						'bg-gray-200': step !== 2,
					}"
				></div>
			</div>
		</Transition>
		<Transition>
			<div
				v-if="step === 1"
				class="mt-10 mx-auto px-20 py-20 bg-gray-50 w-11/12 max-w-lg"
			>
				<MainForm
					:data="formData"
					:serverData="dataFromServer"
					@goNext="goNext"
					@goBack="goBack"
				/>
			</div>
		</Transition>
		<Transition>
			<div
				v-if="step === 2"
				class="mt-10 mx-auto px-20 py-20 bg-gray-50 w-11/12 max-w-lg"
			>
				<FormSummary
					:data="formData"
					:serverData="dataFromServer"
					@buy="submit"
					@goBack="goBack"
				/>
			</div>
		</Transition>
	</div>
</template>

<style>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
