function checkName(name) {
  return /^[\p{L}\s]+$/u.test(name);
}
function convertToLanguage(language) {
  if (
    language === "English" ||
    language === "France" ||
    language === "Russia" ||
    language === "China" ||
    language === "Germany" ||
    language === "Japan" ||
    language === "Korean"
  ) {
    return "Language";
  } else return language;
}
//Tự động định dạng số khi nhập input
const mark = document.querySelectorAll(".input_mark");
mark.forEach(function (input) {
  input.addEventListener("input", function (e) {
    let value = input.value.replace(/\./g, "");
    if (!value) {
      input.value = "";
      return;
    }
    if (value.length > 1) {
      value = value.charAt(0) + "." + value.substring(1);
    }
    if (parseFloat(value) >= 10) {
      value = "10";
    }
    input.value = value;
  });
});

function send(e) {
  e.preventDefault();
  let isTrue = false;

  const allAlerts = document.querySelectorAll(".alert");
  allAlerts.forEach((alertBox) => {
    alertBox.style.display = "none";
    alertBox.textContent = "";
  });

  const name = document.getElementById("fullname");
  const math = document.getElementById("math");
  const lite = document.getElementById("lite");
  const optional_subject1 = document.getElementById("optional_subject1-select");
  const optional_subject2 = document.getElementById("optional_subject2-select");
  const subject1 = document.getElementById("subject1");
  const subject2 = document.getElementById("subject2");

  //Điều kiện 1: Tất cả các ô không được trống
  let condition1 = false;
  if (
    name.value.trim() !== "" &&
    math.value !== "" &&
    lite.value !== "" &&
    optional_subject1.value !== "" &&
    optional_subject2.value !== "" &&
    subject1.value !== "" &&
    subject2.value !== ""
  )
    condition1 = true;
  //Điều kiện 2: 2 môn tự chọn không được giống nhau
  let condition2 = optional_subject1.value !== optional_subject2.value;
  //Điều kiện 3: Trong tên không được có ký tự đặc biệt hoặc số
  let condition3 = checkName(name.value);
  //Điều kiện 4: Chỉ được chọn một ngôn ngữ
  let condition4 = !(
    convertToLanguage(optional_subject1.value) === "Language" &&
    convertToLanguage(optional_subject2.value) === "Language"
  );
  if (condition1 && condition2 && condition3 && condition4) isTrue = true;

  //Hiển thị thông báo lỗi
  if (!condition1) {
    const inputList = [
      name,
      math,
      lite,
      optional_subject1,
      optional_subject2,
      subject1,
      subject2,
    ];
    for (let i = 0; i < inputList.length; i++) {
      const element = inputList[i];
      const parent = element.parentElement;
      const alert = parent.querySelector(".alert");
      if (element.value.trim() == "") {
        alert.style.display = "block";
        alert.textContent = "Không được để trống";
      }
    }
  }

  if (
    !condition2 &&
    optional_subject1.value !== "" &&
    optional_subject2.value !== ""
  ) {
    const parent1 = optional_subject1.parentElement;
    const parent2 = optional_subject2.parentElement;
    const alert1 = parent1.querySelector(".alert");
    const alert2 = parent2.querySelector(".alert");
    alert1.style.display = "block";
    alert1.textContent = "Hai môn tự chọn không được giống nhau";
    alert2.style.display = "block";
    alert2.textContent = "Hai môn tự chọn không được giống nhau";
  }

  if (!condition3 && name.value !== "") {
    const nameParent = name.parentElement;
    const nameAlert = nameParent.querySelector(".alert");
    nameAlert.style.display = "block";
    nameAlert.textContent = "Họ tên không được chưa số hay ký tự đặc biệt";
  }
  if (!condition4) {
    optional_subject1.parentElement.querySelector(".alert").style.display =
      "block";
    optional_subject1.parentElement.querySelector(".alert").textContent =
      "Chỉ được phép chọn 1 môn ngoại ngữ";
    optional_subject2.parentElement.querySelector(".alert").style.display =
      "block";
    optional_subject2.parentElement.querySelector(".alert").textContent =
      "Chỉ được phép chọn 1 môn ngoại ngữ";
  }

  if (isTrue) {
    let optional1 = convertToLanguage(optional_subject1.value);
    let optional2 = convertToLanguage(optional_subject2.value);
    var data = {
      name: name.value.trim(),
      math: math.value,
      lite: lite.value,
      optional_subject1_name: optional1,
      optional_subject1_mark: subject1.value,
      optional_subject2_name: optional2,
      optional_subject2_mark: subject2.value,
    };
    fetch(
      "https://script.google.com/macros/s/AKfycbwmRKXA3lhaZf0WLoeEU088ZMBHwVE4LcEnfMfPNRf5EbHBMP7Xf-ZHiO3Sp-viYD8g/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(data),
      },
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          alert("Đã gửi thông tin thành công!");
        } else {
          alert("Có lỗi xảy ra: " + response.message);
        }
      })
      .catch((err) => {
        alert("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng!");
        console.error(err);
      });
    console.log(data);
    const form = document.getElementById("form");
    form.style.display = "none";
    const annoucement = document.getElementById("annoucement");
    annoucement.style.display = "block";
  }
}
//tắt form và hiển thị thông báo
const send_button = document.getElementById("send");
send_button.addEventListener("click", send);
