# 发布清单 / Publishing checklist

插件已经按公开发布的要求准备好（包名、许可证、`repository`、`engines.dsh`、README、构建产物）。剩下的是需要账号的操作。

> 目标仓库：`feiniao1933/dsh-token-balance`（GitHub 用户名来自本机已有的 GitHub SSH 身份）。
> npm 包名：`dsh-token-balance`（已确认未被占用）。
> 许可证：MIT。

## 1. 创建 GitHub 仓库并推送

仓库目前还不存在。用浏览器打开：

https://github.com/new?name=dsh-token-balance

- Owner: `feiniao1933`
- Repository name: `dsh-token-balance`
- Public
- 不要勾选 README / .gitignore / license（本地已有）

然后在本目录执行：

```sh
git push -u origin main
```

（本目录已经初始化并提交，`origin` 已配置为 `git@github.com:feiniao1933/dsh-token-balance.git`；本机 GitHub SSH 身份已验证为 `feiniao1933`。）

推送后到仓库 **About** 里加上 topic `dsh-plugin`（awesome-dsh-plugin 的 CI 会检查）。

## 2. 发布 npm 包

先登录（只需一次）：

```sh
npm login
```

确认身份后发布：

```sh
npm publish --access public
```

验证：

```sh
npm view dsh-token-balance version
```

> 如果 `npm login` 需要浏览器或一次性密码，请在你自己的终端里完成，然后告诉我继续。
> 也可以先不发布 npm：dshopen 支持固定的 GitHub 提交，awesome-dsh-plugin 支持 GitHub Release 的 tarball；但 npm 是最省事的安装来源。

## 3. 提交到 Open Plugin Market（dshopen.org）

打开：

https://github.com/polang233/dsh-plugin-index/issues/new?template=plugin-add.yml

标题和正文直接用 [`dshopen-issue.md`](dshopen-issue.md)，附 1–2 张真实截图（可选但推荐）。

## 4. 提交到 awesome-dsh-plugin（dsh-market 的目录）

给 https://github.com/awesome-dsh-plugin/awesome-dsh-plugin 开一个 PR，只新增一个文件：

```text
data/plugins/feiniao1933__dsh-token-balance.yml
```

内容为 [`awesome-dsh-plugin.yml`](awesome-dsh-plugin.yml)。

注意：

- 仓库需要**创建满 1 天**后 CI 才会通过（刚建的仓库会被自动拒绝）。
- 分类用 `usage`。
- 仓库需要 topic `dsh-plugin`。

## 5. 可选：GitHub Release 备份

如果暂时不发布 npm，可以把 `npm pack` 生成的 `dsh-token-balance-1.0.1.tgz` 附加到 GitHub Release，并在 awesome-dsh-plugin 的条目里加：

```yaml
tarball: https://github.com/feiniao1933/dsh-token-balance/releases/download/v1.0.1/dsh-token-balance-1.0.1.tgz
```

（文件名带版本号时必须钉住 release tag；用 `latest/download/` 时文件名不要带版本。）
