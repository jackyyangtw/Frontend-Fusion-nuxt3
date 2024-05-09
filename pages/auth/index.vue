<template>
    <div class="admin-auth-page w-[480px]">
        <AppToast
            @closeToast="closeToast"
            :showToast="toast.showToast"
            :type="toast.messageType"
            :message="toast.message"
        />
        <section>
            <div
                class="flex flex-col items-center justify-center px-6 mx-auto h-screen lg:py-0"
            >
                <div
                    class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
                >
                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1
                            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
                        >
                            {{ isLoginMode ? "登入您的帳號" : "註冊新帳號" }}
                        </h1>
                        <form
                            @submit.prevent="onSubmit"
                            class="space-y-4 md:space-y-6"
                        >
                            <AppControlInput
                                v-if="!isLoginMode"
                                inputType="text"
                                controlType="input"
                                v-model="name"
                                :placeholder="`請輸入您的名稱`"
                                :value="name"
                                >名稱</AppControlInput
                            >
                            <AppControlInput
                                inputType="email"
                                controlType="input"
                                v-model="email"
                                :value="email"
                                :placeholder="`請輸入您的電子郵件`"
                                >E-Mail</AppControlInput
                            >
                            <AppControlInput
                                inputType="password"
                                controlType="input"
                                v-model="password"
                                :value="password"
                                :placeholder="`請輸入您的密碼`"
                                >密碼</AppControlInput
                            >
                            <div class="flex gap-x-5">
                                <AppButton
                                    class="w-1/2"
                                    type="submit"
                                    btnStyle="main"
                                >
                                    {{ isLoginMode ? "登入" : "註冊" }}
                                </AppButton>
                                <AppButton
                                    class="w-1/2"
                                    type="button"
                                    btnStyle="secondary"
                                    @click="isLoginMode = !isLoginMode"
                                    >切換至{{
                                        isLoginMode ? "註冊" : "登入"
                                    }}</AppButton
                                >
                            </div>
                        </form>
                        <AppButton
                            @click="SINGINWITHGOOGLE"
                            class="mt-5 flex justify-center items-center bg-red-500 hover:bg-red-600 w-full"
                        >
                            <img
                                class="w-[20px] h-[20px] mr-2"
                                src="/images/google-white.svg
                                "
                            />
                            <div>使用Google登入</div>
                        </AppButton>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: "登入/註冊",
});
const isLoginMode = ref(true);
const name = ref("");
const email = ref("");
const password = ref("");

const uiStore = useUIStore();
const { toast } = storeToRefs(uiStore);
const closeToast = () => {
    toast.value.showToast = false;
};

const authStore = useAuthStore();
// const { isAuthenicated } = storeToRefs(authStore);
const { signinWithGoogle } = authStore;
const onSubmit = async () => {
    toast.value.showToast = true;
    toast.value.messageType = "loading";
    toast.value.message = "Email登入中...";
    // auth
    toast.value.showToast = false;
    toast.value.messageType = "success";
    toast.value.message = "登入成功";
};

const SINGINWITHGOOGLE = async () => {
    toast.value.showToast = true;
    toast.value.messageType = "loading";
    toast.value.message = "Google登入中...";
    // auth
    await signinWithGoogle();
    toast.value.showToast = false;
    toast.value.messageType = "success";
    toast.value.message = "登入成功";
};
</script>

<style scoped></style>
