# 发布状态 / Publishing status

## 已完成

- 公开源码仓库：https://github.com/feiniao1933/dsh-token-balance（`main` 已推送）
- 发布用包：`dsh-token-balance@1.0.1`，MIT，`repository` / `engines.dsh` / `dsh.bundle.patch` 齐全
- `npm pack` 产物：`dsh-token-balance-1.0.1.tgz`（已在临时目录安装验证）
- 社区提交材料：`community/dshopen-issue.md`、`community/awesome-dsh-plugin.yml`

## 1. 给仓库加 topic

打开 https://github.com/feiniao1933/dsh-token-balance ，点 **About** 旁的齿轮，在 **Topics** 加：

```text
dsh-plugin
```

awesome-dsh-plugin 的 CI 会检查这个 topic。

## 2. 提交 Open Plugin Market（dshopen.org）

打开本地生成的 `community/SUBMIT-LINKS.md`（该文件不随仓库发布）里的收录申请链接（已预填标题、正文和固定提交 SHA），附 1–2 张截图后提交。

dshopen 支持固定 GitHub 提交，不需要先发布 npm。

## 3. 提交 awesome-dsh-plugin（dsh-market 目录）

给 https://github.com/awesome-dsh-plugin/awesome-dsh-plugin 开 PR，只新增：

```text
data/plugins/feiniao1933__dsh-token-balance.yml
```

内容为 [awesome-dsh-plugin.yml](awesome-dsh-plugin.yml)。

**注意：仓库创建满 1 天后 CI 才会通过**（今天是 2026-11-07，明天再提交）。分类已选 `usage`。

## 4. 以后发布 npm（可选）

登录一次后：

```sh
npm login
npm publish --access public
```

发布后把 dshopen 的申请从固定提交改为跟踪 npm `latest`，并在本仓库加 npm 徽章。

## 5. 可选：GitHub Release

`npm pack` 生成的 `dsh-token-balance-1.0.1.tgz` 可以附加到 GitHub Release，作为源码安装之外的备选来源；awesome 条目可加：

```yaml
tarball: https://github.com/feiniao1933/dsh-token-balance/releases/download/v1.0.1/dsh-token-balance-1.0.1.tgz
```
