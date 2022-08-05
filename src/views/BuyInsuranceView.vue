<script setup lang="ts">
import { ref, watch } from 'vue';
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
			exchangeRate: 2
		},
		{
			name: 'Australia',
			currencyCode: 'AUD',
			exchangeRate: 3
		}
	]
};

const step = ref<number>(parseInt(router.currentRoute.value.query.step?.toString() || '0'));
const formData = ref<FormData>({
	name: '',
	age: 0,
	country: '',
});

// Watch for route changes when user click Back button also
watch(router.currentRoute, (currentRoute) => {
	step.value = parseInt(currentRoute.query.step?.toString() || '0');
});

function updateStep(isUp: boolean): number {
	if (isUp) {
		step.value += 1;
	} else {
		step.value -= 1;
	}
	// Make sure step value is not out of range
	step.value = Math.max(Math.min(step.value, 2), 0);

	// Change route query to allow user refesh
	router.push({ query: { step: step.value } });

	return step.value;
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
	<div>
		<div v-if="step === 0">
			<CallToAction @goNext="goNext" />
		</div>
		<div v-else-if="step === 1">
			<MainForm :data="formData" :serverData="dataFromServer" @goNext="goNext" @goBack="goBack" />
		</div>
		<div v-else-if="step === 2">
			<FormSummary :data="formData" :serverData="dataFromServer" @buy="submit" @goBack="goBack" />
		</div>
	</div>
</template >
			