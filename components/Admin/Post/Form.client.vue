<template>
    <UForm
        :schema="schema"
        :state="editedPost"
        class="bg-slate-50 dark:bg-slate-950/[0.5] rounded p-5 max-w-[900px] mx-auto flex flex-col gap-5 shadow-md"
    >
        <UFormGroup label="作者名稱" name="author">
            <UInput color="primary" v-model="editedPost.author" />
        </UFormGroup>
        <UFormGroup label="文章標題" name="title">
            <UInput color="primary" v-model="editedPost.title" />
        </UFormGroup>
        <UFormGroup label="預覽文字" name="previewText">
            <UInput color="primary" v-model="editedPost.previewText" />
        </UFormGroup>
        <UFormGroup label="預覽縮圖(本地上傳)" name="previewImgUrl">
            <UInput
                color="primary"
                type="file"
                size="sm"
                icon="i-heroicons-folder"
                @change="handleFileChange"
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
                color="primary"
                v-model="editedPost.tags"
                v-for="tag in tags"
                :key="tag.name"
                :value="tag.name"
                :label="tag.name"
            />
        </div>

        <TiptapEditor
            :editedPost="post"
            @saveContent="handleSaveContent"
            @addImage="handlerAddImage"
        />

        <UButton type="submit" @click="onSubmit"> Submit </UButton>
    </UForm>
</template>

<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
    listAll,
    deleteObject,
} from "firebase/storage";
import { ref as dbRef, update } from "firebase/database";
const props = defineProps<{
    post: Post;
}>();

const schema = object({
    aurhor: string().required("Required"),
    title: string().required("Required"),
    previewText: string().required("Required"),
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

const updatedFile = ref<File | null>(null);

const handleFileChange = (files: FileList) => {
    if (files && files[0]) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            editedPost.previewImgUrl = e.target?.result as string;
        };

        reader.readAsDataURL(file);
        updatedFile.value = file;
    }
};
const handleSaveContent = (content: string) => {
    editedPost.content = content;
};

const uploadedImages = ref<File[]>([]);
const handlerAddImage = (addedImage: File) => {
    if (addedImage) {
        uploadedImages.value.push(addedImage);
    }
};
const shouldTransformImageUrl = computed(() => {
    return uploadedImages.value.length > 0;
});

const { $storage, $db } = useNuxtApp();
const uiStore = useUIStore();
const { toast } = storeToRefs(uiStore);
const canSubmit = ref(false);
watch(editedPost, (newval) => {
    if (!newval) return;
    toast.value.message = "有變更，可更新";
    toast.value.showToast = true;
    toast.value.messageType = "info";
    canSubmit.value = true;
});
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    const postId = props.post.id;

    if (editedPost.previewImgUrl !== props.post.previewImgUrl) {
        if (updatedFile.value) {
            const storagePath = `/images/posts/${postId}/previewImg`;
            const storageReference = storageRef($storage, storagePath);
            toast.value.message = "正在更新圖片...";
            toast.value.showToast = true;
            toast.value.messageType = "loading";
            try {
                await uploadBytes(storageReference, updatedFile.value);
                const downloadUrl = await getDownloadURL(storageReference);
                editedPost.previewImgUrl = downloadUrl;
            } catch (error: any) {
                toast.value.message = error.message;
                toast.value.showToast = true;
                toast.value.messageType = "error";
                return;
            }
        }
    }

    if (shouldTransformImageUrl.value) {
        // 1. 找出所有editedPost.content中的圖片(img tag class為: editor-image，且src為base64，需比對uploadedImages 的 file)
        const parser = new DOMParser();
        const doc = parser.parseFromString(editedPost.content, "text/html");
        const images = Array.from(
            doc.querySelectorAll(
                "img.editor-image"
            ) as NodeListOf<HTMLImageElement>
        );
        const base64Images = images.filter((img) => {
            return img.src.startsWith("data:image");
        });

        for (const img of base64Images) {
            const file = uploadedImages.value.find((f) =>
                img.src.includes(f.name)
            );
            if (file) {
                const storagePath = `/images/posts/${postId}/content/${file.name}`;
                const storageReference = storageRef($storage, storagePath);

                try {
                    await uploadBytes(storageReference, file);
                    const downloadUrl = await getDownloadURL(storageReference);
                    img.src = downloadUrl;
                } catch (error: any) {
                    toast.value.message = error.message;
                    toast.value.showToast = true;
                    toast.value.messageType = "error";
                    return;
                }
            }
        }

        editedPost.content = doc.documentElement.outerHTML;

        // 4. 檢查storage是否有沒用到的圖片，有的話刪除
        const storageListRef = storageRef(
            $storage,
            `/images/posts/${postId}/content`
        );
        const storageList = await listAll(storageListRef);
        const usedImages = new Set(base64Images.map((img) => img.src));

        for (const item of storageList.items) {
            const downloadUrl = await getDownloadURL(item);
            if (!usedImages.has(downloadUrl)) {
                await deleteObject(item);
            }
        }
    }

    if (!canSubmit.value) {
        toast.value.message = "沒有任何變更";
        toast.value.showToast = true;
        toast.value.messageType = "info";
        return;
    }

    const updatedPost = {
        ...editedPost,
    };
    const postRef = dbRef($db, `posts/${postId}`);
    try {
        toast.value.message = "正在更新文章內容...";
        toast.value.showToast = true;
        toast.value.messageType = "loading";
        await update(postRef, updatedPost);
        toast.value.message = "更新完成!";
        toast.value.showToast = true;
        toast.value.messageType = "success";
    } catch (error: any) {
        toast.value.message = error.message;
        toast.value.showToast = true;
        toast.value.messageType = "error";
    }
};
</script>

<style scoped></style>
