<template>
    <div class="single-post-page container mx-auto z-10 relative">
        <div
            v-if="loadedPost"
            class="w-full xl:w-[900px] mx-auto bg-slate-100 dark:bg-slate-900/80 rounded overflow-hidden"
        >
            <section class="post">
                <div class="mb-5 rel lg:min-h-[514px]">
                    <LazyPostBannerSkeleton
                        v-if="isLoadingBanner"
                        class="w-full h-[300px] md:h-[400px] lg:h-[500px]"
                    />
                    <transition v-else name="fade">
                        <NuxtImg
                            class="object-cover"
                            alt=""
                            :src="previewImg"
                            fit="cover"
                            width="1792"
                            height="1024"
                        />
                    </transition>
                </div>
                <div class="p-5 lg:p-10">
                    <div
                        class="bg-gradient-to-r from-purple-500/20 to-primary-500/20 dark:from-purple-500/30 dark:to-primary-500/30 p-5 rounded-xl mb-5"
                    >
                        <div class="flex justify-between pb-3 gap-3">
                            <h1
                                class="post-title text-primary-500 dark:text-primary-400 text-2xl md:text-4xl font-bold pb-2 m-0"
                                v-if="loadedPost"
                            >
                                {{ loadedPost.title }}
                            </h1>
                            <client-only>
                                <nuxt-link
                                    v-if="isAuthor"
                                    :to="`/admin/${postId}`"
                                    aria-label="edit icon"
                                >
                                    <label
                                        for="photo"
                                        class="cursor-pointer w-12 h-12 bg-black/20 rounded-full shadow-md flex items-center justify-center hover:bg-black/30"
                                    >
                                        <UIcon
                                            name="i-heroicons-pencil"
                                            class="w-5 h-5 text-white"
                                        />
                                    </label>
                                </nuxt-link>
                            </client-only>
                        </div>
                        <h2
                            class="post-content text-black dark:text-white text-md md:text-xl font-bold pb-3"
                            v-if="loadedPost"
                        >
                            {{ loadedPost.previewText }}
                        </h2>
                        <div class="post-details">
                            <div
                                class="text-black dark:text-white mr-3"
                                v-if="loadedPost"
                            >
                                更新於 {{ postDate }}
                            </div>
                            <div class="text-black dark:text-white mr-5">
                                Written by &nbsp;
                                <a
                                    :href="'mailto:' + userEmail"
                                    class="italic text-gray-500 dark:text-gray-400 hover:text-gray-600"
                                    v-if="loadedPost"
                                >
                                    {{ loadedPost.author }}@{{
                                        userEmailMain
                                    }}</a
                                >
                            </div>
                        </div>
                    </div>
                    <div
                        class="ProseMirror tiptap !p-0"
                        v-html="loadedPost.content"
                    ></div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import hljs from "highlight.js";

const route = useRoute();
const postId = route.params.id;

const { data: loadedPost } = await useFetch<Post>(
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
    hljs.highlightAll();
});

const userEmailMain = computed(() => {
    return loadedPost.value ? loadedPost.value.author : "";
});

const user = useCurrentUser();
const isAuthor = computed(() => {
    return user.value?.uid === loadedPost.value?.userId;
});
const userEmail = computed(() => {
    return loadedPost.value ? loadedPost.value.author : "";
});

const previewImg = computed(() => {
    return loadedPost.value
        ? loadedPost.value.previewImgUrl ||
              loadedPost.value.thumbnail ||
              "/images/post-preview-picture.png"
        : "/images/post-preview-picture.png";
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
