# CikTab 微信公众号关注页

分享技术知识、数字生活，探索技术的边界，记录生活的点滴！

## 构建与部署

构建环境：Node.js `^20.19.0 || >=22.12.0`，npm。

安装依赖并构建：

```sh
npm ci --include=dev
npm run build
```

构建产物位于 `dist/`。将该目录内的全部文件部署到对应站点根目录，配置域名与 HTTPS 即可。线上采用静态文件托管，无需运行 Node.js 服务。

EdgeOne 源码部署：上传完整源码，确保根目录包含 `package.json` 和 `edgeone.json`。安装命令、构建命令和输出目录已在 `edgeone.json` 中配置。

EdgeOne 直接上传：上传 `dist/` 内的静态文件，确保压缩包根目录包含 `index.html`。
