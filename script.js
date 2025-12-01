const toggleButton = document.getElementById("modeToggle");

toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // 現在のモードを localStorage に保存
  if(document.body.classList.contains("dark")){
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});

// ページ読み込み時に前回のモードを復元
window.addEventListener("load", () => {
  const savedMode = localStorage.getItem("mode");
  if(savedMode === "dark"){
    document.body.classList.add("dark");
  }
});
