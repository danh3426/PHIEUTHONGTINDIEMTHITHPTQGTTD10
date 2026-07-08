document.getElementById("form").addEventListener("submit", function (e) {
  // 1. Ngăn chặn form tải lại trang mặc định
  e.preventDefault();

  // URL Google Apps Script Web App của bạn
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbyj6sgUKdVeZKLKjmLJzrCfM400mkS3XoF4Lx7EUlCS07_DBZ-F2D_ZMfWychQS2hos/exec";

  // 2. Thu thập dữ liệu từ các input và select
  const fullname = document.getElementById("fullname").value.trim();
  const math = document.getElementById("math").value.trim();
  const lite = document.getElementById("lite").value.trim();

  const select1 = document.getElementById("optional_subject1-select");
  const subject1_name = select1.options[select1.selectedIndex].text; // Lấy tên môn (VD: Vật Lý)
  const subject1_mark = document.getElementById("subject1").value.trim();

  const select2 = document.getElementById("optional_subject2-select");
  const subject2_name = select2.options[select2.selectedIndex].text; // Lấy tên môn (VD: Hóa học)
  const subject2_mark = document.getElementById("subject2").value.trim();

  // 3. Kiểm tra validate cơ bản (Tùy chọn: kiểm tra xem đã nhập đủ chưa)
  if (!fullname || !math || !lite) {
    alert("Vui lòng nhập đầy đủ Họ tên, điểm Toán và Ngữ Văn!");
    return;
  }

  // 4. Tạo FormData để gửi lên Google Script
  // Lưu ý: Các 'key' ở đây (như fullname, math,...) phải khớp với cách bạn bắt biến trong hàm doPost() của Google Apps Script
  const formData = new FormData();
  formData.append("fullname", fullname);
  formData.append("math", math);
  formData.append("lite", lite);
  formData.append("subject1_name", select1.value ? subject1_name : "");
  formData.append("subject1_mark", subject1_mark);
  formData.append("subject2_name", select2.value ? subject2_name : "");
  formData.append("subject2_mark", subject2_mark);

  // Đổi trạng thái nút gửi để tránh người dùng bấm liên tục
  const sendButton = document.getElementById("send");
  sendButton.disabled = true;
  sendButton.innerText = "Đang gửi...";

  // 5. Gửi dữ liệu bằng Fetch API
  fetch(scriptURL, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      // 6. Xử lý sau khi gửi thành công
      // Ẩn form đi
      const form = document.getElementById("form");
      form.style.display = "none";

      // 2. Hiển thị khối thông báo thành công
      const announcement = document.querySelector(".annoucement");
      if (announcement) {
        announcement.style.display = "block"; // Trả về block để kích hoạt animation CSS
      }
    })
    .catch((error) => {
      console.error("Lỗi khi gửi dữ liệu:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
      sendButton.disabled = false;
      sendButton.innerText = "Gửi";
    });
});
