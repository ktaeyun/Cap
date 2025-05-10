// main.js

document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;
  
    if (path.includes("index.html")) initIndexPage();
    else if (path.includes("signup.html")) initSignupPage();
    else if (path.includes("login.html")) initLoginPage();
    else if (path.includes("dashboard.html")) initDashboard();
  });
  
  function initIndexPage() {
    const form = document.getElementById("email-form");
    if (!form) return;
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const users = JSON.parse(localStorage.getItem("users")) || {};
      localStorage.setItem("email", email);
  
      if (users[email]) {
        window.location.href = "login.html";
      } else {
        window.location.href = "signup.html";
      }
    });
  }
  
  function initSignupPage() {
    const email = localStorage.getItem("email");
    document.getElementById("email-info").innerText = `${email} 계정의 정보를 입력해주세요`;
  
    const pwInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirm-password");
    const pwWarning = document.getElementById("pw-warning");
    const confirmWarning = document.getElementById("confirm-warning");
  
    pwInput.addEventListener("input", validatePassword);
    pwInput.addEventListener("keydown", detectCapsLock);
    confirmInput.addEventListener("input", checkPasswordMatch);
  
    const birthYear = document.getElementById("birth-year");
    const birthMonth = document.getElementById("birth-month");
    const birthDay = document.getElementById("birth-day");
  
    birthYear.addEventListener('input', () => {
      if (birthYear.value.length === 4) birthMonth.focus();
    });
  
    birthMonth.addEventListener('input', () => {
      if (birthMonth.value.length === 2) birthDay.focus();
    });
  
    document.getElementById("signup-form").addEventListener("submit", function (e) {
      e.preventDefault();
  
      const name = document.getElementById("name").value;
      const password = pwInput.value;
      const confirmPw = confirmInput.value;
      const gender = document.querySelector('input[name="gender"]:checked').value;
      const birth = `${birthYear.value}-${birthMonth.value}-${birthDay.value}`;
      const agree = document.getElementById("agree").checked;
  
      if (!agree) {
        alert("개인정보 수집 및 이용에 동의해주세요.");
        return;
      }
      if (password !== confirmPw) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      if (password.length < 4 || password.length > 12) {
        alert("비밀번호는 4~12자 사이여야 합니다.");
        return;
      }
  
      const users = JSON.parse(localStorage.getItem("users")) || {};
      users[email] = { name, password, gender, birth };
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("name", name);
  
      window.location.href = "dashboard.html";
    });
  
    function validatePassword() {
      const val = pwInput.value;
      if (val.length < 4 || val.length > 12) {
        pwWarning.innerText = "비밀번호는 4~12자 사이여야 합니다.";
      } else if (/[^a-zA-Z0-9]/.test(val)) {
        pwWarning.innerText = "특수문자는 사용할 수 없습니다.";
      } else {
        pwWarning.innerText = "";
      }
      checkPasswordMatch();
    }
  
    function detectCapsLock(e) {
      if (e.getModifierState("CapsLock")) {
        pwWarning.innerText = "CapsLock이 켜져있습니다.";
      } else {
        validatePassword();
      }
    }
  
    function checkPasswordMatch() {
      if (!confirmInput.value) {
        confirmWarning.innerText = "";
        return;
      }
      if (confirmInput.value !== pwInput.value) {
        confirmWarning.innerText = "비밀번호가 일치하지 않습니다.";
      } else {
        confirmWarning.innerText = "";
      }
    }
  }
  
  function initLoginPage() {
    const email = localStorage.getItem("email");
    document.querySelector('.subtitle').innerText = `${email} 계정의 비밀번호를 입력해주세요`;
  
    document.getElementById("login-form").addEventListener("submit", function(e) {
      e.preventDefault();
      const password = document.getElementById("password").value;
      const users = JSON.parse(localStorage.getItem("users")) || {};
  
      if (!users[email]) {
        alert("존재하지 않는 계정입니다.");
        return;
      }
      if (users[email].password !== password) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
  
      localStorage.setItem("name", users[email].name);
      window.location.href = "dashboard.html";
    });
  }
  
  function initDashboard() {
    const name = localStorage.getItem("name") || "사용자";
    document.getElementById("welcome-msg").innerText = `${name}님, 환영합니다.`;
  
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        window.location.href = "index.html";
      });
    }
  }
  