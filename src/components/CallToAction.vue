<script setup lang="ts">
import FormButton from '@/components/forms/FormButton.vue';
defineEmits<{
	(e: 'goNext'): number;
	(e: 'goBack'): number;
}>();
</script>

<template>
	<h2 class="text-3xl font-bold leading-7 mb-8">Hello There!</h2>
	<p class="mb-6">
		Let&apos;s buy some insurance. It is going to take only a few steps
	</p>
	<FormButton :type="'primary'" :text="'Start'" @on-click="$emit('goNext')" />
</template>

<style scoped></style>
