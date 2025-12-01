// ---------------------
// Firebase モジュール版
// ---------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase 初期化
const firebaseConfig = {
  apiKey: "AIzaSyCEMXXNqQ3U7ojoY9h94X2yeFCJgXNtTwA",
  authDomain: "chatapp-hassu.firebaseapp.com",
  databaseURL: "https://chatapp-hassu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatapp-hassu",
  storageBucket: "chatapp-hassu.firebasestorage.app",
  messagingSenderId: "8489684752",
  appId: "1:8489684752:web:8e3fee02ce385cbda11f95"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ---------------------
// HTML要素
// ---------------------
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chatContainer = document.getElementById("chatContainer");
const toggleButton = document.getElementById("modeToggle");
const body = document.body;

// ---------------------
// ダークモード切替
// ---------------------
toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("mode", body.classList.contains("dark") ? "dark" : "light");
});

window.addEventListener("load", () => {
  if(localStorage.getItem("mode") === "dark"){
    body.classList.add("dark");
  }
});

// ---------------------
// メッセージ送信
// ---------------------
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => { if(e.key === "Enter") sendMessage(); });

function sendMessage() {
  const text = messageInput.value.trim();
  if(!text) return;

  push(ref(db, "messages"), { text });
  messageInput.value = "";
}

// ---------------------
// メッセージ受信（リアルタイム）
// ---------------------
onChildAdded(ref(db, "messages"), snapshot => {
  const data = snapshot.val();
  const div = document.createElement("div");
  div.classList.add("message");
  div.textContent = data.text;
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});
