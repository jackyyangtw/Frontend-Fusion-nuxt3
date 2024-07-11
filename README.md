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
-   ~~posts/[id] 加上推薦文章~~
-   ~~mobile sidenav list item~~
-   ~~user email login、signup~~
-   ~~刪除 user 功能 (刪除 realtime db posts/[id]/userId 和 storage/user-stickers/[id])~~
-   ~~區分 dev、prod 環境的 firebase~~
-   ~~頭像還沒設定的狀況下，更新後，admin page post 的圖片不會更新~~
-   ~~刪除 user 功能應加上 modal 讓 user 確認~~
-   ~~google login button 如果刪除帳號回到 auth 頁面樣式會消失~~
-   ~~第一次使用網頁須點選一次 mode switcher 才能切換 theme 模式~~
-   文章的 SEO 結構性資料，只要載入後就會出現在每個頁面上，應該要在每個頁面上都有不同的 SEO 結構性資料
-   sidenav lazy load (可能有 CSS 問題)
-   需要安裝 Google Cloud SDK 才能更改 firebase storage CORS

## 優化

-   ~~增加 click 文章圖片後，出現文章圖片的 modal~~
-   ~~component cache :https://nuxt-multi-cache.dulnan.net/overview/introduction~~
-   ~~登入的時候不能點擊登入按鈕~~
-   標題、副標題也應加入 localstorage
-   form content 問題 (如有編輯表單，重整後表單內容雖然在，但不會出現警示視窗)
-   加入 error page
-   posts/[id] 圖片加上 hover 效果
-   post-preview transition
-   PWA

# prod issue

-   ~~deploy 後載入 posts 動畫有問題~~
-   ~~commit 後會失敗，後台 trigger deploy 才有用~~

# Resources

## cursor editor

-   https://www.cursor.com/features

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

## Nuxt Error page

-   https://nuxt.com/docs/guide/directory-structure/error
-   https://ithelp.ithome.com.tw/articles/10338164
-   design https://www.figma.com/community/tag/404%20page/files

# Tips

## deploy to firebase

-   firebase logout: `firebase logout`
-   firebase login: `firebase login`
-   如果遇到 deploy 失敗，可以試著 logout 再 login
-   deploy 需要 $$

## deploy to netlify

-   如要讀取環境變數必須在後台設定
-   如有敏感資訊，例如 service account key，可以透過 netlify 的 env 變數設定

## main 不合併 README.md，但其他檔案可以

-   main/ git merge test-readme --no-commit
-   main/ git checkout HEAD Readme.md
-   main/ git add .
-   main/ git commit -m "..."
-   main/ git push
