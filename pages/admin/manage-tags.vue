<template>
    <div class="max-w-5xl mx-auto tags-manage pt-5">
        <div class="flex items-center justify-center gap-5">
            <div class="tags w-1/2">
                <h2 class="text-2xl mb-5"> 全部tag </h2>
                <div class="flex flex-wrap items-center gap-3">
                    <div
                        class="flex flex-wrap justify-center items-center gap-1"
                        v-for="tag in tags"
                        :key="tag.id"
                    >
                        <UIcon
                            class="cursor-pointer"
                            name="i-heroicons-trash"
                            @click.prevent="deleteTag(tag.id)"
                        />
                        <PostBadge
                            :classes="tag.style"
                            :badgeName="tag.name"
                        ></PostBadge>
                    </div>
                </div>
            </div>
            <div class="form w-1/2">
                <UForm
                    :schema="schema"
                    :state="editedTag"
                    class="space-y-4"
                    @submit="onSubmit"
                >
                    <UFormGroup label="名稱" name="name">
                        <UInput v-model="editedTag.name" />
                    </UFormGroup>
                    <UFormGroup label="樣式" name="styles">
                        <UInput v-model="editedTag.styles" />
                    </UFormGroup>

                    <UButton type="submit"> Submit </UButton>
                </UForm>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { object, string, type InferType } from "yup";
import { ref as dbRef, push, set, remove } from "firebase/database";
// import type { FormSubmitEvent, FormErrorEvent } from "#ui/types";
const tagsStore = useTagsStore();
const { tags } = storeToRefs(tagsStore);

const uiStore = useUIStore();

const { toast } = storeToRefs(uiStore);

type Schema = InferType<typeof schema>;
const schema = object({
    name: string().required("請輸入tag名稱"),
    styles: string().required("請輸入tag樣式"),
});

const editedTag = reactive({
    styles: "",
    name: "",
    id: "",
});

const generateTag = () => {
    return {
        name: editedTag.name,
        style: `bg-${editedTag.styles}-100 text-${editedTag.styles}-800 dark:bg-${editedTag.styles}-900 dark:text-${editedTag.styles}-300`,
    };
};
const { $db } = useNuxtApp();

const resetForm = () => {
    editedTag.name = "";
    editedTag.styles = "";
};
const onSubmit = async () => {
    const tag = generateTag();
    try {
        toast.value = {
            showToast: true,
            message: "新增tag中...",
            messageType: "loading",
        };
        const newTagRef = push(dbRef($db, "tags"));
        const newTagKey = newTagRef.key as string;
        const newTag = { ...tag, id: newTagKey };
        await set(newTagRef, newTag);
        tags.value.push(newTag);
        toast.value = {
            showToast: true,
            message: "新增完成!",
            messageType: "success",
        };
        resetForm();
    } catch (error) {
        console.error(error);
    }
};
const deleteTag = async (tagId: string) => {
    try {
        toast.value = {
            showToast: true,
            message: "刪除tag中...",
            messageType: "loading",
        };
        await remove(dbRef($db, `tags/${tagId}`));
        tags.value = tags.value.filter((tag) => tag.id !== tagId);
        toast.value = {
            showToast: true,
            message: "刪除完成!",
            messageType: "success",
        };
    } catch (error) {
        console.error(error);
    }
};
</script>

<style scoped></style>
