import vscode from 'vscode';
import {
  LanguageClient,
  RevealOutputChannelOn,
  ServerOptions,
  TransportKind,
  LanguageClientOptions,
  DocumentFilter
} from 'vscode-languageclient/node';
import { resolve } from 'path';
import { existsSync } from 'fs';

export function initializeLanguageClient(vlsModulePath: string, globalSnippetDir: string): LanguageClient {
  // 调试诶这
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6005'] };

  const documentSelector: DocumentFilter[] = [{ language: 'vue', scheme: 'file' }];
  // 在 package.json 的 contributes.configuration 设置的，然后用户可以在 vscode 的 setting.json 中设置对应的属性名,
  // 通过这就可以获取到用户的配置,
  // vetur 属性： package.json 中 contributes.configuration 设置的 + vscode 默认配置
  // config: { xxx 像是 vscode 默认的配置，vetur: { ignoreProjectWarning: false, useWorkspaceDependencies: false, xxx  } }
  const config = vscode.workspace.getConfiguration();

  let serverPath;

  const devVlsPackagePath = config.get('vetur.dev.vlsPath', '');
  if (devVlsPackagePath && devVlsPackagePath !== '' && existsSync(devVlsPackagePath)) {
    serverPath = resolve(devVlsPackagePath, 'dist/vueServerMain.js');
  } else {
    // "d:\\project\\vscode-plugin\\vscode-plugin-one\\vue-vscode-vetur-master\\server\\dist\\vueServerMain.js"
    serverPath = vlsModulePath;
  }

  const runExecArgv: string[] = [];
  const vlsPort = config.get('vetur.dev.vlsPort'); // -1
  if (vlsPort !== -1) {
    runExecArgv.push(`--inspect=${vlsPort}`);
    console.log(`Will launch VLS in port: ${vlsPort}`);
  }

  // 服务端配置信息
  const serverOptions: ServerOptions = {
    // transport: 进程之间的通讯方式
    run: { module: serverPath, transport: TransportKind.ipc, options: { execArgv: runExecArgv } },
    debug: { module: serverPath, transport: TransportKind.ipc, options: debugOptions }
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector, // 定义插件在什么文件下会生效
    synchronize: {
      configurationSection: [
        'vetur',
        'sass',
        'emmet',
        'html',
        'css',
        'javascript',
        'typescript',
        'prettier',
        'stylusSupremacy',
        'languageStylus'
      ],
      fileEvents: vscode.workspace.createFileSystemWatcher('{**/*.js,**/*.ts,**/*.json}', false, false, true)
    },
    initializationOptions: {
      config,
      globalSnippetDir
    },
    revealOutputChannelOn: RevealOutputChannelOn.Never
  };

  // 创建 Language Client 对象
  return new LanguageClient('vetur', 'Vue Language Server', serverOptions, clientOptions);
}
