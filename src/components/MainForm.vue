<script setup lang="ts">

import { ref } from 'vue';
import type FormData from '@/types/FormData';
import type ServerData from '@/types/ServerData';

const props = defineProps<{
    data: FormData,
    serverData: ServerData,
}>()

defineEmits<{
    (e: 'goNext'): number
    (e: 'goBack'): number
}>()

const data = ref<FormData>(props.data);

</script>
<template>
    <div class="fixed transform top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 px-20 py-20 bg-gray-50">
        <h2 class="text-3xl font-bold leading-7 mb-8">Tell us about yourself</h2>
        <div>
            <label for="name">Name <span class="text-red-600">*</span></label>
            <input class="w-full rounded mt-2 mb-5" type="text" name="name" id="name" placeholder="Tell us your name" />
        </div>
        <div>
            <label for="age">Age <span class="text-red-600">*</span></label>
            <input class="w-full rounded mt-2 mb-5" type="tel" name="age" id="age" placeholder="Tell us your age" />
        </div>
        <div>
            <label for="country">Nationality <span class="text-red-600">*</span></label>
            <select class="w-full rounded mt-2 mb-5" name="country" id="country" v-model="data.country">
                <option disabled value="">Where do you live?</option>
                <option v-for="country in (serverData || {}).countries" v-bind:key="country.currencyCode"
                    :value="country.currencyCode">
                    {{ country.name }}
                </option>
            </select>
        </div>
        <div class="flex justify-between">
            <button class="py-3 px-8 w-1/2 bg-white text-black rounded border border-solid border-black"
                @click="$emit('goBack')">Back</button>
            <button class="py-3 px-8 w-1/2 bg-black text-white rounded" @click="$emit('goNext')">Next</button>
        </div>
    </div>
</template>

