<template>
    <UserCardSkeleton v-if="loadingCard" />
    <transition name="vagueIn">
        <div
            v-if="!loadingCard"
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
                            class="cursor-pointer w-10 h-10 p-2 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-300"
                            ><img src="/images/edit-pen-icon.svg" alt=""
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
                        btnStyle="main"
                        @click="$router.push('/admin/new-post')"
                        >新增文章</AppButton
                    >
                    <div v-show="user?.isManager">
                        <AppButton
                            btnStyle="secondary"
                            @click="$router.push('/admin/manage-tags')"
                            >Tag管理</AppButton
                        >
                    </div>
                    <AppButton btnStyle="danger" @click.prevent="onLogout"
                        >登出</AppButton
                    >
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
defineProps<{
    loadingCard: boolean;
}>();

const userStore = useUserStore();
const { googleSignout } = userStore;
const { user } = storeToRefs(userStore);
const onLogout = async () => {
    await googleSignout();
};

const uiStore = useUIStore();
const { toast } = storeToRefs(uiStore);
const onPhotoChange = (e: Event) => {
    toast.value.showToast = true;
    toast.value.message = "正在更新頭像...";
    toast.value.messageType = "loading";

    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = async () => {
    //     if (typeof reader.result !== "string") return;
    //     const result = reader.result;
    //     const Toast: Toast = {
    //         showToast: true,
    //         messageType: "loading",
    //     };
    //     updatePhoto(Toast);
    //     await userStore.updatePhoto(result);
    // };
};
</script>

<style scoped></style>
