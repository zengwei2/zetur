// <!-- vetur 使用 词法高亮、Language API、Language Server Protocol 三类技术实现核心逻辑 -->
// <!--
//   一、VSCODE 调试快捷键：
//     先输入 ctrl + shift + p
//     1. 输入 Developer: Generate Color Theme From Current Settings 使用当前生成的主题颜色
//     2. 输入 Developer: Inspect Editor Tokens and Scopes 检查编辑器标记和作用域

//   二、Language API 的入口在 package.json 的 main 字段对应的文件内容
//     package.json:
//       - activationEvents: 在什么情况下激活运行插件
//       - main: 插件的入口文件( 这是经过编译的文件，源码在 client/vueMain.ts )

//     三要素：事件( registerXXXProvider )、参数、响应头

//     示例 API:
//       1 vscode.language.registerHoverProvider // hover 提示
//       2 vscode.language.registerCompletionItemProvider // 代码补全

//   三、Language Server Protocol
//     ( 对 Language API 的升级，叫基于 LSP 的可编程语言扩展 )
//     优点：性能 => CPU操作转移到子进程执行

//     前提：需了解 client 和 server
//     client: 在 client/vueMain.ts -> client/client.ts 文件下 (vscode-languageclient)
//     server: 在 server/vueServerMain.ts

//   四、词法分析
//     在：package.json - contributes - grammars - language 为 Vue( 在 ./syntaxes/vue-generated.json )

//     词法高亮的都在 syntaxes 文件夹下( 就是标签高亮 )

//     如：匹配 template 开始标签: (<)(template)(?=[^>]*>[^/>]*</template>)

//   五、代码补全
//     doComplete 方法
//     如：识别到 mode vue( 输入 v 时，提示 '<vue> with default Value'，按 enter 就出现生成的模板)
//     在 server/modes/xxx 文件夹下，会进行分割成不同的 mode( vue|template|script|style )

//   六、错误诊断
//     doValidation 方法
//     出现错误时，鼠标移上去会进行错误提示
//     也是在 server/modes/xxx 文件夹下

//   七、格式化
//     format 方法

//   八、查找定义
//     find definition( 选中然后右键第一个会自动跳转到定义那个方法的位置 )

//   解决 yarn watch 报错：
//     1. // @ts-nocheck 注释整个文件
//     2. 当前 cmd 窗口设置 node 允许的最大内存：set NODE_OPTIONS=--max-old-space-size=218192

//   调试 LSP:
//      1. 先运行 client，再在 server 相关文件打上 debugger, 再运行 server、再刷新调试

//      1. 先打上 vscode 的 debugger( 行数左边红点 )，再运行 client，再运行 server，再刷新,
//      2. 如果调试时打上新的 debugger，则需要重新刷新

//   -->
