
chrome.bookmarks.onCreated.addListener((id, bookmark) => { // 這邊是監聽onCreated所以只有建立書籤才會執行這邊
    // 如果新增的是資料夾(bookmark.url === undefined)直接跳過,
    if(!bookmark.url) return;
    chrome.bookmarks.move(bookmark.id, { parentId: bookmark.parentId, index: 0 })
        .catch((err) => console.warn("移動書籤失敗:", err));
});
