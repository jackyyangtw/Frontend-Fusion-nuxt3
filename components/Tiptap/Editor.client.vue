<template>
    <div>
        <div
            class="control-bar rounded bg-slate-50 dark:bg-slate-950/[0]"
            v-if="editor"
        >
            <button
                @click="toggleLink"
                :class="{ 'is-active': editor.isActive('link') }"
            >
                <UIcon name="i-heroicons-link" />
            </button>
            <button
                @click="editor.chain().focus().toggleBold().run()"
                :disabled="!editor.can().chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor.isActive('bold') }"
            >
                <UIcon name="i-heroicons-bold" />
            </button>
            <button
                @click="editor.chain().focus().toggleItalic().run()"
                :disabled="!editor.can().chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor.isActive('italic') }"
            >
                <UIcon name="i-heroicons-italic" />
            </button>
            <button
                @click="
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                "
                :class="{
                    'is-active': editor.isActive('heading', { level: 2 }),
                }"
            >
                h2
            </button>
            <button
                @click="
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                "
                :class="{
                    'is-active': editor.isActive('heading', { level: 3 }),
                }"
            >
                h3
            </button>
            <button
                @click="
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                "
                :class="{
                    'is-active': editor.isActive('heading', { level: 4 }),
                }"
            >
                h4
            </button>
            <button
                @click="
                    editor.chain().focus().toggleHeading({ level: 5 }).run()
                "
                :class="{
                    'is-active': editor.isActive('heading', { level: 5 }),
                }"
            >
                h5
            </button>
            <button
                @click="
                    editor.chain().focus().toggleHeading({ level: 6 }).run()
                "
                :class="{
                    'is-active': editor.isActive('heading', { level: 6 }),
                }"
            >
                h6
            </button>
            <button
                @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'is-active': editor.isActive('bulletList') }"
            >
                <UIcon name="i-heroicons-list-bullet" />
            </button>
            <button
                @click="editor.chain().focus().toggleOrderedList().run()"
                :class="{ 'is-active': editor.isActive('orderedList') }"
            >
                <UIcon name="i-la-list-ol" />
            </button>
            <button
                @click="editor.chain().focus().toggleCodeBlock().run()"
                :class="{ 'is-active': editor.isActive('codeBlock') }"
            >
                <UIcon name="i-heroicons-code-bracket" />
            </button>
            <button @click="triggerImageFileInput">
                <UIcon name="i-heroicons-photo" />
            </button>
            <input
                ref="imageFileInput"
                type="file"
                class="hidden"
                @change="onUploadImgage"
                name="photo"
            />
        </div>
        <div class="bg-slate-200 dark:bg-slate-950/[0.8] rounded-md">
            <TiptapEditorContent :editor="editor" />
        </div>
        <button @click.prevent="saveContent">儲存內容</button>
        <AppModal title="尚有未儲存內容!!" danger>
            <template #body>
                <p class="font-semibold">
                    確定要離開嗎?離開後會遺失編輯的內容
                </p>
            </template>
            <template #footer>
                <div class="flex justify-end gap-3">
                    <AppButton btnStyle="danger" @click="leavePage">
                        確定
                    </AppButton>
                    <AppButton btnStyle="main" @click="stayPage">
                        取消
                    </AppButton>
                </div>
            </template>
        </AppModal>
    </div>
</template>

<script setup lang="ts">
const lowlight = TiptapcreateLowlight(Tiptapcommon);

const props = defineProps({
    editedPost: {
        type: Object as PropType<Post>,
        required: true,
    },
});
// onMounted(() => {
//     if (!editor.value) return;
//     unref(editor.value).commands.setContent(props.editedPost.content);
// });

const localContent = useLocalStorage("editorContent", "");
const editor = useEditor({
    content: localContent.value || props.editedPost.content,
    extensions: [
        TiptapStarterKit.configure({
            codeBlock: false,
        }),
        TiptapCodeBlockLowlight.configure({
            lowlight,
            HTMLAttributes: { class: "editor-code-block" },
        }),
        TiptapLink.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: "editor-link",
            },
        }),
        TiptapImage.configure({
            HTMLAttributes: {
                class: "editor-image",
            },
        }),
    ],
});
const shouldSaveContent = ref(false);
const contentChangeCount = ref(0);

watch(
    () => editor.value?.getHTML(),
    (newValue) => {
        localContent.value = newValue;
        contentChangeCount.value++;
        if (contentChangeCount.value > 1) {
            shouldSaveContent.value = true;
        }
    }
);

// image
const imageFileInput = ref<HTMLInputElement | null>(null);
const triggerImageFileInput = () => {
    imageFileInput.value?.click();
};
const onUploadImgage = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            editor.value?.commands.setImage({ src: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
};

// links
const toggleLink = () => {
    if (editor.value?.isActive("link")) {
        unsetLink();
    } else {
        setLink();
    }
};
const unsetLink = () => {
    editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
};
const setLink = () => {
    const previousUrl = editor.value?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
        return;
    }

    // empty
    if (url === "") {
        editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();

        return;
    }

    // update link
    editor.value
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
};

// commit
const emit = defineEmits(["saveContent"]);

const saveContent = () => {
    if (!editor.value) return;
    const content = editor.value.getHTML();
    console.log(content);
    emit("saveContent", content);
};

onBeforeUnmount(() => {
    if (!editor.value) return;
    unref(editor.value).destroy();
});

const uiStore = useUIStore();
const { isModalOpen } = storeToRefs(uiStore);
// isModalOpen.value = true;

const router = useRouter();
const leavePage = () => {
    isModalOpen.value = false;
    shouldSaveContent.value = false;
    localContent.value = "";
    // 放行
    router.go(0);
};
const stayPage = () => {
    isModalOpen.value = false;
    shouldSaveContent.value = true;
};
onBeforeRouteLeave((to, from, next) => {
    if (shouldSaveContent.value) {
        isModalOpen.value = true;
    } else {
        contentChangeCount.value = 0;
        next();
    }
});
</script>

<style scope>
button {
    @apply p-3 shadow bg-slate-50 text-gray-800 hover:bg-primary/[0.2] dark:bg-gray-900 dark:text-white dark:hover:bg-primary/[0.2];
}
button.is-active {
    @apply bg-primary-200 dark:bg-primary-600;
}
</style>

<style>
.tiptap .editor-link {
    @apply text-blue-500;
}
.tiptap .editor-code-block {
    @apply p-5 rounded bg-gray-900;
}
.tiptap {
    @apply p-5;
}
.tiptap ul {
    list-style: disc;
    padding-left: 1rem;
}
.tiptap ol {
    list-style: decimal;
    padding-left: 1rem;
}
.tiptap h2,
h3,
h4,
h5,
h6 {
    @apply text-primary-500;
}
.hljs-property {
    @apply text-white;
}
.javascript {
    @apply text-white;
}
.hljs-keyword {
    color: #f92672;
}
.hljs-title {
    color: #a6e22e;
}
.hljs-attr {
    color: white;
}
</style>
