const HarmonyImportSpecifierDependency = require('webpack/lib/dependencies/HarmonyImportSpecifierDependency');
const { IGNORE } = require('./const');
const PLUGIN_NAME = 'ModuleTraversePluginV2';

class ModuleTraversePluginV2 {
  constructor(options) {
    this.packages = options?.packages ?? [/.*/];
    this.ignore = options?.ignore ?? IGNORE;
    this.info = new Map();
    this.entry = '';
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.afterOptimizeDependencies.tap(PLUGIN_NAME, () => {
        const entries = compilation.entries;
        const moduleGraph = compilation.moduleGraph;

        const collect = (curModule, visited) => {
          const curModuleName = curModule.resource;
          visited.add(curModuleName);
          const modules = new Set();

          for (let dep of curModule.dependencies) {
            const module = moduleGraph.getModule(dep);
            if (module) {
              const moduleName = module.resource;
              if (IGNORE.some((i) => i.test(moduleName))) continue;
              if (visited.has(moduleName)) continue;

              modules.add(module);
            }
          }
          // 收集导入
          console.log(curModuleName);
          const filteredDep = curModule.dependencies.filter((i) => {
            return (
              i instanceof HarmonyImportSpecifierDependency &&
              this.packages.some((packageExp) => packageExp.test(i.request))
            );
          });
          filteredDep.forEach((dep) => {
            const pkg = dep.request;
            const comp = dep.name;
            const block = this.info.get(this.entry);
            if (!block.has(pkg)) {
              block.set(pkg, new Set());
            }
            block.get(pkg).add(comp);
          });

          // 遍历依赖模块
          for (let module of modules) {
            collect(module, visited);
          }
        };

        entries.forEach((entry) => {
          const { dependencies } = entry;
          const entryModule = compilation.moduleGraph.getModule(
            dependencies[0]
          );
          this.info.set(entry.options.name, new Map());
          this.entry = entry.options.name;

          const visited = new Set();
          collect(entryModule, visited);
        });
      });
    });
  }
}

module.exports = ModuleTraversePluginV2;
