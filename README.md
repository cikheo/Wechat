# CikTab 微信公众号关注页

分享技术知识、数字生活，探索技术的边界，记录生活的点滴！

## 构建与部署

构建环境：Node.js `^20.19.0 || >=22.12.0`，npm。

安装依赖并构建：

```sh
npm ci
npm run build
```

构建产物位于 `dist/`。将该目录内的全部文件部署到对应站点根目录，配置域名与 HTTPS 即可。线上采用静态文件托管，无需运行 Node.js 服务。

本地预览构建结果：

```sh
npm run preview
```

访问 `http://localhost:4174/` 查看。
