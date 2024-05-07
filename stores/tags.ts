export const useTagsStore = defineStore("tags", () => {
    const tags = ref<Tag[]>([]);

    const getAllTags = async () => {
        try {
            const data = await $fetch<{ [key: string]: Tag }>(
                "/api/realTime/tags",
                {
                    method: "GET",
                }
            );
            const tagsArray = [];
            for (const key in data) {
                tagsArray.push({ ...data[key], id: key });
            }
            tags.value = tagsArray;
        } catch (err) {
            console.log(err);
        }
    };

    return {
        tags,
        getAllTags,
    };
});
