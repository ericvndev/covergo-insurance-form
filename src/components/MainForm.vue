<script setup lang="ts">
import { computed, ref } from 'vue';
import type FormData from '@/types/FormData';
import type ServerData from '@/types/ServerData';
import FormButton from '@/components/forms/FormButton.vue';

const props = defineProps<{
	data: FormData;
	serverData: ServerData;
}>();

defineEmits<{
	(e: 'goNext'): number;
	(e: 'goBack'): number;
}>();

const data = ref<FormData>(props.data);

function calculateStandardPremium(): number {
	const { serverData, data } = props;
	if (!data.age) {
		return 0;
	}
	if (data.age > 0 && data.country) {
		const country = serverData.countries.find(
			(country) => country.currencyCode === data.country
		);
		if (country) {
			return data.age * 10 * country.exchangeRate;
		}
	}
	return 0;
}

function calculateExtra(extraPercent: number): number {
	return (calculateStandardPremium() * extraPercent) / 100;
}

const finalPremium = computed(() => {
	const { serverData, data } = props;
	const foundPackage = serverData.packages.find(
		(pk) => pk.id === data.package
	);
	if (foundPackage) {
		return (
			calculateStandardPremium() +
			calculateExtra(foundPackage.extraPercent)
		);
	}
	return 0;
});
</script>
<template>
	<h2 class="text-3xl font-bold leading-7 mb-8">Tell us about yourself</h2>
	<form>
		<div>
			<label for="name">Name <span class="text-red-600">*</span></label>
			<input
				class="w-full rounded mt-2 mb-5"
				type="text"
				name="name"
				id="name"
				placeholder="Tell us your name"
				v-model="data.name"
			/>
		</div>
		<div>
			<label for="age">Age <span class="text-red-600">*</span></label>
			<input
				class="w-full rounded mt-2 mb-5"
				type="tel"
				name="age"
				id="age"
				placeholder="Tell us your age"
				v-model="data.age"
			/>
		</div>
		<div>
			<label for="country"
				>Country <span class="text-red-600">*</span></label
			>
			<select
				class="w-full rounded mt-2 mb-5"
				name="country"
				id="country"
				v-model="data.country"
			>
				<option disabled value="">Where do you live?</option>
				<option
					v-for="country in (serverData || {}).countries"
					v-bind:key="country.currencyCode"
					:value="country.currencyCode"
				>
					{{ country.name }}
				</option>
			</select>
		</div>
		<div class="mb-5">
			<p>Please choose your desired package</p>
			<div
				v-for="pk in serverData.packages"
				v-bind:key="pk.id"
				class="mt-2"
			>
				<input
					type="radio"
					name="package"
					:id="pk.id"
					:value="pk.id"
					v-model="data.package"
				/>&nbsp;
				<label :for="pk.id"
					>{{ pk.name }}
					<span v-if="!!pk.extraPercent"
						>(+{{ calculateExtra(pk.extraPercent)
						}}{{ data.country.toUpperCase() }},
						{{ pk.extraPercent }}%)
					</span>
				</label>
			</div>
		</div>
		<div class="text-2xl font-bold">
			Your premium is: {{ finalPremium }}{{ data.country.toUpperCase() }}
		</div>
		<div class="flex justify-between mt-10">
			<FormButton
				:type="'secondary'"
				:text="'Back'"
				@on-click="$emit('goBack')"
			/>
			<FormButton
				:type="'primary'"
				:text="'Next'"
				@on-click="$emit('goNext')"
			/>
		</div>
	</form>
</template>
