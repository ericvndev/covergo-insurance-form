<script setup lang="ts">
withDefaults(defineProps<{
    data: FormData,
}>(), {
    data: {
        name: 'Eric'
    }
})
defineEmits<{
    (e: 'buy'): number
    (e: 'goBack'): number
}>()
</script>

<template>
    <div class="container">
        Summary
    </div>

    <button @click="$emit('goBack')">Back</button>
    <button @click="$emit('buy')">Buy</button>
</template>