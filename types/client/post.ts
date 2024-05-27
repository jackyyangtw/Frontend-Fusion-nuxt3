export interface Post {
    previewText: string;
    id: string;
    title: string;
    thumbnail: string;
    tags: string[];
    previewImgUrl: string;
    updatedDate: string;
    photoURL: string;
    author: string | undefined;
    content: string;
    userId: string;
}
