<script setup lang="ts">
defineEmits<{
	(e: 'goNext'): number
	(e: 'goBack'): number
}>()

</script>

<template>
	<div>
		<h2>Hello There</h2>
		<p>
			Let&apos;s buy some insurance. It is going to take only a few steps
		</p>
		<button @click="$emit('goNext')">Start</button>
	</div>
</template>

<style scoped>
</style>
