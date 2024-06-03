<template>
    <div class="tiptap-editor">
        <div
            class="control-bar rounded bg-slate-50 dark:bg-slate-950/[0]"
            v-if="editor"
        >
            <button
                @click.prevent="toggleLink"
                :class="{ 'is-active': editor.isActive('link') }"
            >
                <UIcon name="i-heroicons-link" />
            </button>
            <button
                @click.prevent="editor.chain().focus().toggleBold().run()"
                :disabled="!editor.can().chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor.isActive('bold') }"
            >
                <UIcon name="i-heroicons-bold" />
            </button>
            <button
                @click.prevent="editor.chain().focus().toggleItalic().run()"
                :disabled="!editor.can().chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor.isActive('italic') }"
            >
                <UIcon name="i-heroicons-italic" />
            </button>
            <button
                @click.prevent="
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                "
                :class="{
                    'is-active': editor.isActive('heading', { level: 2 }),
                }"
            >
                h2
            </button>
            <button
                @click.prevent="
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                "
                :class="{
                    'is-active': editor.isActive('heading', { level: 3 }),
                }"
            >
                h3
            </button>
            <button
                @click.prevent="
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                "
                :class="{
                    'is-active': editor.isActive('heading', { level: 4 }),
                }"
            >
                h4
            </button>
            <button
                @click.prevent="
                    editor.chain().focus().toggleHeading({ level: 5 }).run()
                "
                :class="{
                    'is-active': editor.isActive('heading', { level: 5 }),
                }"
            >
                h5
            </button>
            <button
                @click.prevent="
                    editor.chain().focus().toggleHeading({ level: 6 }).run()
                "
                :class="{
                    'is-active': editor.isActive('heading', { level: 6 }),
                }"
            >
                h6
            </button>
            <button
                @click.prevent="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'is-active': editor.isActive('bulletList') }"
            >
                <UIcon name="i-heroicons-list-bullet" />
            </button>
            <button
                @click.prevent="
                    editor.chain().focus().toggleOrderedList().run()
                "
                :class="{ 'is-active': editor.isActive('orderedList') }"
            >
                <UIcon name="i-la-list-ol" />
            </button>
            <button
                @click.prevent="editor.chain().focus().toggleCodeBlock().run()"
                :class="{ 'is-active': editor.isActive('codeBlock') }"
            >
                <UIcon name="i-heroicons-code-bracket" />
            </button>
            <button @click.prevent="triggerImageFileInput">
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
        <div
            class="editor-container bg-slate-200 dark:bg-slate-900/[0.8] rounded-md"
        >
            <TiptapEditorContent :editor="editor" />
        </div>
    </div>
</template>

<script setup lang="ts">
const lowlight = TiptapcreateLowlight(Tiptapcommon);

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
});

const localContent = useLocalStorage("editorContent", "");
const editor = useEditor({
    content: localContent.value || props.content,
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
const emit = defineEmits(["saveContent", "addImage"]);
const contentChangeCount = ref(0);
watch(
    () => editor.value?.getHTML(),
    (newValue) => {
        contentChangeCount.value++;
        localContent.value = newValue;
        if (contentChangeCount.value > 1) {
            emit("saveContent", newValue);
        }
    }
);

// image
const imageFileInput = ref<HTMLInputElement | null>(null);
const triggerImageFileInput = () => {
    imageFileInput.value?.click();
};

const uiStore = useUIStore();
const { toast } = storeToRefs(uiStore);
const onUploadImgage = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const imageUrl = reader.result as string;
            const fileNameWithoutExtension = fileName(file.name);
            editor.value?.commands.setImage({
                src: imageUrl,
                alt: fileNameWithoutExtension,
            });
            toast.value.message = "需更新圖片";
            toast.value.showToast = true;
            toast.value.messageType = "info";
            emit("addImage", file);
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

onBeforeUnmount(() => {
    if (!editor.value) return;
    unref(editor.value).destroy();
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
.tiptap-editor .editor-container {
    max-height: 600px; /* 設定最大高度 */
    overflow-y: auto; /* 超過最大高度時顯示滾動條 */
}
.tiptap .editor-link {
    @apply text-blue-500;
}
.tiptap .editor-code-block {
    background-color: #0d1117;
    color: white;
    @apply p-5 rounded;
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
.tiptap p {
    min-height: 24px;
}
.tiptap h2,
h3,
h4,
h5,
h6 {
    @apply text-primary-500 font-bold;
}
.tiptap h2 {
    @apply text-2xl;
}
.tiptap h3 {
    @apply text-xl;
}
.tiptap h4 {
    @apply text-lg;
}
.tiptap h5 {
    @apply text-base;
}
.tiptap h6 {
    @apply text-sm;
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
