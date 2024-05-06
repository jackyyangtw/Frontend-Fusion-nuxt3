export const useTagsStore = defineStore("tags", {
    state: () => ({
        tags: [] as Tag[],
    }),
    actions: {
        async addTag(tagData: Tag) {
            const addedTag = {
                ...tagData,
            };
            try {
                const data = await $fetch(
                    `/tags.json?auth=${vuexContext.rootState.token}`,
                    addedTag
                );
                this.tags.push({ ...addedTag, id: data.name });
            } catch (err) {
                console.log(err);
            }
        },
        async deleteTag(tagId: string) {
            try {
                await this.$axios.$delete(
                    `/tags/${tagId}.json?auth=${vuexContext.rootState.token}`
                );
                await vuexContext.dispatch("getTags");
            } catch (err) {
                console.log(err);
            }
        },
        async getTags() {
            try {
                const data = await $fetch("/api/GET/tags");
                const tagsArray = [];
                for (const key in data) {
                    tagsArray.push({ ...data[key], id: key });
                }
                this.tags = tagsArray;
            } catch (err) {
                console.log(err);
            }
        },
    },
});
