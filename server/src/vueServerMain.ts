import { createConnection, InitializeParams, InitializeResult } from 'vscode-languageserver/node';
import { VLS } from './services/vls';

// 1. 初始化 LSP 连接对象
const connection = process.argv.length <= 2 ? createConnection(process.stdin, process.stdout) : createConnection();

// 2. 创建文档集合对象，用于映射到实际文档( 在 ./services/documentService.ts 的 new TextDocuments() )
console.log = (...args: any[]) => connection.console.log(args.join(' '));
console.error = (...args: any[]) => connection.console.error(args.join(' '));

const vls = new VLS(connection);
connection.onInitialize(
  async (params: InitializeParams): Promise<InitializeResult> => {
    await vls.init(params);

    console.log('Vetur initialized');

    // 明确声明插件文件支持的语言特性，如:
    //   capabilities: { hoverProvider: true; // hover 提示, xxx }   
    return {
      capabilities: vls.capabilities
    };
  }
);

// 启动、监听
vls.listen();
