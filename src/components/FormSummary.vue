<script setup lang="ts">
import { onMounted } from 'vue';
import FormButton from '@/components/forms/FormButton.vue';

import type FormData from '@/types/FormData';
import type InsurancePackage from '@/types/InsurancePackage';
import type Country from '@/types/Country';

const props = defineProps<{
	data: FormData;
	foundPackage: InsurancePackage | null;
	foundCountry: Country | null;
	finalPremium: number;
}>();

const emit = defineEmits<{
	(e: 'buy'): number;
	(e: 'goBack'): number;
}>();

onMounted(() => {
	if (!props.finalPremium || !props.foundPackage) {
		emit('goBack');
	}
});
</script>

<template>
	<h2 class="text-3xl font-bold leading-7 mb-8 text-center">Summary</h2>
	<p class="mb-5">
		Hi {{ data.name }}, just one more step. Please confirm your data below
		before continuing.
	</p>
	<div class="mb-2 flex">
		<span class="inline-block w-32 flex-shrink-0">Name:</span>
		<strong class="break-all flex-shrink">{{ data.name }}</strong>
	</div>
	<div class="mb-2 flex">
		<span class="inline-block w-32">Age:</span>
		<strong>{{ data.age }}</strong>
	</div>
	<div class="mb-2">
		<span class="inline-block w-32">Country:</span>
		<strong>{{ foundCountry ? foundCountry.name : 'N/A' }}</strong>
	</div>
	<div class="mb-2">
		<span class="inline-block w-32">Package:</span>
		<strong>{{ foundPackage ? foundPackage.name : 'N/A' }}</strong>
	</div>
	<div class="mb-2">
		<span class="inline-block w-32">Premium:</span>
		<strong
			>{{ finalPremium.toLocaleString('en-US') }}
			{{ data.country.toUpperCase() }}</strong
		>
	</div>
	<div class="flex flex-col justify-between mt-10 sm:flex-row">
		<FormButton
			:type="'secondary'"
			:text="'Back'"
			@click="$emit('goBack')"
		/>
		<FormButton :type="'primary'" :text="'Buy'" @click="$emit('buy')" />
	</div>
</template>
