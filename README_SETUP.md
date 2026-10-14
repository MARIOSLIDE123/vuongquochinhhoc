# HƯỚNG DẪN THIẾT LẬP GOOGLE SHEETS & GOOGLE APPS SCRIPT
## ỨNG DỤNG "VƯƠNG QUỐC DIỆN TÍCH"

Tài liệu này hướng dẫn chi tiết cách kết nối ứng dụng với một tệp Google Sheets dùng chung duy nhất để lưu trữ hồ sơ học sinh, lịch sử làm bài và tự động cập nhật Bảng Xếp Hạng Toàn Quốc.

---

### BƯỚC 1: TẠO GOOGLE SHEETS MỚI

1. Truy cập [Google Sheets (Trang tính)](https://sheets.new) và tạo một bảng tính mới.
2. Đổi tên bảng tính thành: `Vuong_Quoc_Dien_Tich_Database`.
3. Giữ nguyên tệp, không cần tự tạo các cột thủ công (mã nguồn sẽ tự động tạo cấu trúc chuẩn).

---

### BƯỚC 2: MỞ GOOGLE APPS SCRIPT VÀ DÁN MÃ NGUỒN

1. Trên thanh menu của Google Sheets, chọn: **Tiện ích mở rộng (Extensions)** → **Apps Script**.
2. Một tab trình duyệt mới sẽ mở ra trình soạn thảo mã Apps Script.
3. Xóa toàn bộ mã mặc định trong tệp `Code.gs`.
4. Mở tệp `Code.gs` trong thư mục dự án này, sao chép toàn bộ nội dung và dán vào Apps Script.
5. Nhấn biểu tượng **Lưu (Save)** (hoặc phím tắt `Ctrl + S` / `Cmd + S`).

---

### BƯỚC 3: KHỞI TẠO CÁC BẢNG TÍNH (SETUP SHEETS)

1. Ở thanh công cụ trên cùng của Apps Script, cạnh nút "Chạy" (Run), bấm vào menu chọn hàm và chọn hàm: `setupSheets`.
2. Bấm nút **Chạy (Run)**.
3. Khi Google yêu cầu cấp quyền (Authorization Required):
   - Bấm **Xem xét quyền (Review Permissions)**.
   - Chọn tài khoản Google của bạn.
   - Bấm **Nâng cao (Advanced)** → Bấm **Đi tới... (không an toàn) / Go to project (unsafe)**.
   - Bấm **Cho phép (Allow)**.
4. Sau khi hàm chạy xong, quay lại tab Google Sheets của bạn. Bạn sẽ thấy 4 trang tính được tự động tạo với tiêu đề và định dạng màu xanh chuyên nghiệp:
   - `HOC_SINH`: Danh sách hồ sơ học sinh, điểm tích lũy.
   - `LUOT_TRA_LOI`: Bản ghi từng câu trả lời (có `attemptId` chống ghi trùng).
   - `PHIEN_HOC`: Tổng kết từng buổi học.
   - `XEP_HANG`: Bảng xếp hạng tự động cập nhật theo điểm số thực tế.

---

### BƯỚC 4: TRIỂN KHAI DƯỚI DẠNG ỨNG DỤNG WEB (WEB APP)

1. Ở góc trên cùng bên phải của trang Apps Script, bấm nút màu xanh **Triển khai (Deploy)** → chọn **Tùy chọn triển khai mới (New deployment)**.
2. Nhấn vào biểu tượng bánh răng ⚙️ (chọn loại), chọn: **Ứng dụng web (Web app)**.
3. Cấu hình các mục như sau:
   - **Mô tả (Description)**: `Vuong Quoc Dien Tich v1.0`
   - **Thực thi dưới dạng (Execute as)**: **Tôi (email của bạn)** (*Me*).
   - **Ai có quyền truy cập (Who has access)**: **Bất kỳ ai (Anyone)** *(Rất quan trọng: Phải chọn Anyone để học sinh có thể gửi điểm mà không bắt buộc đăng nhập tài khoản Google)*.
4. Bấm nút **Triển khai (Deploy)**.
5. Sao chép đường dẫn **URL ứng dụng web (Web App URL)** (có định dạng: `https://script.google.com/macros/s/.../exec`).

---

### BƯỚC 5: KẾT NỐI VÀO ỨNG DỤNG "VƯƠNG QUỐC DIỆN TÍCH"

1. Mở ứng dụng "Vương Quốc Diện Tích" trên trình duyệt.
2. Bấm vào biểu tượng **Cài đặt kết nối** ⚙️ ở góc trên bên phải màn hình hoặc trong Bảng xếp hạng.
3. Chuyển sang **Chế độ Google Apps Script**.
4. Dán URL Web App đã sao chép ở Bước 4 vào ô nhập liệu.
5. Bấm nút **Kiểm tra (Test)**:
   - Nếu hiện thông báo xanh: *"Kết nối Google Sheets Web App thành công!"* kèm tên bảng tính của bạn, nghĩa là hệ thống đã hoàn toàn thông suốt!
6. Bấm **Lưu Cấu Hình**.

---

### BƯỚC 6: KIỂM TRA ĐỒNG BỘ THỰC TẾ

1. Đăng ký thông tin 1 học sinh mới (Ví dụ: Nguyễn Minh Anh, Lớp 3A1, Trường Thăng Long).
2. Hoàn thành 1 bài tập.
3. Kiểm tra Google Sheets:
   - Tên học sinh lập tức xuất hiện trong sheet `HOC_SINH`.
   - Kết quả câu trả lời xuất hiện trong `LUOT_TRA_LOI`.
   - Bảng xếp hạng trong sheet `XEP_HANG` và trên giao diện ứng dụng hiển thị điểm số thật được cập nhật!

---

### PHƯƠNG ÁN TRIỂN KHAI TRỰC TIẾP TRONG APPS SCRIPT HTML SERVICE

Nếu bạn muốn chạy toàn bộ ứng dụng web trực tiếp bên trong máy chủ Google Apps Script:
1. Trong trình biên tập Apps Script, bấm dấu `+` cạnh tệp → Chọn **HTML**.
2. Đặt tên tệp là `Index` (Apps Script sẽ tạo `Index.html`).
3. Sao chép nội dung tệp `Index.html` trong dự án này dán vào.
4. Ứng dụng sẽ tự động kích hoạt `google.script.run` nguyên bản mà không cần gọi API qua mạng bên ngoài!
