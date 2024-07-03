<template>
    <UserCardSkeleton v-if="loadingCard" />
    <transition name="vagueIn">
        <div
            v-if="!loadingCard && user"
            class="w-full mt-5 max-w-lg mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
        >
            <div class="flex flex-col items-center py-10">
                <div class="relative">
                    <div class="overflow-hidden">
                        <transition name="vagueIn">
                            <img
                                class="w-24 h-24 mb-3 rounded-full"
                                :src="
                                    user?.photoURL ||
                                    '/images/no-user-image.gif'
                                "
                                alt="user photo"
                            />
                        </transition>
                    </div>

                    <form class="absolute right-[-15px] top-[-15px]">
                        <label
                            for="photo"
                            class="cursor-pointer w-12 h-12 bg-black/50 rounded-full shadow-md flex items-center justify-center hover:bg-black/60"
                        >
                            <UIcon
                                name="i-heroicons-pencil"
                                class="w-5 h-5 text-white"
                        /></label>
                        <input
                            id="photo"
                            type="file"
                            accept="image/*"
                            class="absolute top-0 right-0 w-0 h-0 opacity-0"
                            @change="onPhotoChange"
                        />
                    </form>
                </div>

                <h5
                    class="mb-1 text-xl font-medium text-gray-900 dark:text-white"
                >
                    {{ user?.name }}
                </h5>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                    @{{ user?.email ? user?.email.split("@")[0] : "" }}
                </span>
                <div class="flex mt-4 space-x-3 md:mt-6">
                    <AppButton
                        btnStyle="primary"
                        @click="$router.push('/admin/new-post')"
                        >新增文章</AppButton
                    >
                    <div v-if="user?.isManager">
                        <AppButton
                            btnStyle="secondary"
                            @click="$router.push('/admin/manage-tags')"
                            >Tag管理</AppButton
                        >
                    </div>
                    <AppButton btnStyle="danger" @click.prevent="onLogout"
                        >登出</AppButton
                    >
                    <div v-if="!user?.isManager">
                        <AppButton btnStyle="danger" @click.prevent="openModal"
                            >刪除帳號</AppButton
                        >
                    </div>
                </div>
            </div>
        </div>
    </transition>
    <AppModal v-if="isModalOpen" danger title="確認要刪除帳號嗎?">
        <template #body>
            <div>
                <p>帳號刪除後，所有文章也會一併刪除，請確認是否要刪除!</p>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-3">
                <AppButton
                    btnStyle="danger"
                    @click.prevent="DELETEUSER(), closeModal()"
                    >確認</AppButton
                >
                <AppButton btnStyle="primary" @click="isModalOpen = false"
                    >取消</AppButton
                >
            </div>
        </template>
    </AppModal>
</template>

<script setup lang="ts">
import { ref as dbRef, set, get } from "firebase/database";
import {
    ref as storageRef,
    getDownloadURL,
    uploadString,
} from "firebase/storage";
defineProps<{
    loadingCard: boolean;
}>();

const userStore = useUserStore();
const { LOGOUT, DELETEUSER } = userStore;
const { user } = storeToRefs(userStore);
const onLogout = async () => {
    await LOGOUT();
};

const uiStore = useUIStore();
const { toast, isModalOpen } = storeToRefs(uiStore);
const { $storage, $db } = useNuxtApp();
const openModal = () => {
    isModalOpen.value = true;
};
const closeModal = () => {
    isModalOpen.value = false;
};

const postsStore = usePostsStore();
const { loadedPosts } = storeToRefs(postsStore);
const onPhotoChange = async (e: Event) => {
    toast.value.showToast = true;
    toast.value.message = "正在更新頭像...";
    toast.value.messageType = "loading";

    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        if (typeof reader.result !== "string") return;
        const result = reader.result;

        try {
            // Step 1: 將照片上傳到 Firebase Storage
            const storageReference = storageRef(
                $storage,
                `user-sticker/${user.value?.id}`
            );
            await uploadString(storageReference, result, "data_url");

            // Step 2: 從 Firebase Storage 獲取下載 URL
            const downloadURL = await getDownloadURL(storageReference);

            // Step 3: 更新 Firebase Realtime Database 中的 photoURL
            const userRef = dbRef($db, `users/${user.value?.id}/photoURL`);
            await set(userRef, downloadURL);

            // step4: 更新所有 realtime db posts 的 photoURL，realtime db 圖片路徑: posts/[postId].photoURL
            const postRef = dbRef($db, `posts`);
            const snapshot = await get(postRef);
            if (snapshot.exists()) {
                const posts = snapshot.val();
                for (const postId in posts) {
                    if (posts[postId].userId === user.value?.id) {
                        const postPhotoRef = dbRef(
                            $db,
                            `posts/${postId}/photoURL`
                        );
                        await set(postPhotoRef, downloadURL);
                    }
                }
            }

            toast.value.showToast = true;
            toast.value.message = "正在更新文章頭像...";
            toast.value.messageType = "loading";
            loadedPosts.value.forEach((post) => {
                if (post.userId === user.value?.id) {
                    post.photoURL = downloadURL;
                }
            });

            // 更新本地 user store 的 photoURL
            if (user.value) {
                user.value.photoURL = downloadURL;
            }

            toast.value.showToast = true;
            toast.value.message = "頭像更新成功！";
            toast.value.messageType = "success";
        } catch (error) {
            console.error(error);
            toast.value.showToast = true;
            toast.value.message = "頭像更新失敗，請重試。";
            toast.value.messageType = "error";
        }
    };
};
</script>

<style scoped></style>
