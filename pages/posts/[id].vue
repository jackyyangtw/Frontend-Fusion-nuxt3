<template>
    <div class="single-post-page container">
        <div
            class="w-full xl:w-[900px] mx-auto backdrop-blur-lg bg-slate-50 dark:bg-slate-950/[0.8] rounded overflow-hidden"
        >
            <section class="post">
                <div class="mb-5 rel lg:min-h-[514px]">
                    <BannerSkeleton
                        v-if="isLoadingBanner"
                        class="w-full h-[300px] md:h-[400px] lg:h-[500px]"
                    />
                    <transition v-else name="fade">
                        <img
                            class="object-cover"
                            alt=""
                            :src="previewImg"
                            fit="cover"
                            width="1792"
                            height="1024"
                        />
                    </transition>
                </div>
                <div class="px-5 py-5 lg:px-10">
                    <div class="flex justify-between">
                        <h1
                            class="post-title text-sky-600 dark:text-pink-400 text-2xl md:text-4xl font-bold pb-2"
                            v-if="loadedPost"
                        >
                            {{ loadedPost.title }}
                        </h1>
                        <nuxt-link
                            v-if="isAuthor"
                            :to="`/admin/${postId}`"
                            aria-label="edit icon"
                        >
                            <label
                                for="photo"
                                class="cursor-pointer w-10 h-10 p-2 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-300"
                            >
                                <img
                                    src="
                                        /public/images/edit-pen-icon.svg
                                    "
                                    alt=""
                                />
                            </label>
                        </nuxt-link>
                    </div>
                    <h2
                        class="post-content text-black dark:text-white text-md md:text-xl font-bold pb-3"
                        v-if="loadedPost"
                    >
                        {{ loadedPost.previewText }}
                    </h2>
                    <div class="post-details mb-5">
                        <div
                            class="text-gray-400 dark:text-gray-500 mr-3"
                            v-if="loadedPost"
                        >
                            更新於 {{ postDate }}
                        </div>
                        <div class="text-gray-400 dark:text-gray-500 mr-5">
                            Written by &nbsp;
                            <a
                                :href="'mailto:' + userEmail"
                                class="italic text-gray-500 dark:text-gray-400 hover:text-gray-600"
                                v-if="loadedPost"
                            >
                                {{ loadedPost.author }}@{{ userEmailMain }}</a
                            >
                        </div>
                    </div>
                    <div class="ql-snow" v-if="loadedPost">
                        <div
                            class="post-content text-slate-950 dark:text-white ql-editor !p-0 !leading-8"
                            v-html="loadedPost.content"
                        ></div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const postId = route.params.id;

const { data: loadedPost } = useFetch<Post>(
    `/api/realTime/post/${route.params.id}`
);

useSchemaOrg([
    defineArticle({
        "@type": "TechArticle",
        datePublished: loadedPost.value?.updatedDate || "",
        headline: loadedPost.value ? loadedPost.value.title : "",
        image: loadedPost.value
            ? loadedPost.value.previewImgUrl || loadedPost.value.thumbnail || ""
            : "",
        description: loadedPost.value ? loadedPost.value.previewText : "",
        author: {
            name: loadedPost.value ? loadedPost.value.author : "",
        },
    }),
]);

useHead({
    title: loadedPost.value ? loadedPost.value.title : "Loading...",
    meta: [
        {
            hid: "description",
            name: "description",
            content: loadedPost.value
                ? loadedPost.value.previewText
                : "Loading...",
        },
        {
            hid: "author",
            name: "author",
            content: loadedPost.value ? loadedPost.value.author : "Loading...",
        },
    ],
});

const isLoadingBanner = ref(true);
onMounted(() => {
    isLoadingBanner.value = false;
});

// const userData = computed(() => {
//     return "";
// });

const userEmailMain = computed(() => {
    return loadedPost.value ? loadedPost.value.author : "";
});
const isAuthor = computed(() => {
    return false;
});
const userEmail = computed(() => {
    return loadedPost.value ? loadedPost.value.author : "";
});

const previewImg = computed(() => {
    return loadedPost.value
        ? loadedPost.value.previewImgUrl || loadedPost.value.thumbnail || ""
        : "/public/images/post-preview-picture.png";
});

const postDate = useDateFormat(
    loadedPost.value?.updatedDate,
    "YYYY-MM-DD HH:mm:ss"
);
</script>

<style scoped>
.single-post-page {
    box-sizing: border-box;
}
@media (min-width: 768px) {
    .single-post-page {
        padding: 30px;
    }
}
.post-title {
    margin: 0;
}

.post-details {
    padding: 5px 0;
    box-sizing: border-box;
    @apply flex flex-col md:flex-row text-sm;
}

@media (min-width: 768px) {
    .post-details {
        flex-direction: row;
    }
}
</style>
