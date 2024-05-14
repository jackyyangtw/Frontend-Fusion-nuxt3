<template>
    <UForm
        :schema="schema"
        :state="editedPost"
        class="bg-slate-50 dark:bg-slate-950/[0.8] rounded p-5 max-w-[900px] mx-auto flex flex-col gap-5 shadow-md"
        @submit="onSubmit"
    >
        <UFormGroup label="作者名稱" name="author">
            <UInput :color="color" v-model="editedPost.author" />
        </UFormGroup>
        <UFormGroup label="文章標題" name="title">
            <UInput :color="color" v-model="editedPost.title" />
        </UFormGroup>
        <UFormGroup label="預覽文字" name="previewText">
            <UInput :color="color" v-model="editedPost.previewText" />
        </UFormGroup>
        <UFormGroup label="預覽縮圖(本地上傳)" name="previewImgUrl">
            <UInput
                :color="color"
                type="file"
                size="sm"
                icon="i-heroicons-folder"
            />
        </UFormGroup>

        <div>
            <img
                v-if="editedPost.previewImgUrl"
                :src="editedPost.previewImgUrl"
                alt=""
            />
        </div>

        <div class="flex flex-wrap gap-3">
            <UCheckbox
                :color="color"
                v-model="editedPost.tags"
                v-for="tag in tags"
                :key="tag"
                :value="tag.name"
                :label="tag.name"
            />
        </div>

        <TiptapEditor :editedPost="post" />

        <UButton type="submit"> Submit </UButton>
    </UForm>
</template>

<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

const props = defineProps<{
    post: Post;
}>();

const schema = object({
    aurhor: string().required("Required"),
    email: string().email("Invalid email").required("Required"),
    password: string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
});

type Schema = InferType<typeof schema>;

const tagsStore = useTagsStore();
const { tags } = storeToRefs(tagsStore);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const editedPost = reactive({
    author: user.value?.name,
    title: props.post.title || "",
    thumbnail: props.post.thumbnail || "",
    content: props.post.content || "",
    previewText: props.post.previewText || "",
    tags: props.post.tags || [],
    previewImgUrl:
        props.post.previewImgUrl || "/images/post-preview-picture.png",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    // Do something with event.data
    console.log(event.data);
}

const colorMode = useColorMode();
const color = computed(() => {
    return colorMode.preference === "dark" ? "pink" : "blue";
});
</script>

<style scoped></style>
