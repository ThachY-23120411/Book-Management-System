# Git Revert - Hướng dẫn Chi tiết

## 📚 Git Revert là gì?

`git revert` là lệnh dùng để **hoàn tác một commit** bằng cách tạo một commit mới đảo ngược các thay đổi của commit cũ. Khác với `git reset`, `git revert` **không xóa lịch sử** mà tạo thêm commit mới.

---

## 🔄 Khi nào dùng Git Revert?

### ✅ Nên dùng khi:
- Đã push commit lên remote repository (GitHub, GitLab...)
- Làm việc trên branch chung với nhiều người
- Muốn giữ lại lịch sử commit đầy đủ
- Cần hoàn tác một commit cụ thể giữa nhiều commit

### ❌ Không nên dùng khi:
- Commit chỉ tồn tại local (chưa push) → Dùng `git reset` thay thế
- Muốn xóa hoàn toàn lịch sử commit
- Làm việc một mình trên branch riêng

---

## 📖 Cú pháp cơ bản

```bash
# Revert commit gần nhất
git revert HEAD

# Revert một commit cụ thể
git revert <commit-hash>

# Revert nhiều commit
git revert <commit-hash-1> <commit-hash-2>

# Revert nhưng không tự động commit
git revert --no-commit <commit-hash>

# Revert và không mở editor
git revert --no-edit <commit-hash>
```

---

## 🎯 Ví dụ thực tế

### Ví dụ 1: Revert commit vừa push nhầm

```bash
# 1. Xem lịch sử commit
git log --oneline
# Output:
# a1b2c3d (HEAD -> main) Add wrong feature
# e4f5g6h Fix bug
# i7j8k9l Initial commit

# 2. Revert commit "Add wrong feature"
git revert HEAD

# 3. Git sẽ mở editor để bạn nhập commit message
# Mặc định: "Revert "Add wrong feature""
# Lưu và đóng editor

# 4. Push lên remote
git push origin main
```

### Ví dụ 2: Revert commit cũ hơn

```bash
# 1. Tìm commit hash cần revert
git log --oneline
# Output:
# a1b2c3d (HEAD -> main) Latest commit
# e4f5g6h Middle commit (cần revert cái này)
# i7j8k9l Old commit

# 2. Revert commit e4f5g6h
git revert e4f5g6h

# 3. Nếu có conflict, giải quyết conflict
git status  # Xem file bị conflict
# Sửa file conflict
git add .
git revert --continue

# 4. Push
git push origin main
```

### Ví dụ 3: Revert nhiều commit liên tiếp

```bash
# Revert từ commit cũ đến commit mới
git revert <oldest-commit>..<newest-commit>

# Ví dụ cụ thể:
git revert e4f5g6h..a1b2c3d
```

---

## 🆚 So sánh Git Revert vs Git Reset

| Tiêu chí | `git revert` | `git reset` |
|----------|--------------|-------------|
| **Xóa lịch sử?** | ❌ Không (tạo commit mới) | ✅ Có (xóa commit) |
| **An toàn với remote?** | ✅ An toàn | ⚠️ Nguy hiểm (cần force push) |
| **Dùng sau khi push?** | ✅ Nên dùng | ❌ Không nên |
| **Làm việc nhóm?** | ✅ An toàn | ❌ Gây conflict |
| **Giữ lịch sử đầy đủ?** | ✅ Có | ❌ Không |

---

## 🔧 Các tùy chọn hữu ích

### `--no-commit` (Revert nhưng chưa commit)
```bash
git revert --no-commit HEAD
# Thay đổi được staged nhưng chưa commit
# Bạn có thể sửa thêm trước khi commit
git commit -m "Revert with additional changes"
```

### `--no-edit` (Không mở editor)
```bash
git revert --no-edit HEAD
# Dùng commit message mặc định, không mở editor
```

### `-m` (Revert merge commit)
```bash
# Khi revert merge commit, cần chỉ định parent
git revert -m 1 <merge-commit-hash>
# -m 1: Giữ parent thứ nhất (thường là main branch)
# -m 2: Giữ parent thứ hai (feature branch)
```

---

## 🚨 Xử lý Conflict khi Revert

Khi revert gây conflict:

```bash
# 1. Git báo conflict
git revert <commit-hash>
# Output: CONFLICT (content): Merge conflict in file.txt

# 2. Xem file bị conflict
git status

# 3. Mở file và sửa conflict
# Tìm các dòng:
# <<<<<<< HEAD
# Code hiện tại
# =======
# Code từ revert
# >>>>>>> parent of abc123

# 4. Sau khi sửa xong
git add <file-đã-sửa>

# 5. Tiếp tục revert
git revert --continue

# Hoặc hủy revert nếu không muốn tiếp tục
git revert --abort
```

---

## 📝 Case Study: Tình huống thực tế

### Tình huống: Push nhầm code lên repo nhóm

**Vấn đề:**
- Bạn vừa push commit có chứa config deployment lên repo chung của nhóm
- Nhóm không muốn có những thay đổi này
- Cần hoàn tác ngay lập tức

**Giải pháp:**

```bash
# Bước 1: Xem commit vừa push
git log --oneline -3
# b14ac95 Prepare backend for Render deployment  ← Cần revert
# b2342b5 Fix PDF font
# 0ce9307 Fix invoice details

# Bước 2: Revert commit
git revert HEAD --no-edit
# Tạo commit mới đảo ngược thay đổi

# Bước 3: Push lên remote
git push origin main
# Repo nhóm đã về trạng thái ban đầu

# Bước 4: Kiểm tra
git log --oneline -3
# e76eed8 Revert "Prepare backend for Render deployment"
# b14ac95 Prepare backend for Render deployment
# b2342b5 Fix PDF font
```

**Kết quả:**
- ✅ Code đã về trạng thái trước khi push nhầm
- ✅ Lịch sử commit được giữ nguyên (không mất dữ liệu)
- ✅ Không ảnh hưởng đến code của người khác trong nhóm

---

## 🎓 Best Practices

### 1. **Luôn dùng Revert cho code đã push**
```bash
# ✅ Đúng
git revert HEAD
git push

# ❌ Sai (gây conflict cho team)
git reset --hard HEAD~1
git push --force
```

### 2. **Viết commit message rõ ràng**
```bash
# ✅ Tốt
git revert HEAD -m "Revert deployment config - pushed to wrong repo"

# ❌ Không tốt
git revert HEAD --no-edit
```

### 3. **Test trước khi push**
```bash
git revert HEAD
# Test local
npm test
npm run build
# Nếu OK mới push
git push
```

### 4. **Backup trước khi revert nhiều commit**
```bash
# Tạo branch backup
git branch backup-before-revert

# Revert
git revert <commit-range>

# Nếu có vấn đề, quay lại backup
git reset --hard backup-before-revert
```

---

## 🔍 Debug và Troubleshooting

### Lỗi: "error: commit <hash> is a merge but no -m option was given"
```bash
# Giải pháp: Thêm -m 1 hoặc -m 2
git revert -m 1 <merge-commit-hash>
```

### Lỗi: "fatal: bad revision 'HEAD'"
```bash
# Nguyên nhân: Chưa có commit nào
# Giải pháp: Tạo commit đầu tiên
git add .
git commit -m "Initial commit"
```

### Muốn undo một revert
```bash
# Revert cái revert (double revert)
git revert <revert-commit-hash>
```

---

## 📚 Tài liệu tham khảo

- [Git Official Documentation - git-revert](https://git-scm.com/docs/git-revert)
- [Atlassian Git Tutorial - Undoing Changes](https://www.atlassian.com/git/tutorials/undoing-changes/git-revert)
- [GitHub Docs - Reverting a commit](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/managing-commits/reverting-a-commit)

---

## 💡 Tips cuối cùng

1. **Revert là an toàn nhất** khi làm việc nhóm
2. **Luôn pull trước khi revert** để tránh conflict
3. **Test kỹ sau khi revert** trước khi push
4. **Giao tiếp với team** khi revert code của người khác
5. **Dùng `--no-commit`** nếu cần sửa thêm trước khi commit

---

**Tóm lại:** `git revert` là công cụ mạnh mẽ và an toàn để hoàn tác commit đã push, đặc biệt quan trọng khi làm việc nhóm!
