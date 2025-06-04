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
  else if (path.includes("designer-detail.html")) initDesignerDetailPage();
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
    const validExtensions = ['mp4', 'mov', 'avi'];

    const filteredFiles = newFiles.filter(newFile => {
      const ext = newFile.name.split('.').pop().toLowerCase();
      const isDuplicate = allFiles.some(existingFile =>
        existingFile.name === newFile.name && existingFile.size === newFile.size
      );
      const isValid = validExtensions.includes(ext);

      if (!isValid) {
        alert(`❌ [${newFile.name}]는 허용되지 않은 형식입니다. (.mp4, .mov, .avi만 가능)`);
      }

      return !isDuplicate && isValid;
    });

    if (filteredFiles.length < newFiles.length) {
      const warning = document.createElement("div");
      warning.innerText = "⚠️ 중복 또는 잘못된 파일은 업로드되지 않았습니다.";
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

    fileInfo.innerText = `총 ${allFiles.length}개의 영상이 업로드되었습니다.`;

    allFiles.forEach((file, index) => {
      const li = document.createElement("li");
      li.innerText = file.name;
      li.classList.add("file-item");
      li.style.display = index >= 3 && !expanded ? "none" : "list-item";
      fileList.appendChild(li);

      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";

      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.controls = true;
      video.classList.add("preview-thumb");
      video.style.display = index >= 3 && !expanded ? "none" : "block";
      video.style.width = "100%";
      video.style.borderRadius = "8px";
      video.style.marginTop = "12px";

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
      deleteBtn.style.display = index >= 3 && !expanded ? "none" : "inline";

      deleteBtn.addEventListener("click", () => {
        allFiles.splice(index, 1);
        renderPreviews();
      });

      wrapper.appendChild(video);
      wrapper.appendChild(deleteBtn);
      preview.appendChild(wrapper);
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
      formData.append("videos", file); // ✅ key명을 'videos'로 변경
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

// ✅ 차트 생성 함수
function renderBarChart(canvasId, labels, values, label, color) {
  const maxValue = Math.max(...values);
  const suggestedMax = maxValue < 0.8 ? maxValue + 0.2 : 1.0;

  const backgroundColors = values.map(v =>
    v === maxValue ? shadeColor(color, -20) : color
  );
  const borderColors = values.map(v =>
    v === maxValue ? shadeColor(color, -50) : color
  );
  const fontWeights = values.map(v => v === maxValue ? 'bold' : 'normal');

  new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: values,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
        borderRadius: 8, // Toss 스타일처럼 둥근 막대
        barPercentage: 0.6,
        categoryPercentage: 0.6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${(context.raw * 100).toFixed(1)}%`;
            }
          }
        },
        datalabels: {
          color: '#333',
          anchor: 'end',
          align: 'top',
          font: context => ({
            weight: fontWeights[context.dataIndex],
            size: 14
          }),
          formatter: value => (value * 100).toFixed(1) + '%'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: suggestedMax,
          ticks: {
            stepSize: 0.2,
            font: { size: 12 },
            color: '#999',
            callback: value => (value * 100).toFixed(0) + '%'  
          },
          grid: {
            color: 'rgba(0,0,0,0.05)'
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}


// ✅ 색상 어둡게 (강조)
function shadeColor(color, percent) {
  let f = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!f) return color;
  return `rgba(${f[1] * (1 + percent / 100)}, ${f[2] * (1 + percent / 100)}, ${f[3] * (1 + percent / 100)}, 1)`;
}


// ✅ 'Curl_곱슬' → '곱슬' 형태로 라벨 정리
function cleanLabel(key) {
  return key.split("_")[1];
}

// ✅ 결과 요약
function summarizeTopResults(result) {
  const getTop = (obj) =>
    Object.entries(obj).reduce((a, b) => (b[1] > a[1] ? b : a));

  const [curlKey, curlVal] = getTop(result.Curl);
  const [damageKey, damageVal] = getTop(result.Damage);
  const [widthKey, widthVal] = getTop(result.Width);

  const curlText = `<strong>컬 유형:</strong> ${curlKey} (${curlVal.toFixed(1)}%)`;
  const damageText = `<strong>손상도:</strong> ${damageKey} (${damageVal.toFixed(1)}%)`;
  const widthText = `<strong>굵기:</strong> ${widthKey} (${widthVal.toFixed(1)}%)`;

  const html = `
    <div style="margin-bottom: 8px;">${curlText}</div>
    <div style="margin-bottom: 8px;">${damageText}</div>
    <div>${widthText}</div>
  `;

  const textBox = document.getElementById("summary-text");
  if (textBox) textBox.innerHTML = html;
}




// result.html: 분석 결과 테이블 생성 및 버튼 연결
function initResultPage() {
  const resultBox = document.getElementById("result-container");
  const result = JSON.parse(localStorage.getItem("analysisResult") || "{}");

  if (!result || !result.Curl || !result.Damage || !result.Width) {
    resultBox.innerHTML = `<p class="error">❌ 분석 결과를 불러올 수 없습니다.</p>`;
    return;
  }

  // ✅ 각각 퍼센트 → 소수로 변환 (Chart.js는 0~1 범위로 시각화)
  const curlLabels = Object.keys(result.Curl);
  const curlValues = Object.values(result.Curl).map(v => v / 100);

  const damageLabels = Object.keys(result.Damage);
  const damageValues = Object.values(result.Damage).map(v => v / 100);

  const widthLabels = Object.keys(result.Width);
  const widthValues = Object.values(result.Width).map(v => v / 100);

  renderBarChart("curlChart", curlLabels, curlValues, "컬 유형", "rgba(255, 99, 132, 0.7)");
  renderBarChart("damageChart", damageLabels, damageValues, "손상도", "rgba(54, 162, 235, 0.7)");
  renderBarChart("widthChart", widthLabels, widthValues, "굵기", "rgba(255, 206, 86, 0.7)");

  summarizeTopResults(result);

  const nextBtn = document.getElementById("next-btn");
  if (nextBtn) {
    document.getElementById("next-btn").addEventListener("click", () => {
      window.location.href = "3d/index_3d.html";
    });
  }

}



function initStyleRecommendPage() {
  // ✅ 사용자 이름 표시
  const name = localStorage.getItem("name") || "사용자";
  const nameSpan = document.getElementById("welcome-msg");
  if (nameSpan) {
    nameSpan.innerText = `${name}님, 환영합니다.`;
  }

  // ✅ 로그아웃 버튼 작동
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      window.location.href = "index.html";
    });
  }

  const container = document.querySelector(".style-card-list");

  const styleData = [
    {
      image: "assets/images/style_시스루댄디.jpg",
      features: "반곱슬 / 손상모 / 보통",
      title: "시스루 댄디",
      designer: "민영 팀장",
      shop: "박승철헤어스튜디오 송도국제도시점",
      id: 1
    },

    {
      image: "assets/images/style_쉼표.jpg",
      features: "반곱슬 / 손상모 / 보통",
      title: "가르마 펌",
      designer: "오연중 실장",
      shop: "박승철헤어스튜디오 송도국제도시점",
      id: 2
    },

    {
      image: "assets/images/style_쉐도우-펌.jpg",
      features: "반곱슬 / 손상모 / 보통",
      title: "쉐도우 펌",
      designer: "하은 디자이너",
      shop: "박승철헤어스튜디오 송도국제도시점",
      id: 3
    },

    {
      image: "assets/images/style_드롭.jpg",
      features: "반곱슬 / 손상모 / 보통",
      title: "드롭컷",
      designer: "문 부원장",
      shop: "준오헤어 송도센트럴파크점",
      id: 4
    },

    {
      image: "assets/images/style_가르마.jpg",
      features: "반곱슬 / 손상모 / 보통",
      title: "가르마 펌",
      designer: "민지 실장",
      shop: "준오헤어 송도센트럴파크점",
      id: 5
    },

    {
      image: "assets/images/style_시스루매직.jpg",
      features: "반곱슬 / 손상모 / 보통",
      title: "시스루 매직",
      designer: "더기 디자이너",
      shop: "로이드밤 송도점",
      id: 6
    }


  ];

  styleData.forEach(style => {
    const card = document.createElement("div");
    card.className = "style-card";
    card.innerHTML = `
      <img src="${style.image}" alt="${style.title}" class="style-img" />
      <div class="style-info">
        <p><strong>헤어 분석:</strong> ${style.features}</p>
        <p><strong>디자인명:</strong> ${style.title}</p>
        <p><strong>디자이너:</strong> ${style.designer}</p>
        <p><strong>헤어숍:</strong> ${style.shop}</p>
      </div>
      <button class="primary-btn" onclick="location.href='designer-detail.html?id=${style.id}'">디자이너 보기</button>
    `;
    container.appendChild(card);
  });
}

function initDesignerDetailPage() {
  const name = localStorage.getItem("name") || "사용자";
  const welcome = document.getElementById("welcome-msg");
  if (welcome) welcome.innerText = `${name}님, 환영합니다.`;

  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get("id"));
  const box = document.getElementById("designer-detail-box");

  const designers = [
    {
      id: 1,
      name: "민영 팀장",
      image: "assets/images/디자이너.jpg",
      shop: "박승철헤어스투디오 송도국제도시점",
      tag: "인기스타일리스트 · 최근 123건 시술",
      instagram: "http://www.instagram.com/_minyoung_d",
      highlights: [
        "[수석 민영팀장 첫방문 20% 할인] (비할인 품목 제외)",
        "[네이버 1위] - 송도 미용실 인기스타일리스트",
        "시술 만족도 1%",
        "퍼스널 컬러 디자인 전문",
        "남자 헤어스타일 전문",
        "레이어드펌 전문",
        "저만의 감성으로 고객님의 니즈에 맞는 스타일을 찾아드리겠습니다."
      ],
      career: [
        "박승철 수석 팀장",
        "박승철 2016 최종승급제 통과",
        "박승철 전과정 교육 이수 (트리콜로지, 서비스, 펌, 컬러, 드라이, 커트)",
        "박승철 아카데미 프리미엄 헤어살롱 교육 이수",
        "로레알 컬러 디플로마 수료",
        "웰라 컬러 디플로마 수료",
        "밀본 컬러 디플로마 수료",
        "케라스타즈 두피 스파 클리닉 교육 이수",
        "※ 매주 월요일 휴무입니다."
      ],
      bookingUrl: "https://booking.naver.com/booking/13/bizes/198891"
    }
    // 다른 디자이너 추가 가능
  ];

  const data = designers.find(d => d.id === id);

  if (!data) {
    box.innerHTML = `<p class="error">❌ 해당 디자이너 정보를 찾을 수 없습니다.</p>`;
    return;
  }

  box.innerHTML = `
    <div class="designer-header">
      <img src="${data.image}" alt="${data.name}" class="designer-photo" />
      <div class="designer-name">${data.name}</div>
      <div class="designer-shop">${data.shop}</div>
      <div class="designer-tag">#${data.tag}</div>
      <a href="${data.instagram}" class="sns-link" target="_blank">${data.instagram}</a>
    </div>

    <div class="designer-body">
      ${data.highlights.map(p => `<p>${p}</p>`).join("")}
      <br/>
      ${data.career.map(p => `<p>${p}</p>`).join("")}
    </div>
  `;

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      window.location.href = "index.html";
    });
  }
}

// 상담 모달 열기 및 닫기 함수
function openConsultModal() {
  document.getElementById("consult-modal").style.display = "flex";
}

function closeConsultModal() {
  document.getElementById("consult-modal").style.display = "none";
}

// 사용자 이름 자동 입력
window.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("name") || "사용자";
  const nameField = document.getElementById("user-name");
  if (nameField) nameField.value = name;
    // ✅ 전화번호 자동 포커스 이동
    ["user-phone1", "user-phone2"].forEach((id, i) => {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener("input", function () {
          if (this.value.length === this.maxLength) {
            const next = document.getElementById(`user-phone${i + 2}`);
            if (next) next.focus();
          }
        });
      }
    });
  const form = document.getElementById("consult-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const agree3d = document.getElementById("agree-3d");
      const agreePrivacy = document.getElementById("agree-privacy");

      if (!agree3d.checked) {
        alert("3D 모델링 전송에 동의해야 상담을 신청할 수 있습니다.");
        return;
      }

      if (!agreePrivacy.checked) {
        alert("개인정보 수집 및 이용에 동의해야 상담을 신청할 수 있습니다.");
        return;
      }

      // ✅ 실제 제출 처리 (서버 연동 또는 알림 등)
      alert("✅ 상담 신청이 완료되었습니다. 디자이너가 확인 후 연락드릴 예정입니다.");
      closeConsultModal();
    });
  }
});
document.getElementById("consult-message").placeholder =
  "상담 요청 내용\nex. 시술 이력, 원하는 디자인 등";

