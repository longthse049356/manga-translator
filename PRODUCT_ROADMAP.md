# 🗺️ Product Roadmap: Manga Translator Tool

**Vision:** Xây dựng công cụ hỗ trợ dịch truyện tranh "All-in-One" hàng đầu, phục vụ từ người đọc nghiệp dư đến các nhóm dịch thuật chuyên nghiệp (Scanlation Teams).

---

## 🚀 Phase 1: Core Value (Hiện tại & Hoàn thiện)
*Mục tiêu: Đảm bảo người dùng có thể dịch, đọc và so sánh truyện một cách mượt mà nhất. Đây là nền tảng để giữ chân user.*

| Chức năng | Mô tả chi tiết | Trạng thái | User | Pricing |
| :--- | :--- | :--- | :--- | :--- |
| **1. Auto Translate (Gemini)** | Tự động nhận diện bóng thoại, xóa chữ gốc và chèn bản dịch tiếng Việt. | ✅ Đã có | All | Free (Limited) |
| **2. Reader View & Compare** | Chế độ xem truyện tối ưu cho desktop. So sánh bản gốc/dịch side-by-side. | ✅ Đã có | All | Free |
| **3. Feedback & Regenerate** | "Click-to-comment" để báo lỗi sai. AI dịch lại trang đó dựa trên feedback. | ✅ Đã có | All | Free |
| **4. Download Results** | Tải ảnh đã dịch về máy (Single hoặc Batch download). | ✅ Đã có | All | Free |
| **5. Smart Image Management** | Upload nhiều ảnh, quản lý theo batch, xóa/retry khi lỗi. | ✅ Đã có | All | Free |
| **6. Series Context (Basic)** | Nhập tên truyện để AI hiểu ngữ cảnh (tên nhân vật, xưng hô, tone). | ✅ Đã có | All | Free |

---

## 🛠️ Phase 2: Enhanced Editor (Tiếp theo)
*Mục tiêu: Biến công cụ từ "xem chơi" thành "công cụ làm việc" thực sự. Giúp user sửa lỗi AI thủ công mà không cần Regenerate tốn kém.*

| Chức năng | Mô tả chi tiết | Độ khó | User | Pricing |
| :--- | :--- | :--- | :--- | :--- |
| **1. Quick Text Editor** 🔥 | Click vào bong bóng thoại -> Hiện ô nhập text đè lên -> Sửa nội dung trực tiếp. Render lại text mới ngay lập tức. | ⭐⭐⭐ | Editor | Free / Freemium |
| **2. Manual Eraser (Brush)** | Công cụ bút xóa (Brush/Eraser) để user tự tô màu nền che đi phần chữ/SFX mà AI bỏ sót. | ⭐⭐ | Cleaner | Free |
| **3. Glossary Management** | User tạo bảng thuật ngữ riêng cho từng bộ truyện (VD: "Nakama" = "Đồng đội"). AI sẽ ưu tiên dùng từ này khi dịch. | ⭐⭐ | Translator | **Premium** 💎 |
| **4. Project Saving** | Lưu lại trạng thái làm việc (ảnh gốc, ảnh dịch, các edit chưa export) vào LocalStorage hoặc Database. | ⭐⭐⭐ | All | Free (Local) / Premium (Cloud) |

---

## 🏢 Phase 3: Professional Studio (Tương lai xa)
*Mục tiêu: Thu hút nhóm dịch chuyên nghiệp và kiếm tiền (Monetization). Cung cấp các tính năng "Power User" mà họ sẵn sàng trả phí.*

| Chức năng | Mô tả chi tiết | Độ khó | User | Pricing |
| :--- | :--- | :--- | :--- | :--- |
| **1. Advanced Typesetting** | Chỉnh sửa Font chữ (upload font riêng), Size, Color, Stroke, Shadow, Vertical Text (chữ dọc). | ⭐⭐⭐⭐ | Typesetter | **Premium** 💎 |
| **2. Export PSD / Layers** | Xuất file Photoshop (.psd) với các layer tách biệt: Ảnh nền (đã clean), Layer Text, Layer SFX. | ⭐⭐⭐⭐⭐ | Pro Editor | **Premium** 💎 |
| **3. In-painting / Redraw** | Chọn vùng ảnh bị mất chi tiết -> AI vẽ lại (Fill) dựa trên ngữ cảnh xung quanh (Content-aware fill). | ⭐⭐⭐⭐ | Cleaner | **Premium** 💎 |
| **4. Team Collaboration** | Mời thành viên vào cùng sửa một project (Google Docs style). Phân quyền: Translator, Editor, QC. | ⭐⭐⭐⭐⭐ | Teams | **Enterprise** 🏢 |

---

## 💰 Monetization Strategy (Chiến lược kiếm tiền)

### 1. Freemium Model
*   **Free Tier:**
    *   Dịch cơ bản (giới hạn số trang/ngày).
    *   Các công cụ chỉnh sửa cơ bản (Text editor).
    *   Download ảnh JPG/PNG.
*   **Premium Tier ($5 - $9/tháng):**
    *   Unlimited dịch.
    *   Glossary Management (Thuật ngữ riêng).
    *   Advanced Typesetting (Font chữ đẹp, Stroke).
    *   Ưu tiên tốc độ xử lý (Fast queue).

### 2. Pay-per-use (Token)
*   Dành cho các tính năng AI đắt đỏ như **In-painting/Redraw** hoặc **Export PSD**.
*   User mua gói Credits để sử dụng khi cần.

---

## 🏗️ Technical Stack Recommendations (Cho Phase 2 & 3)

*   **Canvas Manipulation:** `Fabric.js` hoặc `Konva.js` (để vẽ text, brush, layer trên ảnh).
*   **Image Processing:** `Sharp` (Server-side) hoặc WebGL (Client-side).
*   **State Management:** `Zustand` hoặc `Redux` (quản lý state phức tạp của Editor).
*   **Database:** `PostgreSQL` + `Supabase` (Lưu projects, user data).
*   **Real-time:** `Liveblocks` hoặc `Supabase Realtime` (Cho tính năng Team Collaboration).

