<template>
    <teleport to="body">
        <UModal v-model="isModalOpen" prevent-close>
            <UCard
                :ui="{
                    ring: '',
                    divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                }"
            >
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3
                            class="text-xl font-semibold leading-6"
                            :class="{
                                '!text-red-500 dark:!text-red-400': danger,
                            }"
                        >
                            {{ title }}
                        </h3>
                        <UButton
                            color="gray"
                            variant="ghost"
                            icon="i-heroicons-x-mark-20-solid"
                            class="-my-1"
                            @click="isModalOpen = false"
                        />
                    </div>
                </template>
                <slot name="body" />
                <template #footer>
                    <slot name="footer" />
                </template>
            </UCard>
        </UModal>
    </teleport>
</template>

<script setup lang="ts">
defineProps({
    title: {
        type: String,
        required: true,
    },
    danger: {
        type: Boolean,
        default: false,
    },
});
const uiStore = useUIStore();
const { isModalOpen } = storeToRefs(uiStore);
</script>
