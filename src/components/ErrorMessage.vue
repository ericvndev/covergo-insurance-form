<script setup lang="ts">
import FormButton from '@/components/forms/FormButton.vue';

defineProps<{
	errorMessage: string;
}>();

defineEmits<{
	(e: 'goBack'): number;
}>();
</script>

<template>
	<div class="text-center">
		<h2 class="text-3xl font-bold leading-7 mb-8">Oops</h2>
		<p class="mb-6 whitespace-pre-wrap">{{ errorMessage }}</p>
		<FormButton
			:type="'primary'"
			:text="'OK :('"
			@on-click="$emit('goBack')"
		/>
	</div>
</template>
