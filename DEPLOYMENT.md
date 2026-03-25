# DailyFlow 部署到 Cloudflare Pages 完整指南

## 📋 部署前准备

### 1. Cloudflare 账号
确保你有一个 Cloudflare 账号，如果没有请注册：https://dash.cloudflare.com/sign-up

### 2. 获取 Cloudflare API Token

1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 "Create Token"
3. 选择 "Edit Cloudflare Workers" 模板
4. 点击 "Continue to summary"
5. 点击 "Create Token"
6. **复制并保存 Token**（只显示一次）

## 🚀 部署步骤

### 步骤 1：登录 Cloudflare

在终端执行：
```bash
npx wrangler login
```

或者使用 API Token：
```bash
npx wrangler login --api-token <你的 API_TOKEN>
```

### 步骤 2：创建 D1 数据库

```bash
npx wrangler d1 create daily-flow-db
```

**输出示例：**
```
✅ Successfully created DB 'daily-flow-db' in region apac
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**重要：** 复制 `database_id`，后面需要填入 `wrangler.toml`

### 步骤 3：更新 wrangler.toml

编辑 `wrangler.toml` 文件，将 `database_id` 填入：

```toml
[[d1_databases]]
binding = "DB"
database_name = "daily-flow-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # 替换为实际的 database_id
```

### 步骤 4：执行数据库迁移

```bash
# 远程执行迁移到 Cloudflare D1
npm run db:migrate:prod
```

### 步骤 5：设置环境变量

#### 方法一：使用 Wrangler CLI（推荐）

```bash
# 设置 BETTER_AUTH_SECRET
npx wrangler secret put BETTER_AUTH_SECRET

# 按提示输入密钥值（生成方法见下方）
```

#### 方法二：通过 Cloudflare Dashboard

1. 访问 https://dash.cloudflare.com/?to=/:account/pages
2. 选择 `daily-flow` 项目
3. 点击 "Settings" > "Environment variables"
4. 添加以下变量：

| Variable Name | Value |
|--------------|-------|
| `BETTER_AUTH_SECRET` | 你的 32 位随机密钥 |
| `BETTER_AUTH_URL` | `https://daily-flow.pages.dev` |

### 步骤 6：生成 BETTER_AUTH_SECRET

使用以下命令生成安全的密钥：

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**或者使用 Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 步骤 7：构建并部署

```bash
# 构建项目
npm run build

# 部署到 Cloudflare Pages
npm run deploy
```

或者使用一键部署命令：
```bash
npx wrangler pages deploy .next --project-name=daily-flow
```

## 🌐 访问部署后的网站

部署成功后，你会看到类似输出：
```
✨ Deployment complete!
Your deployment is now available at: https://daily-flow.pages.dev
```

访问：`https://daily-flow.pages.dev`

## 📊 查看部署状态

### 通过 Dashboard 查看

1. 访问 https://dash.cloudflare.com/?to=/:account/pages
2. 选择 `daily-flow` 项目
3. 点击 "Deployments" 查看部署历史

### 通过 CLI 查看

```bash
# 查看部署列表
npx wrangler pages deployment list

# 查看项目信息
npx wrangler pages project view daily-flow
```

## 🔧 故障排查

### 问题 1：D1 数据库未找到

**错误：** `Error: D1 database not found`

**解决方案：**
- 检查 `wrangler.toml` 中的 `database_id` 是否正确
- 确认数据库已创建：`npx wrangler d1 list`

### 问题 2：环境变量未设置

**错误：** `BETTER_AUTH_SECRET is not defined`

**解决方案：**
- 重新设置环境变量：`npx wrangler secret put BETTER_AUTH_SECRET`
- 或在 Dashboard 中设置

### 问题 3：构建失败

**错误：** `Next.js build failed`

**解决方案：**
- 本地运行 `npm run build` 检查错误
- 查看构建日志中的详细错误信息

## 🔄 后续部署

每次代码更新后，只需运行：

```bash
npm run deploy
```

或者如果使用 GitHub 自动部署，只需推送到 main 分支即可。

## 🎯 自定义域名（可选）

### 通过 Dashboard 配置

1. 访问 https://dash.cloudflare.com/?to=/:account/pages
2. 选择 `daily-flow` 项目
3. 点击 "Custom domains"
4. 点击 "Add custom domain"
5. 输入你的域名：`dailyflow.yourdomain.com`
6. Cloudflare 会自动配置 DNS 和 SSL

### DNS 记录（如果需要手动配置）

```
类型：CNAME
名称：dailyflow
内容：daily-flow.pages.dev
代理状态：已代理（橙色云朵）
```

## 📝 重要提示

1. **数据库备份：** 定期备份 D1 数据库数据
2. **环境变量：** 生产环境的 `BETTER_AUTH_SECRET` 必须保密
3. **部署区域：** 选择离中国近的区域（如 `apac`）以获得更好的访问速度
4. **国内访问：** Cloudflare 在中国大陆有 CDN 节点，访问速度较快

## 🎉 完成！

现在你的 DailyFlow 已经成功部署到 Cloudflare Pages，可以开始使用了！

访问 `https://daily-flow.pages.dev` 注册账户并开始使用。
