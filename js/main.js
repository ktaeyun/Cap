// main.js

// HTML 페이지 로드 후 실행할 페이지별 초기화 함수 연결

// 경로에 따라 해당 페이지 초기화
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;

  if (path.includes("index.html")) initIndexPage();
  else if (path.includes("signup.html")) initSignupPage();
  else if (path.includes("login.html")) initLoginPage();
  else if (path.includes("dashboard.html")) initDashboard();
  else if (path.includes("analysis.html")) initAnalysisPage(); 
  else if (path.includes("result.html")) initResultPage();
  else if (path.includes("style-recommend.html")) initStyleRecommendPage();
});

// index.html: 이메일 입력 후 기존 회원 여부 확인
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

// signup.html: 회원가입 절차 처리
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

// login.html: 로그인 확인
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

// dashboard.html: 대시보드 표시 및 로그아웃 처리
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

// analysis.html: 분석 요청 및 로딩 처리
function initAnalysisPage() {
  const name = localStorage.getItem("name") || "사용자";
  const nameSpan = document.getElementById("welcome-msg");
  if (nameSpan) {
    nameSpan.innerText = `${name}님, 환영합니다.`;
  }

  // ✅ 로그아웃 버튼 작동
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      window.location.href = "index.html";
    });
  }
  const fileInput = document.getElementById("photo-upload");
  const preview = document.getElementById("preview-container");
  const togglePreviewBtn = document.getElementById("toggle-preview");
  const fileInfo = document.getElementById("file-info");
  const fileList = document.getElementById("file-list");

  let expanded = false;
  let allFiles = [];

  fileInput.addEventListener("change", function () {
    const newFiles = Array.from(this.files);
    const filteredFiles = newFiles.filter(newFile => {
      return !allFiles.some(existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size);
    });

    if (filteredFiles.length < newFiles.length) {
      const warning = document.createElement("div");
      warning.innerText = "⚠️ 중복된 파일은 업로드되지 않았습니다.";
      warning.style.color = "#e74c3c";
      warning.style.fontSize = "13px";
      warning.style.marginTop = "8px";
      fileInput.parentElement.appendChild(warning);
      setTimeout(() => warning.remove(), 3000);
    }

    allFiles = allFiles.concat(filteredFiles);
    renderPreviews();
  });

  // 이미지 썸네일 및 삭제 처리
  function renderPreviews() {
    preview.innerHTML = "";
    fileList.innerHTML = "";

    if (allFiles.length === 0) {
      fileInfo.innerText = "선택된 파일이 없습니다.";
      togglePreviewBtn.style.display = "none";
      return;
    }

    fileInfo.innerText = `총 ${allFiles.length}장의 사진이 업로드되었습니다.`;

    allFiles.forEach((file, index) => {
      const li = document.createElement("li");
      li.innerText = file.name;
      li.classList.add("file-item");
      li.style.display = index >= 3 && !expanded ? "none" : "list-item";
      fileList.appendChild(li);

      const reader = new FileReader();
      reader.onload = (function (fixedIndex) {
        return function (e) {
          const wrapper = document.createElement("div");
          wrapper.style.position = "relative";

          const img = document.createElement("img");
          img.src = e.target.result;
          img.alt = file.name;
          img.classList.add("preview-thumb");
          img.style.display = fixedIndex >= 3 && !expanded ? "none" : "block";
          img.style.width = "100%";
          img.style.borderRadius = "8px";
          img.style.marginTop = "12px";

          const deleteBtn = document.createElement("span");
          deleteBtn.innerText = "✕";
          deleteBtn.style.position = "absolute";
          deleteBtn.style.top = "4px";
          deleteBtn.style.right = "8px";
          deleteBtn.style.background = "rgba(0,0,0,0.5)";
          deleteBtn.style.color = "white";
          deleteBtn.style.borderRadius = "50%";
          deleteBtn.style.padding = "2px 6px";
          deleteBtn.style.cursor = "pointer";
          deleteBtn.style.fontSize = "12px";
          deleteBtn.style.display = fixedIndex >= 3 && !expanded ? "none" : "inline";

          deleteBtn.addEventListener("click", () => {
            allFiles.splice(fixedIndex, 1);
            renderPreviews();
          });

          wrapper.appendChild(img);
          wrapper.appendChild(deleteBtn);
          preview.appendChild(wrapper);
        };
      })(index);
      reader.readAsDataURL(file);
    });

    togglePreviewBtn.style.display = allFiles.length > 3 ? "inline-block" : "none";
  }

  togglePreviewBtn.addEventListener("click", function () {
    expanded = !expanded;
    renderPreviews();
    togglePreviewBtn.innerText = expanded ? "접기" : "더보기";
  });

  // 분석 요청 전송 및 결과 수신 처리
  document.getElementById("analysis-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData();
    allFiles.forEach(file => {
      formData.append("images", file);
    });

    document.getElementById("full-screen-loader").style.display = "flex";

    // 로딩 애니메이션 실행
    lottie.loadAnimation({
      container: document.getElementById("lottie-loader"),
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "https://lottie.host/a689dc5d-4fc2-4357-aa82-b774a2d1fd9f/SPtWeFNp0P.json"
    });

    fetch("http://localhost:8080/analyze", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        document.getElementById("full-screen-loader").style.display = "none";

        if (data.error) {
          alert("❌ 분석 실패: " + data.error);
          loading.remove();
          return;
        }

        // ✅ 결과 저장
        localStorage.setItem("analysisResult", JSON.stringify(data));

        // ✅ 결과 페이지로 이동
        window.location.href = "result.html";
      })
      .catch(err => {
        document.getElementById("full-screen-loader").style.display = "none";
        alert("❌ 서버 오류: " + err.message);
        loading.remove();
      });
  });


}

// result.html: 분석 결과 테이블 생성 및 버튼 연결
function initResultPage() {
  const resultBox = document.getElementById("result-container");
  const data = JSON.parse(localStorage.getItem("analysisResult") || "[]");

  if (!Array.isArray(data) || data.length === 0 || data.error) {
    resultBox.innerHTML = `<p class="error">❌ 분석 결과를 불러올 수 없습니다.</p>`;
  } else {
    resultBox.innerHTML = `
      <table class="result-table">
        <thead>
          <tr>
            <th>이미지</th>
            <th>컬 유형</th>
            <th>손상도</th>
            <th>굵기</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              <td>${row.Image}</td>
              <td>${row.Curl}</td>
              <td>${row.Damage}</td>
              <td>${row.Width}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    // ✅ 버튼 생성 및 예약 페이지로 이동
    const reserveBtn = document.createElement("button");
    reserveBtn.innerText = "💈 미용실 예약하기";
    reserveBtn.className = "primary-btn";
    reserveBtn.style.marginTop = "24px";
    reserveBtn.addEventListener("click", () => {
      window.location.href = "style-recommend.html";
    });


    resultBox.appendChild(reserveBtn);
  }
}

function initStyleRecommendPage() {
  updateUsername(); // 상단 사용자 이름 표시

  const container = document.querySelector(".style-card-list");

  // ✅ 예시 카드 데이터 (나중에 fetch로 교체 가능)
  const styleData = [
    {
      image: "images/style1.jpg",
      features: "곱슬 / 손상모 / 보통",
      title: "시스루 펌",
      designer: "홍예진 실장",
      id: 1
    },
    {
      image: "images/style2.jpg",
      features: "직모 / 건강모 / 얇음",
      title: "내추럴 스트레이트",
      designer: "이수연 디자이너",
      id: 2
    }
    // 추가 가능
  ];

  // ✅ 카드 DOM 구성 및 삽입
  styleData.forEach(style => {
    const card = document.createElement("div");
    card.className = "style-card";
    card.innerHTML = `
      <img src="${style.image}" alt="${style.title}" class="style-img" />
      <div class="style-info">
        <p><strong>헤어 분석:</strong> ${style.features}</p>
        <p><strong>디자인명:</strong> ${style.title}</p>
        <p><strong>디자이너:</strong> ${style.designer}</p>
      </div>
      <button class="primary-btn" onclick="location.href='designer-detail.html?id=${style.id}'">디자이너 보기</button>
    `;
    container.appendChild(card);
  });
}
