// ... existing content (Phase 1 giữ nguyên) ...

---

## 🛠️ Phase 2: Professional Editor Workstation
*Mục tiêu: Xây dựng môi trường chỉnh sửa chuyên nghiệp (Desktop-class Editor) với đầy đủ công cụ cho Translator, Typesetter và Cleaner. Chuyển từ xử lý ảnh phẳng sang xử lý lớp (Layer-based).*

### A. Core Canvas & Viewport
| Chức năng | Mô tả chi tiết | Role | Độ khó |
| :--- | :--- | :--- | :--- |
| **1. Smart Selection** | Tự động phát hiện và chọn Text Box/Bubble khi click vào ảnh (AI Object Detection). | All | ⭐⭐⭐ |
| **2. Infinite Canvas** | Hỗ trợ xem dạng Webtoon (cuộn dọc) hoặc từng trang (Single Page). Zoom/Pan mượt mà không vỡ ảnh. | All | ⭐⭐ |
| **3. Split View / Overlay** | Chế độ so sánh: Chia đôi màn hình (Gốc - Dịch) hoặc Chồng lớp (Overlay) với thanh trượt độ mờ (Opacity) để căn chỉnh vị trí chữ. | QC/Editor | ⭐⭐ |
| **4. Guides & Grids** | Hiển thị đường gióng, lưới thông minh (Snap-to-grid) để căn chỉnh các bóng thoại thẳng hàng. | Typesetter | ⭐⭐ |

### B. Localization & Translation Tools
| Chức năng | Mô tả chi tiết | Role | Độ khó |
| :--- | :--- | :--- | :--- |
| **1. Manual Region Tool** | Vẽ hình chữ nhật/đa giác để tạo vùng dịch mới thủ công (khi AI bỏ sót). | Translator | ⭐⭐ |
| **2. Text Editor (WYSIWYG)** | Trình soạn thảo trực tiếp trên Canvas (Rich Text): Hỗ trợ Emoji, ký tự đặc biệt, xuống dòng tự động. | Translator | ⭐⭐ |
| **3. Translation Assistant** | Gợi ý dịch tự động (Machine Translation) + Gợi ý các phương án dịch khác (Alternative Translations). | Translator | ⭐⭐⭐ |
| **4. Contextual Glossary** | Tự động highlight tên nhân vật/thuật ngữ và gợi ý từ vựng đã lưu trong Glossary của Project. | Translator | ⭐⭐⭐⭐ |

### C. Typesetting Tools (Sắp chữ chuyên nghiệp)
| Chức năng | Mô tả chi tiết | Role | Độ khó |
| :--- | :--- | :--- | :--- |
| **1. Vertical Text Mode** | Hỗ trợ chế độ viết chữ dọc (Top-to-bottom, Right-to-left) chuẩn Manga Nhật/Trung. | Typesetter | ⭐⭐⭐ |
| **2. Auto-Fit / Resize** | Tự động co giãn kích thước chữ để vừa khít với bóng thoại (Best fit). | Typesetter | ⭐⭐⭐ |
| **3. Font Management** | Upload font chữ tùy chỉnh (.ttf, .otf). Quản lý danh sách Font yêu thích. | Typesetter | ⭐⭐ |
| **4. Advanced Styling** | Chỉnh Stroke (Viền chữ), Shadow (Đổ bóng), Glow (Phát sáng). Line-height, Letter-spacing (Kerning/Tracking). | Typesetter | ⭐⭐⭐ |
| **5. Style Presets** | Lưu bộ định dạng (VD: Style "La hét", "Suy nghĩ") để áp dụng nhanh cho nhiều box khác nhau. | Typesetter | ⭐⭐⭐ |

### D. Image Cleaning Tools
| Chức năng | Mô tả chi tiết | Role | Độ khó |
| :--- | :--- | :--- | :--- |
| **1. Manual Brush/Eraser** | Bút vẽ/tẩy cơ bản để tô đè lên text gốc (Cleaner thủ công). | Cleaner | ⭐⭐ |
| **2. Clone Stamp** | Công cụ lấy mẫu từ vùng ảnh bên cạnh để xóa watermark/text trên nền phức tạp. | Cleaner | ⭐⭐⭐⭐ |
| **3. In-painting (AI)** | Chọn vùng -> AI tự động vẽ lại background (Content-aware fill/Generative Fill). | Cleaner | ⭐⭐⭐⭐⭐ |

---

## 🏢 Phase 3: Project Management & Collaboration (Enterprise)
*Mục tiêu: Hỗ trợ quy trình làm việc nhóm (Team Workflow) và quản lý dự án quy mô lớn.*

| Chức năng | Mô tả chi tiết |
| :--- | :--- |
| **1. Project Glossary (Termbase)** | Quản lý từ điển thuật ngữ dùng chung cho cả series. Đảm bảo tính nhất quán (Consistency). |
| **2. Version History** | Lưu lịch sử chỉnh sửa chi tiết. Hỗ trợ Rollback/Restore về phiên bản cũ. |
| **3. Comments & Annotations** | Ghim bình luận trực tiếp lên trang truyện để trao đổi (VD: QC note lỗi cho Translator). |
| **4. Role-based Access Control** | Phân quyền chi tiết: Translator (chỉ sửa text), Cleaner (chỉ sửa ảnh), Admin (toàn quyền). |
| **5. Task Assignment & Status** | Giao việc cho thành viên (Assign task). Theo dõi trạng thái trang (Draft -> Translated -> Typeset -> QC -> Ready). |
| **6. Advanced Export** | Xuất file PSD (Photoshop) giữ nguyên Layer. Xuất PDF chất lượng cao in ấn. Đóng dấu Watermark tự động. |

---

## 💰 Monetization Strategy (Cập nhật)

### 1. Free Tier (Community)
*   Editor cơ bản (Basic Text, Brush).
*   Upload ảnh local.
*   Export ảnh JPG/PNG.

### 2. Pro Tier (Power User - $9/mo)
*   **Typesetting Pro:** Vertical Text, Custom Fonts, Style Presets.
*   **AI Power:** Auto-translate không giới hạn, Smart Selection.
*   **Cloud Save:** Lưu project online.

### 3. Studio Tier (Team - $29/mo)
*   **Collaboration:** Làm việc nhóm, Comment, Phân quyền.
*   **Glossary Management.**
*   **Advanced AI:** In-painting, Clone Stamp, Export PSD.