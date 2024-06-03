<template>
    <div
        class="flex flex-auto max-w-full justify-center items-center px-3 transition"
        :class="{
            'scale-110': isFocus,
            'scale-100': !isFocus,
        }"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="w-6 h-6 stroke-slate-600 dark:stroke-white cursor-pointer"
            @click="search"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
        </svg>
        <div
            class="flex-auto max-w-full search-bar text-slate-700 md:max-w-[350px] dark:text-white"
        >
            <input
                class="shadow-md text-slate-700 placeholder-slate-700 dark:placeholder-white dark:text-white dark:focus:text-white"
                type="text"
                placeholder="搜尋"
                v-model="searchText"
                @keyup.enter="search"
                @focus="handleFocus"
                @blur="handleblur"
                ref="searchInput"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const isFocus = ref(false);

const searchInput = ref<HTMLInputElement | null>(null);
const searchStore = useSearchStore();
const { searchText } = storeToRefs(searchStore);
const uiStore = useUIStore();
const router = useRouter();

const route = useRoute();
const searchQuery = computed(() => route.query.search_query as string);

const search = () => {
    if (searchQuery.value === searchText.value) {
        uiStore.setPageLoading(false);
        return;
    }
    uiStore.setPageLoading(true);
    setTimeout(() => {
        router.push({
            name: "search",
            query: { search_query: searchText.value },
        });
        searchInput.value?.blur();
    }, 1000);
};

const handleFocus = () => {
    isFocus.value = true;
};
const handleblur = () => {
    isFocus.value = false;
};
</script>

<style scoped>
.search-bar {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 100;
    box-sizing: border-box;
    padding-left: 10px;
    font-size: 1rem;
    border-radius: 30px;
}

.search-bar input {
    position: relative;
    width: 100%;
    height: 100%;
    outline: none;
    background-color: white;
    font-size: 1.2rem;
    border-radius: 30px;
    padding: 3px;
    padding-left: 20px;
}

/* dark mode */
html.dark .search-bar input {
    background-color: rgba(255, 255, 255, 0.2);
}

.search-bar input::placeholder {
    margin: 0 10px;
    transition: all 0.2s ease-in-out;
    border-radius: 30px;
    padding: 5px;
}
</style>
