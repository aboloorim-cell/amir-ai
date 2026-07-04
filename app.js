let chats =
    JSON.parse(localStorage.getItem("amirChats")) || [];

let memory =
    JSON.parse(localStorage.getItem("amirMemory")) || {};

let currentChat = -1;

// شروع برنامه
if (chats.length == 0) {
    newChat();
} else {
    loadChatList();
    openChat(0);
}

// ذخیره
function saveAll() {
    localStorage.setItem("amirChats", JSON.stringify(chats));
    localStorage.setItem("amirMemory", JSON.stringify(memory));
}

// چت جدید
function newChat() {

    let chat = {
        title: "چت " + (chats.length + 1),
        messages: [
            {
                type: "bot",
                text: "سلام 😊 من امیر AI هستم."
            }
        ]
    };

    chats.unshift(chat);
    currentChat = 0;

    saveAll();
    loadChatList();
    renderChat();
}

// لیست چت‌ها
function loadChatList() {

    let div = document.getElementById("chatList");
    div.innerHTML = "";

    chats.forEach((chat, index) => {

        div.innerHTML += `
        <div class="chat-item">

            <span onclick="openChat(${index})">
                ${chat.title}
            </span>

            <button
                onclick="deleteChat(${index})"
                style="
                    float:left;
                    background:red;
                    color:white;
                    border:none;
                    border-radius:6px;
                    cursor:pointer;
                    padding:3px 8px;
                ">
                🗑
            </button>

        </div>
        `;
    });
}

// باز کردن چت
function openChat(index) {
    currentChat = index;
    renderChat();
}

// نمایش پیام‌ها
function renderChat() {

    let chat = document.getElementById("chat");
    chat.innerHTML = "";

    chats[currentChat].messages.forEach(msg => {
        chat.innerHTML += `
        <div class="${msg.type}">
            ${msg.text}
        </div>
        `;
    });

    chat.scrollTop = chat.scrollHeight;
}

// حذف چت
function deleteChat(index) {

    chats.splice(index, 1);

    if (chats.length == 0) {
        newChat();
        return;
    }

    if (currentChat >= chats.length) {
        currentChat = chats.length - 1;
    }

    saveAll();
    loadChatList();
    renderChat();
}

// ارسال پیام
function sendMessage() {

    let input = document.getElementById("message");
    let text = input.value.trim();

    if (text == "") return;

    chats[currentChat].messages.push({
        type: "user",
        text: text
    });

    if (chats[currentChat].messages.length == 2) {
        chats[currentChat].title = text.substring(0, 20);
    }

    let answer = answerAI(text);

    chats[currentChat].messages.push({
        type: "bot",
        text: answer
    });

    input.value = "";

    saveAll();
    loadChatList();
    renderChat();
}

// 🧠 هوش مصنوعی + فهم غلط املایی
function answerAI(text) {

    text = normalize(text);

    // یادگیری
    if (text.startsWith("یاد بگیر:")) {

        let d = text.replace("یاد بگیر:", "");
        let p = d.split("=");

        if (p.length == 2) {
            memory[p[0].trim()] = p[1].trim();
            saveAll();
            return "✅ یاد گرفتم";
        }

        return "فرمت اشتباه است";
    }

    // نمایش حافظه
    if (text == "همه چیزهایی که بلدی") {

        let s = "📚 دانسته ها:\n\n";

        for (let k in memory) {
            s += k + " = " + memory[k] + "\n";
        }

        return s;
    }

    // حافظه مستقیم
    if (memory[text]) return memory[text];

    // ماشین حساب
    try {

        let math = text
            .replace(/×/g, "*")
            .replace(/÷/g, "/");

        if (/^[0-9+\-*/(). ]+$/.test(math)) {
            return "🧮 " + eval(math);
        }

    } catch (e) {}

    // تاریخ و ساعت
    if (text.includes("امروز") || text.includes("تاریخ"))
        return "📅 " + new Date().toLocaleDateString("fa-IR");

    if (text.includes("ساعت"))
        return "🕒 " + new Date().toLocaleTimeString("fa-IR");

    // جواب‌های ساده
    if (text.includes("سلام")) return "سلام 😊";
    if (text.includes("خوب")) return "خوبم 😄 تو خوبی؟";
    if (text.includes("اسمت")) return "من امیر AI هستم 🤖";
    if (text.includes("خداحافظ")) return "خداحافظ 👋";

    return "🤖 من هنوز این را یاد نگرفته‌ام.";
}

// 🔥 اصلاح غلط املایی ساده
function normalize(text) {

    return text
        .toLowerCase()
        .replace(/ی/g, "ي")
        .replace(/ك/g, "ک")
        .replace(/خبی/g, "خوبی")
        .replace(/سلاا?م+/g, "سلام")
        .replace(/اسمتت/g, "اسمت");
}