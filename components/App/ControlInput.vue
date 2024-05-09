<template>
    <div class="input-control">
        <label
            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            ><slot
        /></label>
        <input
            v-if="controlType === 'input'"
            class="input-style"
            :placeholder="placeholder"
            :type="inputType"
            v-bind="$attrs"
            :value="value"
            @input="$emit('input', ($event.target as HTMLInputElement).value)"
        />
        <textarea
            v-if="controlType === 'textarea'"
            class="input-style"
            rows="10"
            :value="value"
            @input="$emit('input', ($event.target as HTMLInputElement).value)"
        >
        </textarea>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    inputType?: string;
    controlType: "input" | "textarea";
    placeholder?: string;
    value: string;
    hasError?: boolean;
}>();
</script>

<style scoped>
.input-style {
    @apply block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none;
}
</style>
