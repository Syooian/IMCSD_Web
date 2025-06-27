HTML + CSS + JavaScript = HTML5 = Front-end
1. HTML
2. CSS
3. 整合JavaScript

## 前端三大框架 (皆為MVC架構)
1. Vue.js
2. Angular
3. React

## AJAX
HTTP非同步處理技術

## API
跨域存取時可能會遇到伺服器端的存取限制，例如 Client 對 OpenData 的請求。此時可以讓 Client 先向自己的 Server 發送請求，再由 Server 代為向 OpenData 發送請求。  
這是因為 Client 對 Server 的請求與 Server 對 Server 的請求所使用的協定等級不同。

**跨域存取限制**：指的是瀏覽器的同源政策（Same-Origin Policy），限制了前端直接向不同來源的 API 發送請求。  
**解決方式**：透過後端代理（Server-to-Server），後端代替前端向目標 API 發送請求，避免跨域問題。  
**協定等級不同**：瀏覽器的跨域限制主要針對 Client（瀏覽器）發出的請求，而 Server-to-Server 的請求通常不受此限制。