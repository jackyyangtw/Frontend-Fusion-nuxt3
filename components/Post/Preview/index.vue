<template>
    <div
        class="relative mx-2 block my-4 group w-full md:w-[calc(50%-16px)] 2xl:w-[calc(33.333%-24px)] ease-in duration-300 transition z-0"
        @mouseenter.self="toggleShowButtons"
        @mouseleave.self="toggleShowButtons"
    >
        <PostPreviewSkeleton class="z-0" v-show="isLoadingPost" />
        <transition name="vagueIn">
            <nuxt-link class="z-10" v-show="isPostLoaded" :to="postLink">
                <div
                    class="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700 mx-auto"
                >
                    <figure
                        class="post-thumbnail relative h-[200px] xl:h-[250px]"
                    >
                        <img
                            class="object-cover absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
                            :src="previewImg"
                            :key="post.id"
                            width="1792"
                            height="1024"
                            alt=""
                            :preload="index < 3"
                        />
                    </figure>
                    <div
                        class="px-6 py-4 group-hover:bg-primary-500/[.1] dark:group-hover:bg-white/[.1] min-h-[220px] flex flex-col justify-center"
                    >
                        <div>
                            <div class="flex items-center pb-1">
                                <img
                                    class="w-8 h-8 mr-3 rounded-full"
                                    :src="userPhotoUrl"
                                    alt="user icon"
                                />
                                <p
                                    class="text-sm text-gray-700 dark:text-white"
                                >
                                    {{ post.author }} •
                                    {{ formattedDate }}
                                </p>
                            </div>
                            <h2
                                class="font-bold text-xl mb-2 text-black dark:text-white line-clamp-2"
                            >
                                {{ truncatedTitle }}
                            </h2>
                            <p
                                class="text-base pb-1 text-gray-700 dark:text-white line-clamp-2"
                            >
                                {{ truncatedPreviewText }}
                            </p>
                            <div class="mt-2">
                                <PostBadge
                                    v-for="tag in filteredTags"
                                    :key="tag.id"
                                    :badgeName="tag.name"
                                    :classes="tag.style"
                                ></PostBadge>
                            </div>
                        </div>
                    </div>
                </div>
            </nuxt-link>
        </transition>
        <transition name="fade">
            <div
                class="buttons absolute inset-0 left-0 top-0 flex justify-center items-center bg-black/[0.5] dark:bg-black/[0.7] z-20"
                v-show="onAdminRoute && showButtons"
            >
                <nuxt-link
                    :to="`/admin/${post.id}`"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
                >
                    編輯
                </nuxt-link>
                <nuxt-link
                    :to="`/posts/${post.id}`"
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    前往預覽
                </nuxt-link>
            </div>
        </transition>
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    post: Post;
    isAdmin: boolean;
    index: number;
}>();
const showButtons = ref(false);
const isLoadingPost = ref(true);

const postsStore = usePostsStore();
const { loadedPosts, userPosts } = storeToRefs(postsStore);
const route = useRoute();
const onAdminRoute = computed(() => route.path.includes("/admin"));
const isPostLoaded = computed(() => {
    return onAdminRoute.value
        ? userPosts.value.some((post) => post.id === props.post.id)
        : loadedPosts.value.some((post) => post.id === props.post.id);
});
watchEffect(() => {
    if (isPostLoaded.value) {
        setTimeout(() => (isLoadingPost.value = false), 500);
    }
});
const toggleShowButtons = () => {
    showButtons.value = !showButtons.value;
};

const tagStore = useTagsStore();
const { tags } = storeToRefs(tagStore);
const filteredTags = computed(() =>
    tags.value.filter((tag) => props.post.tags.includes(tag.name))
);

const formattedDate = computed(() =>
    new Date(props.post.updatedDate).toLocaleDateString("zh-TW", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
);
const postLink = computed(() =>
    props.isAdmin ? `/admin/${props.post.id}` : `/posts/${props.post.id}`
);
const userPhotoUrl = computed(
    () => props.post.photoURL || "/images/no-user-image.gif"
);
const previewImg = computed(
    () => props.post.previewImgUrl || "/images/post-preview-picture.png"
);
const truncatedPreviewText = computed(() =>
    props.post.previewText.length > 55
        ? `${props.post.previewText.slice(0, 55)}...`
        : props.post.previewText
);
const truncatedTitle = computed(() =>
    props.post.title.length > 50
        ? `${props.post.title.slice(0, 50)}...`
        : props.post.title
);
</script>

<style scoped>
.post-thumbnail {
    margin: 0;
    width: 100%;
    overflow: hidden;
}

.badge-style {
    @apply text-xs font-medium mr-2 px-2.5 py-0.5 rounded;
}
.vagueIn-enter-from,
.vagueIn-leave-to {
    filter: blur(20px);
    opacity: 0.5;
}

.vagueIn-enter-active,
.vagueIn-leave-active {
    transition: 0.3s;
}
</style>
