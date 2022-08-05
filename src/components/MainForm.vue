<script setup lang="ts">
withDefaults(defineProps<{
    data: FormData,
}>(), {
    data: {
        name: 'Eric'
    }
})
defineEmits<{
    (e: 'goNext'): number
    (e: 'goBack'): number
}>()
</script>
<template>
    <div class="container">
        <h1>Form</h1>
    </div>
    {{ data.name }}

    <button @click="$emit('goBack')">Back</button>
    <button @click="$emit('goNext')">Next</button>

</template>

