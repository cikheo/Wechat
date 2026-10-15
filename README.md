# CikTab 微信公众号关注页

基于 Vue 3、Vite 和 GSAP 的微信公众号介绍与扫码关注页面。采用 Apple 风格的系统字体、玻璃卡片和柔和光影背景，支持手机与桌面布局、深色模式及局域网 IP 访问。

## 公众号信息

| 项目 | 内容 |
| --- | --- |
| 名称 | CikTab |
| 公众号 ID | `cikccom` |
| 描述 | 分享技术知识、数字生活，探索技术的边界，记录生活的点滴！ |
| 配置域名 | `https://wechat.cikcc.com` |
| ICP 备案 | 陇ICP备2023002242号-9 |
| 公安备案 | 甘公网安备62082202000036号 |

## 页面功能

- **上下布局**：Logo 与 CikTab 名称同行，介绍、二维码和 ID 区域依次排列；桌面卡片最大宽度为 470px。
- **透明标识**：页头、正文、弹窗和浏览器图标使用透明 SVG 标识，保留 Logo 内部的白色图案。
- **二维码放大**：点击二维码打开弹窗，支持关闭按钮、点击遮罩和 Escape 键关闭；手机可通过微信长按图片识别。
- **复制公众号 ID**：点击紧凑的 ID 区域或复制图标，直接复制 `cikccom`。成功后图标短暂变为勾选，失败时显示手动复制提示。正文与弹窗共用同一组件。
- **响应式页脚**：桌面端版权与两项备案单行居中；手机端（视口宽度小于 768px）版权在第一行，两项备案在下一行居中显示。公安备案带图标，两项备案均在新标签页打开官方查询页面。
- **自动年份**：版权年份在构建时生成，浏览器加载后更新为当前年份。
- **动效与无障碍**：GSAP 提供入场、二维码悬停和弹窗动效；支持键盘操作、焦点提示、复制结果播报，以及减少动态效果、减少透明度和增强对比度设置。
- **静态背景**：采用柔和的光影渐变，为正文卡片提供清晰、安静的背景。

页面使用 `min-height: 100dvh` 与弹性布局。内容较少时页脚保持在视口底部，内容较多时自然排在正文后。

## 环境与启动

使用 npm 安装依赖。Node.js 版本需满足当前 Vite 与 Vue 插件的要求：`^20.19.0 || >=22.12.0`。

```sh
npm ci --registry=https://registry.npmjs.org/
npm run dev
```

| 命令 | 用途 | 本机地址 |
| --- | --- | --- |
| `npm run dev` | 启动开发服务，支持热更新 | `http://localhost:5174/` |
| `npm run build` | 生成可部署的静态文件 | 输出到 `dist/` |
| `npm run preview` | 预览已构建的静态文件 | `http://localhost:4174/` |

开发与预览服务均监听 `0.0.0.0`，支持同一局域网内通过 `http://本机IP:5174/` 或 `http://本机IP:4174/` 访问。可用的 Network 地址由 Vite 启动时打印，IP 变化后使用新的地址即可。两个端口均固定，端口被占用时会报错，不会自动切换。

复制 ID 优先使用 Clipboard API；局域网 HTTP IP 访问或 API 不可用时，会尝试通过临时文本选择复制。若浏览器阻止复制，页面会提示手动操作。

## 构建与部署

```sh
npm run build
npm run preview
```

构建依次完成以下工作：

1. 从 `public/img/logo-64.png` 生成透明标识 `logo-mark.svg`。
2. 构建浏览器端的 JavaScript、CSS 和静态资源。
3. 构建临时的 Vue 服务端渲染入口，将完整页面预渲染到 `dist/index.html`。
4. 生成 `robots.txt` 和 `sitemap.xml`，清理临时 `.ssr/` 目录。

部署时将 **`dist/` 内的文件**放到 `wechat.cikcc.com` 对应站点根目录。线上仅需静态文件托管，不需要运行 Node.js 服务；域名解析、HTTPS 证书及服务器配置由实际托管环境提供。`npm run preview` 用于本地检查构建结果。

生产页面包含完整的静态正文，浏览器加载后由 Vue 接管交互。禁用 JavaScript 时仍可读取介绍、公众号 ID、二维码和备案链接；复制 ID、二维码弹窗与动效需要 JavaScript。

## 配置与文件结构

```text
.
├── site.config.js             # 公众号、域名、SEO 和备案配置
├── vite.config.js             # 开发端口、构建年份和 SEO 模板处理
├── index.html                 # 页面入口及 SEO 元数据模板
├── src/
│   ├── App.vue                # 页面布局、二维码弹窗和 GSAP 动效
│   ├── components/AccountId.vue # 公众号 ID 与复制反馈
│   ├── style.css              # 背景、卡片、响应式布局和无障碍样式
│   ├── main.js                # 开发挂载与生产 hydration
│   └── entry-server.js        # 构建时的 Vue 渲染入口
├── public/img/                # 全部图片，构建后位于 dist/img/
└── scripts/
    ├── generate-mark.mjs      # 生成透明 Logo
    ├── prerender.mjs          # 预渲染 HTML 并生成爬虫文件
    └── social-card.html       # 分享封面的 HTML 源文件
```

`site.config.js` 集中保存名称、ID、描述、域名、Logo 与二维码路径、SEO 标题和备案编号。修改配置后需要重新构建，才能更新部署文件。域名使用不带末尾斜杠的完整地址，例如 `https://wechat.cikcc.com`。

如更换公众号品牌，还需同步检查 `src/App.vue` 中的扫码提示与图片说明、`index.html` 中的品牌元数据，以及分享封面中的文字；这些内容目前包含 CikTab 的固定文案。

## 图片资源维护

| 文件（位于 `public/img/`） | 用途与更新方式 |
| --- | --- |
| `wechat-qrcode.jpg` | 公众号二维码原图，保留清晰度，替换后重新构建 |
| `logo.png` | 保留的品牌 Logo 原图 |
| `logo-64.png` | 透明 SVG 标识的嵌入图片来源 |
| `logo-mark.svg` | 页头、正文、弹窗和浏览器图标；构建时自动生成并覆盖 |
| `logo-192.png` | Apple Touch Icon 与 JSON-LD 中的品牌图片 |
| `wechat.svg` | 右上角绿色微信品牌图标，来自 [Simple Icons](https://simpleicons.org/) |
| `beian.png` | 公安备案图标 |
| `social-card.jpg` | 1200 × 630 的 Open Graph 与 Twitter 分享封面 |

更新 Logo 时，应同时更新原图、64px 和 192px 图片。`generate-mark.mjs` 以 `logo-64.png` 为输入，通过 SVG 圆形裁切去除外侧白色边缘；仅替换 `logo.png` 不会自动更新其他尺寸。换用不同形状的 Logo 时需同步调整裁切逻辑。

需要单独重新生成透明标识时，执行：

```sh
node scripts/generate-mark.mjs
```

分享封面源文件为 `scripts/social-card.html`。启动开发服务后访问 `http://localhost:5174/scripts/social-card.html`，将页面左上角 1200 × 630 区域导出为 JPG，覆盖 `public/img/social-card.jpg`，再重新构建。封面中的名称、ID 和域名需手动同步；`npm run build` 不会自动截图生成封面。

## SEO 与维护检查

页面包含标题、描述、canonical、Open Graph、Twitter Card 和 JSON-LD。`robots.txt`、`sitemap.xml` 及 SEO 中的站点地址读取 `site.config.js`，通过局域网 IP 预览时仍保留配置的正式域名。

修改页面或配置后，可按以下项目检查：

- 运行 `npm run build`，再通过 `npm run preview` 检查生产页面。
- 检查桌面与手机的卡片排版，确认手机页脚为版权、备案两行，窄屏无横向溢出。
- 分别检查正文和弹窗中的 ID 复制、弹窗关闭及键盘操作；需要局域网访问时，再通过本机 IP 检查复制。
- 更新品牌或域名时，同步检查网站图标、分享封面、备案查询链接和构建产物中的 SEO 信息。
