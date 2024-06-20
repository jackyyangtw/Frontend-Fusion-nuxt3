<template>
    <teleport to="body">
        <UModal v-if="!isImage" v-model="isModalOpen" prvent-close>
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
        <UModal v-else v-model="isModalOpen" fullscreen>
            <UCard
                :ui="{
                    base: 'h-full flex flex-col',
                    rounded: '',
                    body: {
                        base: 'grow',
                    },
                }"
            >
                <div class="text-right mb-5">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark-20-solid"
                        @click="isModalOpen = false"
                    />
                </div>
                <slot name="image" v-if="isImage" />
            </UCard>
        </UModal>
    </teleport>
</template>

<script setup lang="ts">
defineProps({
    title: {
        type: String,
        default: "",
    },
    danger: {
        type: Boolean,
        default: false,
    },
    isImage: {
        type: Boolean,
        default: false,
    },
});
const uiStore = useUIStore();
const { isModalOpen } = storeToRefs(uiStore);
</script>
