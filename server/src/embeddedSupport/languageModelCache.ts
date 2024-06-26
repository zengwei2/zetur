import { TextDocument } from 'vscode-languageserver-textdocument';

export interface LanguageModelCache<T> {
  /**
   * - Feed updated document
   * - Use `parse` function to re-compute model
   * - Return re-computed model
   */
  refreshAndGet(document: TextDocument): T;
  onDocumentRemoved(document: TextDocument): void;
  dispose(): void;
}

export function getLanguageModelCache<T>(
  maxEntries: number,
  cleanupIntervalTimeInSec: number,
  parse: (document: TextDocument) => T
): LanguageModelCache<T> {
  // 当前扩展开发宿主文件夹所有下包含的 .vue 文件后缀路径对象值:
  //  {
  //      'file://User/zengwei/xxx/index.vue': { languageId: 'vue', languageModel: { xxx } },
  //      'file://User/zengwei/xxx/test.vue': { languageId: 'vue', languageModel: { xxx } },
  //   }
  let languageModels: { [uri: string]: { version: number; languageId: string; cTime: number; languageModel: T } } = {};
  let nModels = 0;

  let cleanupInterval: NodeJS.Timer;
  if (cleanupIntervalTimeInSec > 0) {
    cleanupInterval = setInterval(() => {
      const cutoffTime = Date.now() - cleanupIntervalTimeInSec * 1000;
      const uris = Object.keys(languageModels);
      for (const uri of uris) {
        const languageModelInfo = languageModels[uri];
        if (languageModelInfo.cTime < cutoffTime) {
          delete languageModels[uri];
          nModels--;
        }
      }
    }, cleanupIntervalTimeInSec * 1000);
  }

  return {
    // document: { _languageId: 'vue', _content: '内容字符串', _lineOffsets: [xxx], version: 1, xxx }
    refreshAndGet(document: TextDocument): T {
      const version = document.version; // 1
      const languageId = document.languageId; // 'vue'
      // document.uri: 'file://User/zengwei/xxx/index.vue'
      // 查找匹配当前 index.vue 的 languageModels 里的对象值
      const languageModelInfo = languageModels[document.uri];
      // if 匹配为 true，所以直接返回匹配到的 languageModel
      if (languageModelInfo && languageModelInfo.version === version && languageModelInfo.languageId === languageId) {
        languageModelInfo.cTime = Date.now();
        return languageModelInfo.languageModel;
      }
      const languageModel = parse(document);
      languageModels[document.uri] = { languageModel, version, languageId, cTime: Date.now() };
      if (!languageModelInfo) {
        nModels++;
      }

      if (nModels === maxEntries) {
        let oldestTime = Number.MAX_VALUE;
        let oldestUri = null;
        for (const uri in languageModels) {
          const languageModelInfo = languageModels[uri];
          if (languageModelInfo.cTime < oldestTime) {
            oldestUri = uri;
            oldestTime = languageModelInfo.cTime;
          }
        }
        if (oldestUri) {
          delete languageModels[oldestUri];
          nModels--;
        }
      }
      return languageModel;
    },
    onDocumentRemoved(document: TextDocument) {
      const uri = document.uri;
      if (languageModels[uri]) {
        delete languageModels[uri];
        nModels--;
      }
    },
    dispose() {
      if (typeof cleanupInterval !== 'undefined') {
        clearInterval(cleanupInterval);
        cleanupInterval = null as any;
        languageModels = {};
        nModels = 0;
      }
    }
  };
}
