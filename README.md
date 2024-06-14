# ISSUE

-   ~~上傳文章圖片後會直接觸發 onsubmit (preventDefault)~~
-   ~~UCheckbox v-for id 全部指向同一個~~
-   ~~刪除 post 功能~~
-   ~~新增 POST~~
-   ~~posts/[id]、admin/[postid] code block css 不同步問題~~
-   ~~search route: /results?search_query=望春風+長榮~~
-   ~~editor code block 的白色文字在 light-mode 會變成黑色，跟背景色一樣~~
-   ~~會員資料修改~~
-   ~~infinite scroll loading (需要改善 list 被重新掛載的問題)~~
-   ~~user posts 應是 user 的 posts，而不是 filter all posts~~
-   ~~createPost 後，admin 沒有新增 post~~
-   ~~tag manage page~~
-   ~~進入 search page 應要載入全部文章，否則會有文章搜尋不到的問題~~
-   如果 form content 沒有變更就不能更新
-   刪除 post 後，再回去新增 post，editor content 會顯示刪除 post 的內容
-   調整首頁 postlist 樣式，為條列式，小張圖片
-   post-preview transition

# prod issue

-   deploy 後載入 posts 動畫有問題
-   commit 後會失敗，後台 trigger deploy 才有用

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

## ICON

-   https://ui.nuxt.com/components/icon
-   https://icones.js.org/collection/heroicons

## deploy to firebase

-   firebase logout: `firebase logout`
-   firebase login: `firebase login`
-   如果遇到 deploy 失敗，可以試著 logout 再 login

## deploy to netlify

-   如要讀取環境變數必須在後台設定
-   如有敏感資訊，例如 service account key，可以透過 netlify 的 env 變數設定
