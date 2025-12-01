// ---------------------
// ダークモード切替
// ---------------------
const toggleButton = document.getElementById("modeToggle");

toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if(document.body.classList.contains("dark")){
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});

window.addEventListener("load", () => {
  const savedMode = localStorage.getItem("mode");
  if(savedMode === "dark"){
    document.body.classList.add("dark");
  }
});

// ---------------------
// Firebase 初期化（自分の設定に置き換えてね）
// ---------------------
const firebaseConfig = {
  apiKey: "ここにapiKey",
  authDomain: "ここにauthDomain",
  databaseURL: "ここにdatabaseURL",
  projectId: "ここにprojectId",
  storageBucket: "ここにstorageBucket",
  messagingSenderId: "ここにmessagingSenderId",
  appId: "ここにappId"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ---------------------
// メッセージ送信（簡易例）
// ---------------------
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chatContainer = document.getElementById("chatContainer");

sendBtn.addEventListener("click", () => {
  const text = messageInput.value.trim();
  if(text === "") return;

  // Firebase に書き込む
  db.ref("messages").push({ text });

  // 自分の画面にも表示
  const div = document.createElement("div");
  div.classList.add("message");
  div.textContent = text;
  chatContainer.appendChild(div);

  messageInput.value = "";
});

// ---------------------
// Firebase リアルタイム読み込み
// ---------------------
db.ref("messages").on("child_added", (snapshot) => {
  const data = snapshot.val();
  const div = document.createElement("div");
  div.classList.add("message");
  div.textContent = data.text;
  chatContainer.appendChild(div);
});
