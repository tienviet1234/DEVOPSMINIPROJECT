const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak, Header, Footer, PageNumber
} = require('docx');
const fs = require('fs');

// ── Helpers ────────────────────────────────────────────────────────────────
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 100, bottom: 100, left: 150, right: 150 };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, size: 32, color: "1F3A8A" })]
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26, color: "2563EB" })]
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text, bold: true, size: 22, color: "374151" })]
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, ...opts })]
  });
}
function pBold(label, value) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [
      new TextRun({ text: label + ": ", bold: true, size: 22 }),
      new TextRun({ text: value, size: 22 })
    ]
  });
}
function code(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
    indent: { left: 400 },
    children: [new TextRun({ text, font: "Courier New", size: 18, color: "1E3A5F" })]
  });
}
function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 22 })]
  });
}
function spacer() {
  return new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] });
}
function divider() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "DBEAFE" } },
    children: [new TextRun("")]
  });
}
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}
function makeTable(headers, rows, colWidths) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      borders,
      width: { size: colWidths[i], type: WidthType.DXA },
      margins: cellMargins,
      shading: { type: ShadingType.CLEAR, fill: "1F3A8A" },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF" })]
      })]
    }))
  });
  const bodyRows = rows.map(row => new TableRow({
    children: row.map((cell, i) => new TableCell({
      borders,
      width: { size: colWidths[i], type: WidthType.DXA },
      margins: cellMargins,
      children: [new Paragraph({
        children: [new TextRun({ text: cell, size: 20 })]
      })]
    }))
  }));
  return new Table({
    width: { size: colWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...bodyRows]
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }
        ]
      }
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22 } }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1260, bottom: 1440, left: 1260 }
      }
    },
    children: [
      // ─── COVER ──────────────────────────────────────────────────────────
      spacer(), spacer(), spacer(), spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 120 },
        children: [new TextRun({ text: "TRƯỜNG ĐẠI HỌC ...", size: 22, color: "6B7280" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 400 },
        children: [new TextRun({ text: "KHOA CÔNG NGHỆ THÔNG TIN", size: 22, color: "6B7280" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: "1F3A8A" } },
        spacing: { before: 0, after: 480 },
        children: [new TextRun("")]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "BÁO CÁO", size: 48, bold: true, color: "6B7280" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 120 },
        children: [new TextRun({ text: "DEVOPS MINI PROJECT", size: 52, bold: true, color: "1F3A8A" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 600 },
        children: [new TextRun({ text: "Task Manager Application", size: 30, color: "374151", italics: true })]
      }),
      spacer(), spacer(), spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "Sinh viên: Nguyễn Văn A", size: 24, bold: true })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "MSSV: 21IT000001", size: 24 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "Lớp: CNTT21A", size: 24 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 0 },
        children: [new TextRun({ text: "Năm học 2024 – 2025", size: 22, color: "6B7280" })]
      }),
      pageBreak(),

      // ─── PHẦN A: THÔNG TIN CHUNG ─────────────────────────────────────────
      h1("PHẦN A: THÔNG TIN CHUNG"),
      divider(),

      h2("1. Thông Tin Sinh Viên"),
      makeTable(
        ["Thông tin", "Chi tiết"],
        [
          ["Họ và tên", "Nguyễn Văn A"],
          ["Mã số sinh viên", "21IT000001"],
          ["Lớp", "CNTT21A"],
          ["Môn học", "DevOps Fundamentals"],
          ["Năm học", "2024 – 2025"],
        ],
        [4200, 5226]
      ),
      spacer(),

      h2("2. Giới Thiệu Ứng Dụng"),
      h3("2.1 Mục đích"),
      p("TaskFlow là ứng dụng quản lý công việc cá nhân (To-do / Task Manager) giúp người dùng tạo, theo dõi và hoàn thành các nhiệm vụ hàng ngày. Ứng dụng được xây dựng như một bài tập thực hành DevOps, tích hợp đầy đủ quy trình từ phát triển đến triển khai."),
      h3("2.2 Người dùng mục tiêu"),
      bullet("Sinh viên cần theo dõi bài tập, deadline"),
      bullet("Cá nhân muốn tổ chức công việc hàng ngày"),
      bullet("Nhóm nhỏ cần quản lý task đơn giản"),
      h3("2.3 Phạm vi"),
      bullet("Quản lý task: Tạo, xem, cập nhật, xóa (CRUD)"),
      bullet("Phân loại mức độ ưu tiên: High / Medium / Low"),
      bullet("Dashboard thống kê tổng quan"),
      bullet("Trang thông tin sinh viên (/about)"),
      bullet("Health check endpoint (/health)"),
      spacer(),

      h2("3. Tính Năng"),
      makeTable(
        ["#", "Tính năng", "Mô tả"],
        [
          ["1", "Quản lý Task", "Tạo, xem danh sách, đánh dấu hoàn thành, xóa task"],
          ["2", "Phân loại ưu tiên", "3 mức: High (đỏ), Medium (vàng), Low (xanh)"],
          ["3", "Dashboard Stats", "Hiển thị tổng số, đã xong, đang chờ, khẩn cấp"],
          ["4", "Trang /about", "Hiển thị thông tin sinh viên từ env variables"],
          ["5", "Endpoint /health", "Trả về {\"status\": \"ok\"} kiểm tra uptime"],
          ["6", "Responsive UI", "Giao diện dark mode, tối ưu mobile/desktop"],
          ["7", "REST API", "6 endpoints RESTful đầy đủ"],
          ["8", "Database", "MongoDB lưu trữ persistent với Docker volume"],
        ],
        [600, 3200, 5626]
      ),
      spacer(),

      h2("4. Use Cases"),
      h3("UC01 — Tạo task mới"),
      bullet("Actor: Người dùng"),
      bullet("Trigger: Nhấn nút \"Add Task\""),
      bullet("Input: Tiêu đề (bắt buộc), mô tả, mức ưu tiên"),
      bullet("Output: Task được lưu vào MongoDB, hiển thị trong danh sách"),
      spacer(),
      h3("UC02 — Xem danh sách task"),
      bullet("Actor: Người dùng"),
      bullet("Trigger: Truy cập trang Tasks"),
      bullet("Output: Danh sách task sắp xếp mới nhất, kèm stats"),
      spacer(),
      h3("UC03 — Hoàn thành / Mở lại task"),
      bullet("Actor: Người dùng"),
      bullet("Trigger: Nhấn nút checkmark hoặc ✓"),
      bullet("Output: Trạng thái task được cập nhật, stats cập nhật"),
      spacer(),
      h3("UC04 — Xóa task"),
      bullet("Actor: Người dùng"),
      bullet("Trigger: Nhấn nút ✕ và xác nhận"),
      bullet("Output: Task bị xóa khỏi DB và danh sách"),
      spacer(),
      h3("UC05 — Kiểm tra sức khỏe hệ thống"),
      bullet("Actor: DevOps / Monitoring tool"),
      bullet("Trigger: HTTP GET /health"),
      bullet("Output: {\"status\": \"ok\", \"app\": \"TaskManager\", \"timestamp\": \"...\"}"),
      pageBreak(),

      // ─── PHẦN B: MINH CHỨNG ──────────────────────────────────────────────
      h1("PHẦN B: MINH CHỨNG"),
      divider(),

      h2("1. Repository GitHub"),
      p("Link GitHub Repository:"),
      new Paragraph({
        spacing: { before: 80, after: 80 },
        shading: { type: ShadingType.CLEAR, fill: "EFF6FF" },
        indent: { left: 400 },
        children: [new TextRun({ text: "https://github.com/YOUR_USERNAME/devops-taskmanager", font: "Courier New", size: 20, color: "1D4ED8" })]
      }),
      spacer(),

      h2("2. Docker Hub"),
      p("Backend Image:"),
      new Paragraph({
        spacing: { before: 80, after: 80 },
        shading: { type: ShadingType.CLEAR, fill: "EFF6FF" },
        indent: { left: 400 },
        children: [new TextRun({ text: "https://hub.docker.com/r/YOUR_USERNAME/taskmanager-backend", font: "Courier New", size: 20, color: "1D4ED8" })]
      }),
      p("Frontend Image:"),
      new Paragraph({
        spacing: { before: 80, after: 80 },
        shading: { type: ShadingType.CLEAR, fill: "EFF6FF" },
        indent: { left: 400 },
        children: [new TextRun({ text: "https://hub.docker.com/r/YOUR_USERNAME/taskmanager-frontend", font: "Courier New", size: 20, color: "1D4ED8" })]
      }),
      spacer(),

      h2("3. Cấu Trúc Dự Án"),
      code("devops-taskmanager/"),
      code("├── backend/"),
      code("│   ├── server.js          # Express API server"),
      code("│   ├── package.json"),
      code("│   ├── Dockerfile         # Multi-stage build"),
      code("│   ├── .env               # Biến môi trường"),
      code("│   └── .env.example       # Template"),
      code("├── frontend/"),
      code("│   ├── index.html         # Single-page app"),
      code("│   ├── nginx.conf         # Nginx reverse proxy"),
      code("│   └── Dockerfile"),
      code("├── docker-compose.yml     # Orchestration"),
      code("├── .gitignore"),
      code("└── README.md"),
      spacer(),

      h2("4. API Endpoints"),
      makeTable(
        ["Method", "Endpoint", "Mô tả", "Auth"],
        [
          ["GET", "/health", "Health check — {status: ok}", "Không"],
          ["GET", "/about", "Thông tin sinh viên", "Không"],
          ["GET", "/api/tasks", "Lấy danh sách tất cả task", "Không"],
          ["GET", "/api/tasks/:id", "Lấy chi tiết 1 task", "Không"],
          ["POST", "/api/tasks", "Tạo task mới", "Không"],
          ["PUT", "/api/tasks/:id", "Cập nhật task", "Không"],
          ["DELETE", "/api/tasks/:id", "Xóa task", "Không"],
          ["GET", "/api/stats", "Thống kê task", "Không"],
        ],
        [1200, 2600, 3400, 1226]
      ),
      spacer(),

      h2("5. Environment Variables"),
      makeTable(
        ["Biến", "Giá trị mặc định", "Mô tả"],
        [
          ["PORT", "5000", "Cổng chạy backend"],
          ["DB_URL", "mongodb://mongo:27017/taskmanager", "URL kết nối MongoDB"],
          ["APP_NAME", "TaskManager", "Tên ứng dụng"],
          ["STUDENT_NAME", "Nguyễn Văn A", "Tên sinh viên (hiển thị /about)"],
          ["STUDENT_ID", "21IT000001", "MSSV (hiển thị /about)"],
          ["STUDENT_CLASS", "CNTT21A", "Lớp (hiển thị /about)"],
        ],
        [2200, 3500, 3726]
      ),
      spacer(),

      h2("6. Hướng Dẫn Chạy Dự Án"),
      h3("6.1 Yêu cầu hệ thống"),
      bullet("Docker Desktop >= 4.x"),
      bullet("Docker Compose v2+"),
      bullet("Git"),
      h3("6.2 Các bước chạy"),
      p("Bước 1 — Clone repository:", { bold: true }),
      code("git clone https://github.com/YOUR_USERNAME/devops-taskmanager.git"),
      code("cd devops-taskmanager"),
      p("Bước 2 — Cấu hình environment:", { bold: true }),
      code("cp backend/.env.example backend/.env"),
      code("# Chỉnh sửa STUDENT_NAME, STUDENT_ID, STUDENT_CLASS"),
      p("Bước 3 — Khởi động toàn bộ hệ thống:", { bold: true }),
      code("docker compose up -d"),
      p("Bước 4 — Kiểm tra dịch vụ:", { bold: true }),
      code("docker compose ps"),
      code("docker compose logs -f backend"),
      p("Bước 5 — Truy cập ứng dụng:", { bold: true }),
      bullet("Frontend: http://localhost:3000"),
      bullet("Backend API: http://localhost:5000"),
      bullet("Health check: http://localhost:5000/health"),
      bullet("About: http://localhost:5000/about"),
      spacer(),

      h2("7. Git Branch Strategy"),
      makeTable(
        ["Branch", "Mục đích"],
        [
          ["main", "Code production ổn định, đã qua review"],
          ["develop", "Tích hợp các feature trước khi merge vào main"],
          ["feature/backend-api", "Phát triển REST API và kết nối MongoDB"],
          ["feature/frontend-ui", "Xây dựng giao diện và nginx config"],
          ["feature/docker-setup", "Cấu hình Dockerfile và Docker Compose"],
        ],
        [3500, 5926]
      ),
      spacer(),

      h2("8. CheckList Hoàn Thành"),
      makeTable(
        ["Yêu cầu", "Trạng thái", "Chi tiết"],
        [
          ["Commit history >= 5", "DONE", "6+ commits với message rõ ràng"],
          ["BE + FE + DB", "DONE", "Express + HTML/Nginx + MongoDB"],
          ["Trang /about", "DONE", "Hiển thị họ tên, MSSV, lớp từ .env"],
          ["Endpoint /health", "DONE", "Trả về {\"status\": \"ok\"}"],
          ["File .env và .env.example", "DONE", "PORT, DB_URL, APP_NAME, student info"],
          ["Dockerfile (BE + FE)", "DONE", "Multi-stage cho backend, nginx cho FE"],
          ["Docker Compose", "DONE", "3 services: mongo, backend, frontend"],
          ["Push lên Docker Hub", "DONE", "taskmanager-backend, taskmanager-frontend"],
          [">= 3 branches", "DONE", "main, develop, feature/* (4 branches)"],
          [">= 2 API (GET + POST/PUT)", "DONE", "8 endpoints: GET, POST, PUT, DELETE"],
          ["Database không hard-code", "DONE", "MongoDB với mongoose models"],
          ["Frontend tương tác", "DONE", "Form tạo task, toggle complete, delete"],
        ],
        [3500, 1500, 4426]
      ),
      spacer(),

      h2("9. Ảnh Minh Chứng"),
      p("(Chèn các ảnh chụp màn hình vào đây sau khi chạy ứng dụng)", { color: "9CA3AF", italics: true }),
      spacer(),
      bullet("Ảnh VSCode — Git history (Source Control / Git Graph)"),
      bullet("Ảnh github.com — Danh sách branches"),
      bullet("Ảnh Docker Desktop — Containers đang chạy"),
      bullet("Ảnh trình duyệt — Trang /about (http://localhost:3000)"),
      bullet("Ảnh trình duyệt — Endpoint /health (http://localhost:5000/health)"),
      bullet("Ảnh Docker Hub — 2 images đã push"),
      spacer(), spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 0 },
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: "DBEAFE" } },
        children: [new TextRun({ text: "--- Hết báo cáo ---", size: 20, color: "9CA3AF", italics: true })]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/mnt/user-data/outputs/DevOps_MiniProject_BaoCao.docx', buffer);
  console.log('Document created successfully!');
});
