# 🚀 Hướng dẫn Deploy Full Stack - Bookstore Management System

## 📋 Tổng quan

Dự án được deploy trên 3 nền tảng:
- **Database**: Supabase (PostgreSQL)
- **Backend**: Render (.NET Core API)
- **Frontend**: Vercel (React + Vite)

---

## ✅ BƯỚC 1: Setup Database trên Supabase

### 1.1. Truy cập Supabase
1. Mở trình duyệt, vào: https://supabase.com
2. Click **"Start your project"** → **Sign in với GitHub**
3. Sau khi đăng nhập, dashboard sẽ hiện ra

### 1.2. Tạo Project mới
1. Click nút **"New Project"** (góc trên phải)
2. Điền thông tin:
   - **Name**: `bookstore-db`
   - **Database Password**: `0906446134nhuy` (hoặc password mạnh hơn)
   - **Region**: Singapore (gần VN nhất)
3. Click **"Create new project"**
4. **Chờ khoảng 2-3 phút** để Supabase provision database

### 1.3. Lấy Connection String
1. Sau khi project tạo xong, click vào project `bookstore-db`
2. Menu bên trái → **Settings** (icon bánh răng)
3. Click **Database** trong phần Settings
4. Scroll xuống phần **Connection string**
5. Chọn tab **URI**
6. **Copy toàn bộ connection string**
   - Dạng: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - Ví dụ của bạn: `postgresql://postgres:0906446134nhuy@db.fhosrwkzflmbjezdqfop.supabase.co:5432/postgres`
7. **LƯU LẠI** connection string này để dùng cho Render

### 1.4. Chạy SQL Schema tạo bảng
1. Menu bên trái → **SQL Editor** (icon </>)
2. Click **"New query"**
3. Mở file `DataBasee/DoAnPhanMem/deploy_pg.sql` trong project
4. **Copy TOÀN BỘ nội dung** của file này
5. **Paste vào** ô SQL Editor trên Supabase
6. Click nút **"Run"** (hoặc nhấn Ctrl+Enter)
7. Đợi ~10-15 giây
8. Sẽ hiện thông báo **"Success. No rows returned"** ở dưới
9. **✅ Đã tạo xong database schema!**

### 1.5. Chạy Sample Data (Tùy chọn)
1. Vẫn ở **SQL Editor**
2. Click **"New query"** (tạo tab mới)
3. Mở file `DataBasee/DoAnPhanMem/sample_data.sql`
4. **Copy TOÀN BỘ nội dung**
5. **Paste vào** SQL Editor
6. Click **"Run"**
7. Sẽ có dữ liệu mẫu (sách, thể loại, tác giả, nhân viên, tài khoản)

### 1.6. Kiểm tra Database
1. Menu bên trái → **Table Editor** (icon bảng)
2. Sẽ thấy các bảng đã được tạo:
   - TAI_KHOAN
   - NHAN_VIEN
   - SACH
   - THE_LOAI
   - TAC_GIA
   - KHACH_HANG
   - HOA_DON
   - PHIEU_NHAP_SACH
   - PHIEU_THU_TIEN
   - BAO_CAO_TON
   - BAO_CAO_CONG_NO
   - QUY_DINH
   - SACH_TAC_GIA
   - CHI_TIET_HOA_DON
   - CHI_TIET_PHIEU_NHAP
3. Click vào từng bảng để xem dữ liệu
4. **✅ Database sẵn sàng!**

---

## ✅ BƯỚC 2: Deploy Backend lên Render

### 2.1. Truy cập Render
1. Mở trình duyệt, vào: https://render.com
2. Click **"Get Started"** → **Sign up với GitHub**
3. Sau khi đăng nhập, sẽ vào Dashboard

### 2.2. Kết nối GitHub Repository
1. Trên Dashboard, click **"New +"** (góc trên phải)
2. Chọn **"Web Service"**
3. Click **"Connect account"** để kết nối GitHub
4. Chọn repository: **ThachY-23120411/Book-Management-System**
5. Click **"Connect"**
6. Sẽ thấy danh sách repository, tìm và chọn repo của bạn

### 2.3. Cấu hình Web Service

Điền thông tin như sau:

| Field | Giá trị cần điền |
|-------|------------------|
| **Name** | `bookstore-api` |
| **Region** | `Singapore` (hoặc Singapore) |
| **Branch** | `main` |
| **Root Directory** | `DataBasee/DoAnPhanMem` |
| **Runtime** | `Docker` |
| **Build Command** | `chmod +x build.sh && ./build.sh` |
| **Start Command** | `chmod +x start.sh && ./start.sh` |
| **Instance Type** | `Free` |

**Hướng dẫn chi tiết từng field:**

1. **Name**: 
   - Gõ: `bookstore-api`
   - Render sẽ tự sinh URL: `https://bookstore-api-xxxx.onrender.com`

2. **Region**: 
   - Click dropdown → Chọn `Singapore`

3. **Branch**: 
   - Để nguyên `main`

4. **Root Directory**: 
   - Gõ chính xác: `DataBasee/DoAnPhanMem`
   - ⚠️ **PHẢI đúng chính tả**, nếu sai sẽ không build được!

5. **Runtime**: 
   - Click dropdown → Chọn `Docker`

6. **Build Command**: 
   - Gõ: `chmod +x build.sh && ./build.sh`

7. **Start Command**: 
   - Gõ: `chmod +x start.sh && ./start.sh`

8. **Instance Type**: 
   - Chọn `Free`

### 2.4. Thêm Environment Variables

#### 2.4.1. Các biến này lấy từ đâu trong code? ⚠️ QUAN TRỌNG

Các Key (tên biến) bạn cần điền trên Render **đến từ code trong project**. Cụ thể từng biến:

---

**📁 File: `DataBasee/DoAnPhanMem/Program.cs`** — Đây là file cấu hình chính

**Biến 1: `DATABASE_URL`** → Lấy từ dòng 20-21:
```csharp
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");
```
→ Code đọc biến tên `"DATABASE_URL"`. Value = connection string từ Supabase.

---

**Biến 2: `ASPNETCORE_ENVIRONMENT`** → Biến chuẩn của .NET
→ Không có trong code, đây là biến mặc định của ASP.NET Core.
→ Dùng để báo .NET đang chạy môi trường nào: `Development` hay `Production`.

---

**Biến 3: `ASPNETCORE_URLS`** → Biến chuẩn của .NET
→ Không có trong code, biến mặc định của ASP.NET Core.
→ Render yêu cầu server listen trên port 10000.

---

**Biến 4, 5, 6: `Jwt__Key`, `Jwt__Issuer`, `Jwt__Audience`** → Lấy từ dòng 52-64:
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = builder.Configuration["Jwt:Issuer"],     // ← Jwt__Issuer
            ValidAudience = builder.Configuration["Jwt:Audience"], // ← Jwt__Audience
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)) // ← Jwt__Key
        };
    });
```
→ Code đọc 3 biến: `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience`
→ Trên Render, dấu `:` thay bằng `__` → `Jwt__Key`, `Jwt__Issuer`, `Jwt__Audience`

---

**📁 File: `DataBasee/DoAnPhanMem/appsettings.json`** — Giá trị mặc định

Các value (giá trị) mặc định nằm ở file này:
```json
{
    "ConnectionStrings": {
        "DefaultConnection": "Host=localhost;Database=DoAnPhanMem;..."
    },
    "Jwt": {
        "Key": "KEY_CUC_KY_BI_MAT_123456",
        "Issuer": "DoAnPhanMem",
        "Audience": "DoAnClient"
    }
}
```
→ **Trên production**: Environment Variables trên Render sẽ **ghi đè** giá trị trong file này.
→ Code luôn ưu tiên Environment Variable trước, nếu không có mới đọc từ `appsettings.json`.

---

#### 2.4.2. Tóm tắt: File nào → Biến nào

| Biến (Key) trên Render | Lấy từ file nào trong project | Dòng code |
|------------------------|------------------------------|-----------|
| `DATABASE_URL` | `Program.cs` | Dòng 20 |
| `ASPNETCORE_ENVIRONMENT` | Biến chuẩn .NET | - |
| `ASPNETCORE_URLS` | Biến chuẩn .NET | - |
| `Jwt__Key` | `Program.cs` + `appsettings.json` | Dòng 64 |
| `Jwt__Issuer` | `Program.cs` + `appsettings.json` | Dòng 61 |
| `Jwt__Audience` | `Program.cs` + `appsettings.json` | Dòng 62 |

> 💡 **Mẹo**: Mở VS Code → `Ctrl+Shift+F` → gõ `Configuration[` → sẽ thấy tất cả biến mà code đọc.

---

#### 2.4.3. Cách tìm phần Environment Variables trên giao diện Render

**TÌNH HUỐNG A: Đang tạo Web Service mới (chưa bấm Create)**

1. Sau khi điền Name, Region, Root Directory, Runtime...
2. **Scroll XUỐNG** (lăn chuột xuống cuối trang)
3. Sẽ thấy section **"Environment Variables"**
4. Có 2 ô trống: ô trái = Key, ô phải = Value
5. Nút **"+ Add Environment Variable"** ở dưới
6. **ĐÂY là nơi bạn điền!**

**TÌNH HUỐNG B: Đã tạo xong, muốn thêm/sửa biến sau**

1. https://render.com → Đăng nhập → Dashboard
2. Click vào service `bookstore-api`
3. Menu bên trái → click **"Environment"**
4. Click **"+ Add Single Variable"**
5. Điền Key và Value → Click **"Save Variable"**

---

#### 2.4.4. Danh sách 6 biến cần điền

| # | Key (ô trái) | Value (ô phải) | Nguồn |
|---|-------------|---------------|-------|
| 1 | `DATABASE_URL` | `postgresql://postgres:0906446134nhuy@db.fhosrwkzflmbjezdqfop.supabase.co:5432/postgres` | Supabase connection string |
| 2 | `ASPNETCORE_ENVIRONMENT` | `Production` | Biến chuẩn .NET |
| 3 | `ASPNETCORE_URLS` | `http://0.0.0.0:10000` | Biến chuẩn .NET (Render yêu cầu) |
| 4 | `Jwt__Key` | `KEY_CUC_KY_BI_MAT_123456` | `Program.cs` dòng 64 / `appsettings.json` |
| 5 | `Jwt__Issuer` | `DoAnPhanMem` | `Program.cs` dòng 61 / `appsettings.json` |
| 6 | `Jwt__Audience` | `DoAnClient` | `Program.cs` dòng 62 / `appsettings.json` |

#### 2.4.5. Hướng dẫn thao tác

1. Ô trái gõ Key, ô phải gõ Value theo bảng trên
2. Click **"+ Add Environment Variable"** để thêm biến tiếp theo
3. Lặp lại đến khi đủ 6 biến
4. Sẽ thấy danh sách 6 biến với nút Edit/Delete

**✅ Xong → Chuyển sang bước 2.5 (Create Web Service)**

### 2.5. Deploy Backend
1. Scroll xuống cuối trang
2. Click nút **"Create Web Service"**
3. Render sẽ bắt đầu build và deploy
4. **Chờ 5-10 phút** (lần đầu build lâu hơn)
5. Theo dõi tiến trình ở tab **"Events"**
6. Khi thấy status **"Live"** với màu xanh lá → **✅ Deploy thành công!**

### 2.6. Lấy Backend URL
1. Sau khi deploy xong, ở đầu trang sẽ hiển thị URL
2. Dạng: `https://bookstore-api-xxxx.onrender.com`
3. **COPY URL này** để dùng cho bước tiếp theo!
4. URL thực tế của bạn: **`https://bookstore-api-yrew.onrender.com`**

### 2.7. Kiểm tra Backend hoạt động
1. Mở trình duyệt mới
2. Truy cập: `https://bookstore-api-yrew.onrender.com/swagger`
4. Sẽ thấy **Swagger UI** với danh sách các API endpoints
5. Click vào từng endpoint để test
6. **✅ Backend hoạt động tốt!**

### 2.8. Lưu ý về Render Free Tier
- ⚠️ **Render Free Tier sẽ sleep sau 15 phút không có request**
- Lần truy cập đầu tiên sau khi sleep sẽ mất ~30-60 giây để wake up
- Đây là bình thường, không phải lỗi!
- Nếu muốn không bị sleep, cần upgrade lên paid plan

---

## ✅ BƯỚC 3: Update Frontend trên Vercel

### 3.1. Truy cập Vercel Dashboard
1. Mở trình duyệt, vào: https://vercel.com
2. Click **"Log In"** → **Sign in với GitHub** (dùng tài khoản của bạn)
3. Vào Dashboard

### 3.2. Chọn Project Frontend
1. Tìm project **"client"** trong danh sách projects
2. Click vào project để vào dashboard
3. Hoặc truy cập trực tiếp: https://vercel.com/thach-ys-projects/client

### 3.3. Thêm Environment Variable cho Frontend

**CÁCH 1: Dùng Vercel Dashboard (Khuyên dùng)**

1. Trong project dashboard, click tab **"Settings"**
2. Click **"Environment Variables"** ở menu bên trái
3. Click **"+ Add New"**
4. Điền thông tin:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://bookstore-api-yrew.onrender.com/api`
     - **PHẢI có `/api`** ở cuối!
5. Tick vào cả 3 môi trường:
   - ✅ Preview
   - ✅ Development
   - ✅ Production
6. Click **"Save"**

**CÁCH 2: Dùng Vercel CLI**

Mở terminal và chạy:
```bash
cd client

# Login Vercel (nếu chưa)
vercel login

# Thêm environment variable
vercel env add VITE_API_URL production

# Khi được hỏi value, nhập:
# https://bookstore-api-xxxx.onrender.com/api

# Lặp lại cho các môi trường khác
vercel env add VITE_API_URL preview
vercel env add VITE_API_URL development
```

### 3.4. Redeploy Frontend

**CÁCH 1: Redeploy từ Vercel Dashboard**

1. Vào project dashboard trên Vercel
2. Tab **"Deployments"**
3. Tìm deployment mới nhất
4. Click **"..."** (3 chấm) → **"Redeploy"**
5. Hoặc vào tab **"Deployments"** → Click nút **"Redeploy"**
6. Đợi 1-2 phút để rebuild

**CÁCH 2: Redeploy từ CLI**

```bash
cd client

# Deploy production
vercel --prod

# Đợi build xong (1-2 phút)
# Sẽ hiện URL mới
```

**CÁCH 3: Push code lên GitHub (Auto-deploy)**

```bash
# Thêm thay đổi
git add .
git commit -m "Update API URL for production"
git push origin main

# Vercel sẽ tự động detect và deploy
```

### 3.5. Kiểm tra Frontend
1. Sau khi redeploy xong, vào URL frontend
2. URL: `https://client-eta-opal-70.vercel.app`
3. Sẽ thấy trang **Login** của Bookstore Management System
4. Thử login với tài khoản mẫu:
   - Username: `admin`
   - Password: `admin123`
   - (hoặc tài khoản trong sample_data.sql)
5. **✅ Frontend hoạt động tốt!**

---

## 🎯 KIỂM TRA HOÀN CHỈNH

### Checklist sau khi deploy:

- [ ] **Supabase**: Database đã tạo, schema đã chạy
- [ ] **Supabase**: Connection string đã copy
- [ ] **Render**: Backend đã deploy, status "Live"
- [ ] **Render**: Swagger hoạt động tại `/swagger`
- [ ] **Render**: Environment variables đã thêm đủ 6 biến
- [ ] **Vercel**: Environment variable `VITE_API_URL` đã thêm
- [ ] **Vercel**: Frontend đã redeploy
- [ ] **Test**: Login được vào hệ thống
- [ ] **Test**: CRUD sách hoạt động
- [ ] **Test**: Tạo hóa đơn hoạt động

---

## 🔧 Troubleshooting

### 1. Backend không build được
**Nguyên nhân**: Root Directory sai
- **Kiểm tra**: Phải là `DataBasee/DoAnPhanMem` (chú ý chữ hoa/thường)
- **Sửa**: Vào Settings → General → Root Directory → Sửa lại

### 2. Backend lỗi kết nối database
**Nguyên nhân**: DATABASE_URL sai
- **Kiểm tra**: Copy lại connection string từ Supabase
- **Lưu ý**: Password phải đúng, không có khoảng trắng thừa

### 3. Frontend không gọi được API
**Nguyên nhân**: VITE_API_URL sai hoặc thiếu `/api`
- **Kiểm tra**: `https://your-backend-url.onrender.com/api`
- **Phải có**: `/api` ở cuối URL!

### 4. Frontend login thất bại
**Nguyên nhân**: CORS chưa cho phép domain
- **Kiểm tra**: Program.cs đã thêm domain Vercel chưa
- **Sửa**: Thêm domain vào `WithOrigins()` trong Program.cs

### 5. Backend bị slow response
**Nguyên nhân**: Render Free Tier sleep
- **Giải thích**: Đây là bình thường với free tier
- **Khắc phục**: Upgrade lên paid plan hoặc dùng dịch vụ khác (Railway)

### 6. Frontend chỉ hiển thị chữ "client"
**Nguyên nhân**: JavaScript không load được hoặc API URL sai
- **Kiểm tra**: 
  - Mở DevTools (F12) → Console → Xem lỗi
  - Kiểm tra VITE_API_URL trên Vercel
  - Redeploy frontend

---

## 📝 Lưu ý quan trọng

### Bảo mật:
- ⚠️ **KHÔNG commit file `.env` lên GitHub**
- ⚠️ **KHÔNG để password trong code**
- ✅ Dùng Environment Variables trên Render/Vercel
- ✅ File `.env` đã có trong `.gitignore`

### Update code sau này:
```bash
# 1. Sửa code local
# 2. Commit và push
git add .
git commit -m "Fix bug"
git push origin main

# 3. Render và Vercel sẽ tự động deploy
# 4. Hoặc manual deploy:
cd client && vercel --prod
```

### Backup:
- **Database**: Supabase tự động backup hàng ngày
- **Code**: GitHub đã lưu trữ
- **Environment Variables**: Copy và lưu ở nơi an toàn

---

## 📚 Tài liệu tham khảo

- **Supabase**: https://supabase.com/docs
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **React + Vite**: https://vitejs.dev/guide/
- **.NET Core**: https://docs.microsoft.com/en-us/aspnet/core/

---

## 🎉 Kết luận

Sau khi hoàn thành tất cả các bước, bạn sẽ có:
- ✅ **Database** online trên Supabase
- ✅ **Backend API** online trên Render
- ✅ **Frontend** online trên Vercel
- ✅ **Full system** hoạt động trên production

**Chúc mừng! Bạn đã deploy thành công hệ thống Bookstore Management! 🚀**
