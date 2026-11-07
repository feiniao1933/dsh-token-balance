# dshopen.org 收录申请

打开 https://github.com/polang233/dsh-plugin-index/issues/new?template=plugin-add.yml

## 标题

```text
[plugin-add] dsh-token-balance
```

## 插件地址 / Plugin link

```text
dsh-token-balance
https://github.com/feiniao1933/dsh-token-balance
```

## 简短说明 / Summary

中文：

```text
在 DSH 输入框下方的状态行（上下文占用百分比旁边）实时显示 DeepSeek 账户可用余额，金额为充值余额 + 赠送余额的合计，悬停可看分项和更新时间。挂载时、每 30 秒、标签页重新可见/获得焦点、当前会话一轮结束以及点击时刷新。数据来自已登录账户的 account/getBalance，不读取或保存 API Key。未登录和读取失败都有明确提示。
```

English:

```text
A live DeepSeek account-balance chip in the DSH composer dock, next to the context-usage meter. It shows the total of recharge plus bonus credit, with a hover breakdown and last-update time, and refreshes on mount, every 30 seconds, on tab focus/visibility, when the current turn ends, and on click. It reads the signed-in account through account/getBalance and never stores an API key. Signed-out and failed reads have explicit states.
```

## 截图 / Screenshots

附 1–2 张实际使用截图（输入框下方状态行里的余额胶囊 + 悬停明细），提交前遮住账号信息。

## 补充信息 / Additional details

```text
Logo: 包内 icon.svg（也通过 ./icon 导出）
测试版本：DSH 0.2.2-rc.1，macOS
许可证：MIT
npm 包名：dsh-token-balance
仓库：https://github.com/feiniao1933/dsh-token-balance
安装：dsh plugin --profile web add dsh-token-balance
```
