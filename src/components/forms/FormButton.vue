<script setup lang="ts">
defineProps<{
	type: string;
	text: string;
}>();
defineEmits<{
	(e: 'onClick'): void;
}>();
</script>

<template>
	<button
		class="px-16 py-2 rounded w-full sm:w-auto mb-2"
		:class="{
			'bg-black': type === 'primary',
			'text-white': type === 'primary',
			'bg-white': type === 'secondary',
			'text-black': type === 'secondary',
			border: type === 'secondary',
			'border-black': type === 'secondary',
		}"
		@click="$emit('onClick')"
		type="button"
	>
		{{ text }}
	</button>
</template>
