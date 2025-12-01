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
  apiKey: "AIzaSyCEMXXNqQ3U7ojoY9h94X2yeFCJgXNtTwA",
  authDomain: "chatapp-hassu.firebaseapp.com",
  databaseURL: "https://chatapp-hassu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatapp-hassu",
  storageBucket: "chatapp-hassu.firebasestorage.app",
  messagingSenderId: "8489684752",
  appId: "1:8489684752:web:8e3fee02ce385cbda11f95"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ---------------------
// 要素取得
// ---------------------
const chatContainer = document.getElementById("chatContainer");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// ---------------------
// メッセージ送信
// ---------------------
sendBtn.addEventListener("click", () => {
  const text = messageInput.value.trim();
  if(text === "") return;

  db.ref("messages").push({ text });
  messageInput.value = "";
});

// ---------------------
// メッセージ受信（リアルタイム）
db.ref("messages").on("child_added", snapshot => {
  const data = snapshot.val();
  const div = document.createElement("div");
  div.classList.add("message");
  div.textContent = data.text;
  chatContainer.appendChild(div);
});
