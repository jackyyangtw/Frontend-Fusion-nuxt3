<template>
    <div
        class="mx-2 block my-4 group w-full md:w-[calc(50%-16px)] 2xl:w-[calc(33.333%-24px)] ease-in duration-300 transition relative"
    >
        <transition name="vagueIn">
            <nuxt-link v-if="isMounted" :to="postLink">
                <div
                    class="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700 mx-auto"
                    @mouseenter.self="setShowButtons"
                    @mouseleave.self="setShowButtons"
                >
                    <figure
                        class="post-thumbnail relative h-[200px] xl:h-[250px]"
                    >
                        <img
                            class="object-cover absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
                            :src="cachedPreviewImg"
                            :key="id"
                            width="1792"
                            height="1024"
                            alt=""
                        />
                    </figure>
                    <div
                        class="px-6 py-4 group-hover:bg-sky-500/[.1] dark:group-hover:bg-white/[.1] min-h-[220px] flex flex-col justify-center"
                    >
                        <div>
                            <div class="flex items-center pb-1">
                                <img
                                    class="w-8 h-8 mr-3 rounded-full"
                                    :src="
                                        photoURL ||
                                        require('/static/images/no-user-image.gif')
                                    "
                                    alt="user icon"
                                />
                                <p
                                    class="text-sm text-gray-700 dark:text-white"
                                >
                                    {{ author }} •
                                    {{ dateString }}
                                </p>
                            </div>
                            <h2
                                class="font-bold text-xl mb-2 text-black dark:text-white line-clamp-2"
                            >
                                {{ maxTitleText }}
                            </h2>
                            <p
                                class="text-base pb-1 text-gray-700 dark:text-white line-clamp-2"
                            >
                                {{ maxPreviewText }}
                            </p>
                            <div class="mt-2">
                                <PostBadge
                                    v-for="tag in thisTags"
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
                class="z-10 buttons absolute inset-0 left-0 top-0 flex justify-center items-center bg-black/[0.5] dark:bg-black/[0.7]"
                v-show="onAdminRoute && showButtons"
                @mouseenter.self="setShowButtons"
                @mouseleave.self="setShowButtons"
            >
                <nuxt-link
                    :to="`/admin/${id}`"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
                >
                    編輯
                </nuxt-link>
                <nuxt-link
                    :to="`/posts/${id}`"
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
    id: string;
    title: string;
    previewText: string;
    thumbnail: string;
    tags: string[];
    isAdmin: boolean;
    previewImgUrl?: string;
    index: number;
    updatedDate: string | Date;
    photoURL?: string;
    author: string;
}>();
const isMounted = ref(false);
const showButtons = ref(false);
isMounted.value = true;

const setShowButtons = () => {
    showButtons.value = !showButtons.value;
};

const tagStore = useTagsStore();
const { tags } = storeToRefs(tagStore);
const thisTags = computed(() => {
    return tags.value.filter((tag) => props.tags.includes(tag.name));
});

const handleLoad = (src: string) => {
    // $store.dispatch("image/cacheImage", src);
};

const route = useRoute();
const onAdminRoute = computed(() => {
    return route.path.includes("/admin");
});
const dateString = computed(() => {
    return new Date(props.updatedDate).toLocaleString("zh-TW", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
});
const postLink = computed(() => {
    return props.isAdmin ? "/admin/" + props.id : "/posts/" + props.id;
});
const previewImg = computed(() => {
    return (
        props.previewImgUrl ||
        props.thumbnail ||
        process.env.DEFAULT_PREVIEW_IMG_URL
    );
});

// const imagesStore = useImagesStore();
// const { cachedImages } = storeToRefs(imagesStore);
const cachedPreviewImg = computed(() => {
    return previewImg.value;
});
const maxPreviewText = computed(() => {
    const maxNum = 55;
    if (props.previewText.length >= maxNum) {
        return props.previewText.slice(0, maxNum) + "...";
    }
    return props.previewText;
});
const maxTitleText = computed(() => {
    const maxNum = 50;
    if (props.title.length >= maxNum) {
        return props.title.slice(0, maxNum) + "...";
    }
    return props.title;
});
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
</style>
