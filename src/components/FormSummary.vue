<script setup lang="ts">
import type FormData from '@/types/FormData';

defineProps<{
    data: FormData,
}>()

defineEmits<{
    (e: 'buy'): number
    (e: 'goBack'): number
}>()

</script>

<template>
    <div class="fixed transform top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 px-20 py-20 bg-gray-50 text-center">
        <h2 class="text-3xl font-bold leading-7 mb-8">Summary</h2>
    </div>

    <button @click="$emit('goBack')">Back</button>
    <button @click="$emit('buy')">Buy</button>
</template>