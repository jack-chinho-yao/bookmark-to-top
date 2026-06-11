let pending = [];  // 用來「存放這批待處理的書籤」
let timerId; // 用來「記住目前的計時器 id」，才能 clearTimeout

const WINDOW_MS = 400; // 時間窗：0.4 秒
const THRESHOLD = 3; // 閾值：超過 3 個就當成匯入

chrome.bookmarks.onCreated.addListener((id, bookmark) => { // 這邊是監聽onCreated所以只有建立書籤才會執行這邊
    // 如果新增的是資料夾(bookmark.url === undefined)直接跳過,
    if(!bookmark.url) return;

    pending.push({id:bookmark.id, parentId: bookmark.parentId});

    clearTimeout(timerId);

    timerId = setTimeout( () => {
        if (pending.length > THRESHOLD){
            console.log("偵測到此批匯入，跳過", pending.length, "筆");
        }else {
            for (let i = 0; i < pending.length; i++) {
                chrome.bookmarks.move(pending[i].id , { parentId: pending[i].parentId, index: 0 });
            }
        }
        pending = [];
    }, WINDOW_MS);

});
