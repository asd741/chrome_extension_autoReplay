async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
async function sendMsg(msg) {
    const chatInput = document.querySelector('#chat-input')
    chatInput.innerText = msg
    await wait(1000)
    const sendMsgBtn = document.querySelector('.btn-send')
    sendMsgBtn.click();
}
async function sendResume() {
    const sendResumeBtn = document.querySelector('div[d-c="62009"]');
    sendResumeBtn.click();
    await wait(3000);
    document.querySelector('.resume-list .list-item').click()
    await wait(1000)
    document.querySelector('.btn-confirm').click();
}
async function focusChat() {
    // 關注此對話
    const btn = document.querySelector('.op-settop');
    if (!btn.classList.contains('selected')) {
        btn.click();
    }
}
async function cancelFocusChat() {
    // 取消關注此對話
    const btn = document.querySelector('.op-settop');
    if (btn.classList.contains('selected')) {
        btn.click();
    }
}

async function main() {
    console.log('已開啟boss直聘自動回覆chrome extension');
    const allChats = document.querySelectorAll('.friend-content');
    const unreadChats = Array.prototype.filter.call(allChats, elem => elem.querySelector('.notice-badge'))
    if (!unreadChats.length) {
        // 可能頁面沒加載完
        await wait(1000);
        main();
        return
    }
    for (let i = 0; i < unreadChats.length; i++) {
        const elem = unreadChats[i];
        elem.click()
        await wait(3000)
        const allChatText = document.querySelector('.chat-message').innerText
        if (allChatText.includes('学历') || allChatText.includes('统招')) {
            await cancelFocusChat()
            break;
        }
        const alreadySendResume = allChatText.includes('附件简历请求已发送')
        const cannotSendResume = document.querySelector('div[d-c="62009"]').classList.contains('unable');
        const firstChat = !alreadySendResume && cannotSendResume;
        if (firstChat) {
            await sendMsg('【自动回复】您好，为了节省双方宝贵的时间，请您沟通前可以先看此附件简历，并确保公司没有硬性规定学历为统招的要求。')
            await wait(2000)
            const stillCannotSendResume = document.querySelector('div[d-c="62009"]').classList.contains('unable');
            if (!stillCannotSendResume) {
                await sendResume()
            }
        } else {
            await sendMsg('【自动回复】您好，虽然您的消息被系统已读了，但实际上却是未读，稍后可能会有人前来阅读消息。')
            await focusChat()
        }
    }

}
try {
    main()
} catch (error) {
    console.log(error, 'boss直聘自動回覆報錯');
}

setTimeout(() => {
    // 每隔600秒刷新一次網頁，看有沒有新消息
    location.reload()
}, 600000);