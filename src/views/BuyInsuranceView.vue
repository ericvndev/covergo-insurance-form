<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import CallToAction from '@/components/CallToAction.vue';
import MainForm from '@/components/MainForm.vue';
import FormSummary from '@/components/FormSummary.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

import type FormData from '@/types/FormData';
import type ServerData from '@/types/ServerData';
import type InsurancePackage from '@/types/InsurancePackage';
import type Country from '@/types/Country';

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

let defaultFormData: FormData = {
	name: '',
	age: null,
	country: 'HKD',
	package: 'standard',
};

// Check for default form data from localStorage
if (window.localStorage) {
	const dataFromStorage = window.localStorage.getItem('data');

	if (dataFromStorage) {
		defaultFormData = JSON.parse(dataFromStorage);
	}
}

const formData = ref<FormData>(defaultFormData);
const step = ref<number>(-1);

// Watch for route changes when user click Back button also
watch(router.currentRoute, (currentRoute) => {
	step.value = parseInt(currentRoute.query.step?.toString() || '0');
});

// Watch for form data changes and save it to localStorage
watch(formData, (newFormData) => {
	if (window.localStorage) {
		window.localStorage.setItem('data', JSON.stringify(newFormData));
	}
});

// Watch for step changes and reset formData to default
watch(step, (newStep) => {
	if (newStep === 0) {
		formData.value = {
			name: '',
			age: null,
			country: 'HKD',
			package: 'standard',
		};
	}
});

onMounted(() => {
	const query = router.currentRoute.value.query;

	// Delay a little bit for smooth transition at startup
	setTimeout(() => {
		step.value = parseInt(`${query.step || 0}`);
	}, 300);
});

function handleDataChange(key: string, newValue: string | number): void {
	formData.value = {
		...formData.value,
		[key]: newValue,
	};
}

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
	step.value = 0;
	router.push({ query: { step: step.value } });
}

function calculateStandardPremium(): number {
	if (!formData.value.age) {
		return 0;
	}
	if (formData.value.age > 0 && formData.value.country) {
		const country = foundCountry.value;
		if (country) {
			return formData.value.age * 10 * country.exchangeRate;
		}
	}
	return 0;
}

const foundCountry = computed((): Country | null => {
	const country = dataFromServer.countries.find(
		(country) => country.currencyCode === formData.value.country
	);
	return country || null;
});

const foundPackage = computed((): InsurancePackage | null => {
	const foundPackage = dataFromServer.packages.find(
		(pk) => pk.id === formData.value.package
	);
	return foundPackage || null;
});

const standardPremium = computed((): number => {
	return calculateStandardPremium();
});

const finalPremium = computed((): number => {
	if (foundPackage.value) {
		const standardPremium = calculateStandardPremium();
		return (
			standardPremium +
			(standardPremium * foundPackage.value.extraPercent) / 100
		);
	}
	return 0;
});

const ageError = computed((): boolean => {
	// Age is over 100
	if ((formData.value.age || 0) > 100 && step.value === 2) {
		return true;
	}
	return false;
});
</script>

<template>
	<div class="container mx-auto flex flex-col">
		<Transition>
			<div
				v-if="step === 0"
				class="fixed transform top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 px-8 py-16 sm:px-20 bg-gray-50 text-center w-11/12 max-w-2xl"
			>
				<CallToAction @goNext="goNext" />
			</div>
		</Transition>
		<Transition>
			<div
				v-if="step > 0 && !ageError"
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
				class="mt-10 mx-auto px-8 sm:px-20 py-16 bg-gray-50 w-11/12 max-w-lg"
			>
				<MainForm
					:data="formData"
					:serverData="dataFromServer"
					:standardPremium="standardPremium"
					:finalPremium="finalPremium"
					@goNext="goNext"
					@goBack="goBack"
					@handleDataChange="handleDataChange"
				/>
			</div>
		</Transition>
		<Transition>
			<div
				v-if="step === 2"
				class="mt-10 mx-auto px-8 sm:px-20 py-16 bg-gray-50 w-11/12 max-w-lg"
			>
				<ErrorMessage
					:errorMessage="'Your age is over our accepted limit.\nWe are sorry, we can not insure you now'"
					@goBack="goBack"
					v-if="ageError"
				/>
				<FormSummary
					v-else
					:data="formData"
					:foundCountry="foundCountry"
					:foundPackage="foundPackage"
					:finalPremium="finalPremium"
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
