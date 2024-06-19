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
                    :key="tag.id"
                    :id="tag.id"
                    :value="tag.name"
                    :label="tag.name"
                />
            </div>
        </UFormGroup>

        <TiptapEditor
            :content="editedPost.content"
            @saveContent="handleSaveContent"
            @addImage="handlerAddImage"
        />
        <div class="flex gap-3">
            <AppButton btnStyle="main" type="submit"> 儲存 </AppButton>
            <AppButton
                v-if="atEditedPage"
                btnStyle="danger"
                type="button"
                @click="openDeleteModal"
            >
                刪除
            </AppButton>
            <AppButton
                v-if="atEditedPage"
                btnStyle="secondary"
                isRouterLink
                :to="`/posts/${post.id}`"
            >
                預覽
            </AppButton>
            <UButton
                class="px-5 py-2.5 font-medium text-base rounded-lg"
                color="white"
                variant="solid"
                @click="goBack"
                >取消</UButton
            >
        </div>
    </UForm>
    <AppModal :title="modalContent.title" danger>
        <template #body>
            <p class="font-semibold"> {{ modalContent.body }} </p>
        </template>
        <template #footer>
            <div class="flex justify-end gap-3">
                <AppButton
                    btnStyle="main"
                    @click="
                        modalContent.mode === 'leave'
                            ? stayPage()
                            : closeModal()
                    "
                >
                    取消
                </AppButton>
                <AppButton
                    btnStyle="danger"
                    @click.prevent="
                        modalContent.mode === 'leave' ? leavePage() : onDelete()
                    "
                >
                    確定
                </AppButton>
            </div>
        </template>
    </AppModal>
</template>

<script setup lang="ts">
import { object, string, array, type InferType } from "yup";
import type { FormSubmitEvent, FormErrorEvent, FormError } from "#ui/types";
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
    listAll,
    deleteObject,
} from "firebase/storage";
import { ref as dbRef, update, push, set, remove } from "firebase/database";
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
// 保持props.post 跟 editedPost 的響應式
watch(
    () => props.post,
    (newPost) => {
        if (props.newPost) return;
        Object.assign(editedPost, newPost); // editedPost = newPost 會導致編輯內容不響應式
    },
    { immediate: true, deep: true }
);

const router = useRouter();
const goBack = () => {
    router.go(-1);
};
const route = useRoute();
const atEditedPage = computed(() => {
    return route.name === "admin-postId";
});

// 判斷是否有未儲存的內容
const uiStore = useUIStore();
const { toast, isModalOpen } = storeToRefs(uiStore);

const shouldSaveContent = ref(false);
const localContent = useLocalStorage("editorContent", "");
const modalContent = reactive({
    title: "",
    body: "",
    mode: "",
});
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
        modalContent.mode = "leave";
        modalContent.title = "尚有未儲存內容!!";
        modalContent.body = "確定要離開嗎?離開後會遺失編輯的內容";
        isModalOpen.value = true;
        nextRoute = next;
    } else {
        isModalOpen.value = false;
        shouldSaveContent.value = false;
        localContent.value = "";
        next();
    }
});

// 點選delete開啟Modal
const openDeleteModal = () => {
    modalContent.mode = "delete";
    modalContent.title = "確定要刪除文章嗎?";
    modalContent.body = "刪除後將無法復原!!";
    isModalOpen.value = true;
};
const closeModal = () => {
    isModalOpen.value = false;
};

// handle preview Img File
const previewImgFile = ref<File | null>(null);
const handleFileChange = (files: FileList) => {
    if (files && files[0]) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            editedPost.previewImgUrl = e.target?.result as string;
        };

        reader.readAsDataURL(file);
        previewImgFile.value = file;
    }
};

// handle save content
const handleSaveContent = (content: string) => {
    editedPost.content = content;
    shouldSaveContent.value = true;
};

// handle add image
const uploadedImages = ref<File[]>([]);
const handlerAddImage = (addedImage: File) => {
    if (addedImage) {
        uploadedImages.value.push(addedImage);
    }
};
const shouldTransformImageUrl = computed(() => {
    return uploadedImages.value.length > 0;
});

// submit
type Schema = InferType<typeof schema>;
const schema = object({
    author: string().required("必填"),
    title: string().required("必填"),
    previewText: string().required("必填"),
    tags: array().min(1, "至少要有一個標籤"),
});
const { $storage, $db } = useNuxtApp();

// 上傳文章圖片
const updateImages = async (postId: string) => {
    if (editedPost.previewImgUrl !== props.post.previewImgUrl) {
        if (previewImgFile.value) {
            const storagePath = `/images/posts/${postId}/previewImg`;
            const storageReference = storageRef($storage, storagePath);
            toast.value.message = props.newPost
                ? "正在新增預覽圖片..."
                : "正在更新預覽圖片...";
            toast.value.showToast = true;
            toast.value.messageType = "loading";
            try {
                await uploadBytes(storageReference, previewImgFile.value);
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

const resetForm = () => {
    editedPost.title = "";
    editedPost.previewText = "";
    editedPost.previewImgUrl = "/images/post-preview-picture.png";
    editedPost.tags = [];
    editedPost.content = "";
    previewImgFile.value = null;
    uploadedImages.value = [];
    shouldSaveContent.value = false;
    localContent.value = "";
};

const postsStore = usePostsStore();
const { loadedPosts, userPosts } = storeToRefs(postsStore);
const createPost = async () => {
    try {
        const newPostRef = push(dbRef($db, "posts"));
        const newPostId = newPostRef.key as string;

        editedPost.id = newPostId;

        await updateImages(newPostId);

        const newPost = {
            ...editedPost,
            updatedDate: new Date().toISOString(),
            photoURL: user.value?.photoURL as string,
            userId: user.value?.id as string,
        };
        await set(newPostRef, newPost);

        // userPosts.value.push(newPost); // 添加新文章到用戶文章列表
        await postsStore.getUserPosts();
        await postsStore.getAllUserPostsCount();

        toast.value.message = "文章新增成功!";
        toast.value.showToast = true;
        toast.value.messageType = "success";

        resetForm();

        setTimeout(() => {
            router.push("/admin");
        }, 2000);
    } catch (error: any) {
        toast.value.message = error.message;
        toast.value.showToast = true;
        toast.value.messageType = "error";
    }
};

const updatePost = async () => {
    const postId = props.post.id;
    await updateImages(postId);
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
        userPosts.value = userPosts.value.map((post) => {
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

const onError = (err: FormErrorEvent) => {
    const { errors } = err;
    toast.value.message = "表單資料不完整，請檢查表單";
    toast.value.showToast = true;
    toast.value.messageType = "error";
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    if (!editedPost.content) {
        toast.value.message = "請檢察表單資料是否完整";
        toast.value.showToast = true;
        toast.value.messageType = "error";
        return;
    }

    if (props.newPost) {
        await createPost();
    } else {
        await updatePost();
    }
    localContent.value = editedPost.content;
};
const onDelete = async () => {
    const postId = props.post.id;
    if (!postId) {
        toast.value.message = "找不到文章 ID";
        toast.value.showToast = true;
        toast.value.messageType = "error";
        return;
    }

    try {
        // 刪除文章預覽圖片
        if (
            editedPost.previewImgUrl &&
            editedPost.previewImgUrl !== "/images/post-preview-picture.png"
        ) {
            toast.value.message = "正在刪除文章預覽圖片...";
            toast.value.showToast = true;
            toast.value.messageType = "loading";
            const previewImgRef = storageRef(
                $storage,
                `/images/posts/${postId}/previewImg`
            );
            await deleteObject(previewImgRef);
        }

        // 刪除文章內容圖片
        toast.value.message = "正在刪除所有文章圖片...";
        toast.value.showToast = true;
        toast.value.messageType = "loading";
        const storageListRef = storageRef(
            $storage,
            `/images/posts/${postId}/content`
        );
        const storageList = await listAll(storageListRef);
        for (const item of storageList.items) {
            await deleteObject(item);
        }

        // 刪除文章資料
        toast.value.message = "正在刪除文章...";
        toast.value.showToast = true;
        toast.value.messageType = "loading";
        const postRef = dbRef($db, `posts/${postId}`);
        await remove(postRef);
        userPosts.value = userPosts.value.filter((post) => post.id !== postId);
        loadedPosts.value = loadedPosts.value.filter(
            (post) => post.id !== postId
        );

        // 顯示刪除成功訊息
        toast.value.message = "文章已成功刪除!";
        toast.value.showToast = true;
        toast.value.messageType = "success";

        // 重置表單
        isModalOpen.value = false;
        resetForm();
        // 導回管理頁面
        router.replace("/admin");
    } catch (error: any) {
        toast.value.message = `刪除文章時發生錯誤: ${error.message}`;
        toast.value.showToast = true;
        toast.value.messageType = "error";
    }
};
</script>
