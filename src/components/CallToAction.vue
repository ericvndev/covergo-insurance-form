<script setup lang="ts">
defineEmits<{
	(e: 'goNext'): number
	(e: 'goBack'): number
}>()
</script>

<template>
	<div class="fixed transform top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 px-20 py-20 bg-gray-50 text-center">
		<h2 class="text-3xl font-bold leading-7 mb-8">Hello There!</h2>
		<p class="mb-6 whitespace-nowrap">
			Let&apos;s buy some insurance. It is going to take only a few steps
		</p>
		<button class="px-20 py-2 bg-black text-white rounded" @click="$emit('goNext')">Start</button>
	</div>
</template>

<style scoped>
</style>
