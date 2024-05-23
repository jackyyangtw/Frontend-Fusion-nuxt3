# ISSUE

-   update post 時，content image url 沒有更新、上傳

## VSCODE shortcut

-   https://ithelp.ithome.com.tw/articles/10237385

## nuxtServerInit to nuxt3

-   https://krutiepatel.com/blog/nuxt-server-init-where-is-it-in-nuxt-3/

## nuxt3 repository pattern

-   https://medium.com/@luizzappa/nuxt-3-repository-pattern-organising-and-managing-your-calls-to-apis-with-typescript-acd563a4e046

## nuxt-fire

-   https://medium.com/@jogarcia/set-up-firebase-on-nuxt3-f199cce98dbb

## Design

-   dark glass: https://www.figma.com/design/8Cc64d4jyEkeomprBwFcK5/UI-Design-a-Dark-Mode-NFT-app-(Community)?node-id=60-545&t=XWfNDoToSHAfX5g3-0
-   dark & light: https://www.figma.com/design/t4oMD1FkqSi1pUyjLXj2aA/Glassmorphism-Components-(Community)?node-id=0-1&t=X3y5aZvZ0vS81GkT-0

## 更新文章圖片

-         if (shouldTransformImageUrl.value) {
            // 1. 找出所有editedPost.content中的圖片(img tag class為: editor-image)
            // 2. 將圖片上傳到firebase storage 路徑: /images/posts/postId/content
            // 3. 將editedPost.content中的圖片url轉換成firebase storage的url
            // 4. 檢查storage是否有沒用到的圖片，有的話刪除
    }
