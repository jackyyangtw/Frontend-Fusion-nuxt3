<template>
    <UForm
        :schema="schema"
        :state="editedPost"
        class="bg-slate-50 dark:bg-slate-950/[0.5] rounded p-5 max-w-[900px] mx-auto flex flex-col gap-5 shadow-md"
        id="post-form"
        @submit="onSubmit"
        @error="onError"
    >
        <UFormGroup label="作者名稱" name="author" id="author-group">
            <UInput color="primary" v-model="editedPost.author" />
        </UFormGroup>
        <UFormGroup label="文章標題" name="title" id="title-group">
            <UInput color="primary" v-model="editedPost.title" />
        </UFormGroup>
        <UFormGroup label="預覽文字" name="previewText" id="previewText-group">
            <UInput color="primary" v-model="editedPost.previewText" />
        </UFormGroup>
        <UFormGroup
            label="預覽縮圖(本地上傳)"
            name="previewImgUrl"
            id="previewImgUrl-group"
        >
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
        <UFormGroup label="文章標籤" name="tags" id="tags-group">
            <div class="flex gap-3 flex-wrap">
                <UCheckbox
                    v-model="editedPost.tags"
                    color="primary"
                    v-for="tag in tags"
                    :key="tag.name"
                    :value="tag.name"
                    :label="tag.name"
                />
            </div>
        </UFormGroup>

        <TiptapEditor
            :editedPost="post"
            @saveContent="handleSaveContent"
            @addImage="handlerAddImage"
        />
        <UButton type="submit" :disabled="errors.length > 0"> Submit </UButton>
    </UForm>
    <AppModal title="尚有未儲存內容!!" danger>
        <template #body>
            <p class="font-semibold"> 確定要離開嗎?離開後會遺失編輯的內容 </p>
        </template>
        <template #footer>
            <div class="flex justify-end gap-3">
                <AppButton btnStyle="danger" @click="leavePage">
                    確定
                </AppButton>
                <AppButton btnStyle="main" @click="stayPage"> 取消 </AppButton>
            </div>
        </template>
    </AppModal>
</template>

<script setup lang="ts">
import { object, string, array, type InferType } from "yup";
import type { FormSubmitEvent, FormError, FormErrorEvent } from "#ui/types";
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
    listAll,
    deleteObject,
} from "firebase/storage";
import { ref as dbRef, update, push, set } from "firebase/database";
const props = defineProps({
    post: {
        type: Object as PropType<Post>,
        required: true,
    },
    newPost: {
        type: Boolean,
        default: false,
    },
});

const tagsStore = useTagsStore();
const { tags } = storeToRefs(tagsStore);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const editedPost = reactive({
    author: user.value?.name || "",
    title: props.post.title || "",
    thumbnail: props.post.thumbnail || "",
    content: props.post.content || "",
    previewText: props.post.previewText || "",
    tags: props.post.tags || [],
    id: props.post.id || "",
    previewImgUrl:
        props.post.previewImgUrl || "/images/post-preview-picture.png",
});
// 監聽 props.post 的變化，並更新 editedPost
watch(
    () => props.post,
    (newPost) => {
        Object.assign(editedPost, newPost); // 保持響應性
    },
    { immediate: true, deep: true }
);

// 判斷是否有未儲存的內容
const uiStore = useUIStore();
const { toast, isModalOpen } = storeToRefs(uiStore);
const shouldSaveContent = ref(false);
const localContent = useLocalStorage("editorContent", "");
let nextRoute: any = null;
const leavePage = () => {
    if (nextRoute) {
        isModalOpen.value = false;
        shouldSaveContent.value = false;
        localContent.value = "";
        nextRoute();
    }
};
const stayPage = () => {
    isModalOpen.value = false;
    shouldSaveContent.value = true;
};
onBeforeRouteLeave((to, from, next) => {
    if (shouldSaveContent.value) {
        isModalOpen.value = true;
        nextRoute = next;
    } else {
        isModalOpen.value = false;
        shouldSaveContent.value = false;
        localContent.value = "";
        next();
    }
});

// emit handler
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
    shouldSaveContent.value = true;
};

const uploadedImages = ref<File[]>([]);
const handlerAddImage = (addedImage: File) => {
    if (addedImage) {
        uploadedImages.value.push(addedImage);
    }
};

// submit
const schema = object({
    author: string().required("Required"),
    title: string().required("Required"),
    previewText: string().required("Required"),
    tags: array().min(1, "至少要有一個標籤"),
});

type Schema = InferType<typeof schema>;
// const validate = (state: any): FormError[] => {
//     const errors = [];
//     if (!state.author) {
//         errors.push({
//             path: "author",
//             message: "作者名稱不能為空",
//         });
//     }
//     if (!state.title) {
//         errors.push({
//             path: "title",
//             message: "文章標題不能為空",
//         });
//     }
//     if (!state.previewText) {
//         errors.push({
//             path: "previewText",
//             message: "預覽文字不能為空",
//         });
//     }
//     if (state.tags.length === 0) {
//         errors.push({
//             path: "tags",
//             message: "至少要有一個標籤",
//         });
//     }
//     return errors;
// };
const shouldTransformImageUrl = computed(() => {
    return uploadedImages.value.length > 0;
});
const { $storage, $db } = useNuxtApp();
const contentChange = ref(false);
watch(editedPost, (newval) => {
    if (!newval) return;
    contentChange.value = true;
});
const postId = props.post.id;
const updateImages = async () => {
    if (editedPost.previewImgUrl !== props.post.previewImgUrl) {
        if (updatedFile.value) {
            const storagePath = `/images/posts/${postId}/previewImg`;
            const storageReference = storageRef($storage, storagePath);
            toast.value.message = props.newPost
                ? "正在新增預覽圖片..."
                : "正在更新預覽圖片...";
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
            const file = uploadedImages.value.find((f) => {
                let fileNameWithoutExtension = fileName(f.name);
                return img.alt === fileNameWithoutExtension;
            });
            if (file) {
                const storagePath = `/images/posts/${postId}/content/${file.name}`;
                const storageReference = storageRef($storage, storagePath);

                try {
                    toast.value.message = props.newPost
                        ? "正在新增文章圖片..."
                        : "正在更新文章圖片...";
                    toast.value.showToast = true;
                    toast.value.messageType = "loading";
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
        toast.value.message = "正在檢查是否有多餘的圖片...";
        toast.value.showToast = true;
        toast.value.messageType = "loading";
        const storageList = await listAll(storageListRef);
        const usedImages = new Set(base64Images.map((img) => img.src));

        for (const item of storageList.items) {
            const downloadUrl = await getDownloadURL(item);
            if (!usedImages.has(downloadUrl)) {
                await deleteObject(item);
            }
        }
    }
};

const postsStore = usePostsStore();
const { loadedPosts } = storeToRefs(postsStore);
const createPost = async () => {
    try {
        // 1. 生成新的文章 ID
        const newPostRef = push(dbRef($db, "posts"));
        const newPostId = newPostRef.key as string;

        // 2. 設置新的文章 ID
        editedPost.id = newPostId;

        // 3. 更新圖片
        await updateImages();

        // 4. 新增文章至 Firebase Realtime Database
        const newPost = {
            ...editedPost,
            updatedDate: new Date().toISOString(),
            photoURL: user.value?.photoURL as string,
            userId: user.value?.id as string,
        };
        await set(newPostRef, newPost);
        loadedPosts.value.push(newPost);

        toast.value.message = "文章新增成功!";
        toast.value.showToast = true;
        toast.value.messageType = "success";

        // 5. 清空表單
        resetForm();
    } catch (error: any) {
        toast.value.message = error.message;
        toast.value.showToast = true;
        toast.value.messageType = "error";
    }
};

const resetForm = () => {
    editedPost.title = "";
    editedPost.previewText = "";
    editedPost.previewImgUrl = "/images/post-preview-picture.png";
    editedPost.tags = [];
    editedPost.content = "";
    updatedFile.value = null;
    uploadedImages.value = [];
    contentChange.value = false;
    shouldSaveContent.value = false;
};

const updatePost = async () => {
    await updateImages();
    const postRef = dbRef($db, `posts/${postId}`);
    try {
        toast.value.message = "正在更新文章內容...";
        toast.value.showToast = true;
        toast.value.messageType = "loading";
        const updatedPost = {
            ...editedPost,
            updatedDate: new Date().toISOString(),
            photoURL: user.value?.photoURL as string,
            userId: user.value?.id as string,
        };
        await update(postRef, updatedPost);
        loadedPosts.value = loadedPosts.value.map((post) => {
            if (post.id === postId) {
                return updatedPost;
            }
            return post;
        });
        toast.value.message = "更新完成!";
        toast.value.showToast = true;
        toast.value.messageType = "success";
        shouldSaveContent.value = false;
    } catch (error: any) {
        toast.value.message = error.message;
        toast.value.showToast = true;
        toast.value.messageType = "error";
    }
};
const errors = ref<FormError[]>([]);
const canSubmit = computed(() => {
    return contentChange.value;
});
const onError = (err: FormErrorEvent) => {
    toast.value.message = "有錯誤發生，請檢查表單";
    toast.value.showToast = true;
    toast.value.messageType = "error";
};
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    if (!canSubmit.value) {
        toast.value.message = "內容沒有任何變更";
        toast.value.showToast = true;
        toast.value.messageType = "info";
        return;
    }

    if (props.newPost) {
        await createPost();
    } else {
        await updatePost();
    }
    localContent.value = editedPost.content;
};
</script>
