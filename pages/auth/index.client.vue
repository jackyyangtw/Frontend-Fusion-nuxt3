<template>
    <div class="admin-auth-page md:w-[480px] mx-auto">
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
                            >名稱</AppControlInput
                        >
                        <AppControlInput
                            inputType="email"
                            controlType="input"
                            v-model="email"
                            :placeholder="`請輸入您的電子郵件`"
                            >E-Mail</AppControlInput
                        >
                        <AppControlInput
                            inputType="password"
                            controlType="input"
                            v-model="password"
                            :placeholder="`請輸入您的密碼`"
                            >密碼</AppControlInput
                        >
                        <div class="flex gap-x-5">
                            <AppButton
                                class="w-1/2"
                                type="submit"
                                btnStyle="primary"
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
                        btnStyle="danger"
                        class="w-full mt-5 flex justify-center items-center"
                    >
                        <img
                            class="w-[20px] h-[20px] mr-2"
                            src="/images/google-white.svg"
                        />
                        <span>使用Google登入</span>
                    </AppButton>
                </div>
            </div>
        </div>
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

const userStore = useUserStore();

const { isAuthenticated } = storeToRefs(userStore);
const router = useRouter();
if (isAuthenticated.value) {
    router.push("/admin");
}

const { signinWithGoogle, signupWithEmail, signinWithEmail } = userStore;
const onSubmit = async () => {
    try {
        if (!isLoginMode.value) {
            await signupWithEmail(email.value, password.value, name.value);
        } else {
            await signinWithEmail(email.value, password.value);
        }
    } catch (error) {
        console.log(error);
    }
};

const SINGINWITHGOOGLE = async () => {
    signinWithGoogle();
};
</script>

<style scoped></style>
