# Cloudflare Pages GitHub 自动部署指南

## ⚠️ 重要说明

**不要运行** `wrangler deploy` 命令！这是用于部署 Cloudflare Workers 的，不是用于 Pages 的。

对于 Next.js 项目，应该使用 **Cloudflare Pages + GitHub 自动部署**。

---

## 🚀 快速部署步骤

### 步骤 1：访问 Cloudflare Pages

打开：https://dash.cloudflare.com/?to=/:account/pages

### 步骤 2：创建应用

1. 点击 **"Create application"**
2. 选择 **"Connect to Git"**
3. 授权 Cloudflare 访问 GitHub
4. 找到并选择你的 `daily-flow` 仓库

### 步骤 3：配置构建设置

在 **"Build settings"** 页面：

```yaml
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: (留空)
```

### 步骤 4：添加环境变量

点击 **"Environment variables (advanced)"**，添加以下变量：

| Variable Name | Value | 
|--------------|-------|
| `BETTER_AUTH_SECRET` | (生成的随机密钥，见下方) |
| `BETTER_AUTH_URL` | `https://daily-flow.pages.dev` |
| `NODE_ENV` | `production` |

#### 生成 BETTER_AUTH_SECRET

在本地终端运行（Windows PowerShell）：
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

或者使用 Node.js：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 步骤 5：保存并部署

点击 **"Save and Deploy"**

Cloudflare Pages 会自动：
1. 从 GitHub 拉取代码
2. 运行 `npm run build`
3. 部署 `.next` 目录
4. 生成访问 URL

---

## 🗄️ 配置 D1 数据库

部署成功后，需要配置数据库：

### 创建数据库

1. 访问：https://dash.cloudflare.com/?to=/:account/workers/d1
2. 点击 **"Create database"**
3. 输入名称：`daily-flow-db`
4. 选择区域：推荐 `apac` (亚太地区)
5. 点击 **"Create database"**
6. **复制 Database ID**

### 绑定数据库到 Pages

1. 回到 Pages 项目
2. 点击 **"Settings"** → **"Functions"**
3. 找到 **"D1 database bindings"**
4. 点击 **"Add binding"**
5. 填写：
   - **Variable name**: `DB`
   - **D1 database**: 选择 `daily-flow-db`
6. 点击 **"Save"**

### 执行数据库迁移

#### 方法 A：使用 Wrangler CLI（本地）

```bash
# 登录 Cloudflare
npx wrangler login

# 执行迁移
npx wrangler d1 migrations apply daily-flow-db --remote
```

#### 方法 B：使用 Dashboard Console

1. 访问 D1 数据库页面
2. 点击 **"Console"** 标签
3. 复制 `drizzle/0001_initial.sql` 文件内容
4. 粘贴到 Console 并运行

---

## 📊 查看部署状态

### 部署历史

访问：https://dash.cloudflare.com/?to=/:account/pages

1. 选择你的项目
2. 点击 **"Deployments"** 标签
3. 查看部署状态和日志

### 访问网站

- **生产环境**: `https://daily-flow.pages.dev`
- **预览部署**: 每次 PR 都会生成预览 URL

---

## 🔄 后续部署

配置完成后，每次推送到 GitHub 都会自动部署：

```bash
# 本地修改代码后
git add .
git commit -m "更新内容"
git push origin main
```

Cloudflare Pages 会自动检测并重新部署！

---

## 🎯 自定义域名（可选）

1. 在项目页面点击 **"Settings"**
2. 选择 **"Custom domains"**
3. 点击 **"Add custom domain"**
4. 输入你的域名
5. Cloudflare 会自动配置 DNS 和 SSL

---

## ⚙️ wrangler.toml 说明

项目中的 `wrangler.toml` 文件现在只用于：
- **本地开发**：`npx wrangler dev`
- **数据库管理**：`npx wrangler d1`

**不用于部署**！部署通过 GitHub + Pages 自动完成。

---

## 📝 常见问题

### Q: 我可以运行 `wrangler deploy` 吗？

**A:** 不可以！这会导致错误。应该使用 GitHub 自动部署。

### Q: 如何查看部署日志？

**A:** 在 Dashboard → Deployments → 点击具体部署 → 查看日志

### Q: 部署失败了怎么办？

**A:** 
1. 检查 Build command 是否正确：`npm run build`
2. 检查 Output directory 是否正确：`.next`
3. 查看部署日志中的具体错误信息

### Q: 如何回滚到旧版本？

**A:** 在 Deployments 页面找到要回滚的版本，点击 **"Retry deployment"**

---

## ✅ 检查清单

配置完成后，确认以下项目：

- [ ] GitHub 仓库已连接
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] 环境变量已设置（BETTER_AUTH_SECRET, BETTER_AUTH_URL）
- [ ] D1 数据库已创建
- [ ] D1 数据库已绑定（变量名：DB）
- [ ] 数据库迁移已执行
- [ ] 部署成功，可以访问

---

## 🎉 完成！

现在你的 DailyFlow 已经部署到 Cloudflare Pages！

访问 `https://daily-flow.pages.dev` 开始使用吧！
