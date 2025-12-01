// Firebaseモジュールのインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, onDisconnect } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
const auth = getAuth(app);
const db = getDatabase(app);

// ログイン
document.getElementById("login-btn")?.addEventListener("click", ()=>{
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, pass)
    .then(()=>location.href="chat.html")
    .catch(err=>alert(err.message));
});

// 新規登録
document.getElementById("signup-btn")?.addEventListener("click", ()=>{
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, pass)
    .then(userCred=>{
      set(ref(db, "users/" + userCred.user.uid), {
        name: email.split("@")[0],
        online: true
      });
      location.href="chat.html";
    })
    .catch(err=>alert(err.message));
});

// Googleログイン
document.getElementById("google-login-btn")?.addEventListener("click", ()=>{
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(result=>{
      set(ref(db, "users/" + result.user.uid), {
        name: result.user.displayName,
        online: true
      });
      location.href="chat.html";
    })
    .catch(err=>alert(err.message));
});

if (location.pathname.endsWith("chat.html")) {
// チャット画面
onAuthStateChanged(auth, user=>{
  if(!user){ location.href="index.html"; return; }
}

  // オンライン状態
  const userRef = ref(db, "users/" + user.uid + "/online");
  set(userRef, true);
  onDisconnect(userRef).set(false);

  // メッセージ受信
  const messagesDiv = document.getElementById("messages");
  onValue(ref(db, "messages"), snapshot=>{
    messagesDiv.innerHTML = "";
    snapshot.forEach(child=>{
      const data = child.val();
      const div = document.createElement("div");
      div.textContent = `${data.name}: ${data.text}`;
      messagesDiv.appendChild(div);
    });
  });

  // メッセージ送信
  document.getElementById("send-btn").addEventListener("click", ()=>{
    const text = document.getElementById("message-input").value;
    if(text.trim()==="") return;
    push(ref(db, "messages"), {
      name: user.displayName || user.email.split("@")[0],
      text: text,
      timestamp: Date.now()
    });
    document.getElementById("message-input").value="";
  });

  // ユーザー一覧
  const userListDiv = document.getElementById("user-list");
  onValue(ref(db, "users"), snapshot=>{
    userListDiv.innerHTML = "";
    snapshot.forEach(child=>{
      const u = child.val();
      const div = document.createElement("div");
      div.textContent = u.name + (u.online ? " 🟢":" ⚪");
      userListDiv.appendChild(div);
    });
  });

  // ログアウト
  document.getElementById("logout-btn").addEventListener("click", ()=>{
    set(ref(db, "users/" + user.uid + "/online"), false);
    signOut(auth).then(()=>location.href="index.html");
  });
});