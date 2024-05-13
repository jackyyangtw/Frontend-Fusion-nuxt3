<template>
    <UForm
        :schema="schema"
        :state="editedPost"
        class="rounded p-5 max-w-[900px] mx-auto"
        @submit="onSubmit"
    >
        <UFormGroup label="作者名稱" name="author">
            <UInput :color="color" v-model="editedPost.author" />
        </UFormGroup>
        <UFormGroup label="文章標題" name="title">
            <UInput :color="color" v-model="editedPost.title" />
        </UFormGroup>
        <UFormGroup label="預覽文字" name="previewText">
            <UInput :color="color" v-model="editedPost.author" />
        </UFormGroup>

        <UFormGroup label="Email" name="email">
            <UInput :color="color" v-model="editedPost.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
            <UInput
                :color="color"
                v-model="editedPost.password"
                type="password"
            />
        </UFormGroup>

        <UButton type="submit" class="bg-red"> Submit </UButton>
    </UForm>
</template>

<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const schema = object({
    aurhor: string().required("Required"),
    email: string().email("Invalid email").required("Required"),
    password: string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
});

type Schema = InferType<typeof schema>;

const editedPost = reactive({
    author: undefined,
    email: undefined,
    password: undefined,
    title: "",
    thumbnail: "",
    content: ``,
    previewText: "",
    tags: [],
    previewImgUrl: "/images/post-preview-picture.png",
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
