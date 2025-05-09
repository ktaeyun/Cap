// 가상의 이메일 DB
const mockDB = ["aaa@aaa.com", "bbb@bbb.com"];

document.getElementById('email-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;

  // 이메일이 등록되어 있다면 → 로그인
  if (mockDB.includes(email)) {
    // 이메일을 localStorage 등에 저장해 넘기기
    localStorage.setItem("email", email);
    window.location.href = "login.html";
  } else {
    // 새로운 유저 → 회원가입
    localStorage.setItem("email", email);
    window.location.href = "signup.html";
  }
});
