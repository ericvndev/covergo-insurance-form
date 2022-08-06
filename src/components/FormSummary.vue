<script setup lang="ts">
import type FormData from '@/types/FormData';
import FormButton from '@/components/forms/FormButton.vue';

defineProps<{
	data: FormData;
}>();

defineEmits<{
	(e: 'buy'): number;
	(e: 'goBack'): number;
}>();
</script>

<template>
	<h2 class="text-3xl font-bold leading-7 mb-8">Summary</h2>
	<div class="flex justify-between mt-10">
		<FormButton
			:type="'secondary'"
			:text="'Back'"
			@click="$emit('goBack')"
		/>
		<FormButton :type="'primary'" :text="'Buy'" @click="$emit('buy')" />
	</div>
</template>
