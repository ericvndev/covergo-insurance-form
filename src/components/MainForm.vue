<script setup lang="ts">
import type FormData from '@/types/FormData';
import type ServerData from '@/types/ServerData';
import FormButton from '@/components/forms/FormButton.vue';

const props = defineProps<{
	data: FormData;
	serverData: ServerData;
	standardPremium: number;
	finalPremium: number;
}>();

const emit = defineEmits<{
	(e: 'goNext'): number;
	(e: 'goBack'): number;
	(e: 'handleDataChange', k: string, v: string | number): number;
	(e: 'calculateExtra', p: number): number;
}>();

function handleChange(e: Event) {
	const name = (e.target as HTMLInputElement).name;
	const newValue = (e.target as HTMLInputElement).value;
	emit('handleDataChange', name, newValue);
}
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
				:value="props.data.name"
				@input="handleChange"
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
				:value="props.data.age"
				@input="handleChange"
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
				:value="props.data.country"
				@change="handleChange"
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
		<div class="mb-10">
			<p>Please choose your desired package</p>
			<div
				v-for="pk in serverData.packages"
				v-bind:key="pk.id"
				class="mt-2"
			>
				<input
					class="focus:ring-transparent"
					type="radio"
					name="package"
					:id="pk.id"
					:value="pk.id"
					:checked="props.data.package === pk.id"
					@change="handleChange"
				/>&nbsp;
				<label :for="pk.id"
					>{{ pk.name }}
					<div class="inline" v-if="!!pk.extraPercent">
						<span v-if="!!standardPremium">
							(<strong
								>+
								{{
									(
										(standardPremium * pk.extraPercent) /
										100
									).toLocaleString('en-US')
								}}
								{{ data.country.toUpperCase() }},
							</strong>
							{{ pk.extraPercent }}%)
						</span>
						<span v-else> (+{{ pk.extraPercent }}%) </span>
					</div>
				</label>
			</div>
		</div>
		<div class="text-2xl font-bold">
			Your premium is:
			<span v-if="finalPremium"
				>{{ finalPremium.toLocaleString('zh-hk') }}
				{{ data.country.toUpperCase() }}</span
			>
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
