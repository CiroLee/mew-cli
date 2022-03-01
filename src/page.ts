import path from 'path';
import Log from './log';
import fs from 'fs-extra';
import { promptsCancel } from './utils/utils';
import prompts, { PromptObject } from 'prompts';
import { createPageMsg, overWriteFiles } from './questions';
import { vuePageTpl, reactPageTpl, moduleScss } from './tpl';
import { Project, ScriptTarget, VariableDeclarationKind, QuoteKind } from 'ts-morph';
import type { updateRouterParam } from './types/page';

const logger = new Log();
const cwd = process.cwd();

const project = new Project({
  compilerOptions: {
    target: ScriptTarget.ESNext,
  },
  manipulationSettings: {
    quoteKind: QuoteKind.Single,
  },
});

// 创建页面， 总入口函数
const createPage = async () => {
  const regex = /^[a-zA-Z][a-zA-Z-]*$/;
  const pkg = fs.readFileSync(path.join(cwd, '/package.json'), 'utf-8');
  const { pageName, dirName } = await prompts(createPageMsg as PromptObject[], { onCancel: promptsCancel });
  function pkgHasProperty(property: string) {
    return Object.prototype.hasOwnProperty.call(JSON.parse(pkg)?.dependencies, property);
  }

  if (!regex.test(pageName) || !dirName) {
    logger.warn('请输入正确的页面名称或路径名称');
    createPage();
  } else if (pkgHasProperty('vue')) {
    createVuePage(cwd, pageName, dirName);
  } else if (pkgHasProperty('react')) {
    createReactPage(cwd, pageName, dirName);
  }
};

// 创建vue页面
const createVuePage = async (cwd: string, name: string, pathName: string) => {
  try {
    const tpl = vuePageTpl(name);
    const dest = path.join(cwd, `/src/pages/${name}.vue`);
    if (fs.existsSync(dest)) {
      const { isOverWrite } = await prompts(overWriteFiles as PromptObject, { onCancel: promptsCancel });

      if (isOverWrite) {
        await fs.writeFile(dest, tpl, 'utf-8');
      } else {
        createPage();
      }
    } else {
      await fs.writeFile(dest, tpl, 'utf-8');
      updateRouter({ cwd, pageName: name, pathName });
    }
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
};
// 创建react页面
const createReactPage = async (cwd: string, name: string, pathName: string) => {
  try {
    const tpl = reactPageTpl(name);
    const dest = path.join(cwd, `/src/pages/${name}/index.tsx`);
    const scssDest = path.join(cwd, `src/pages/${name}/index.module.scss`);
    if (fs.existsSync(dest) && fs.existsSync(scssDest)) {
      const { isOverWrite } = await prompts(overWriteFiles as PromptObject, { onCancel: promptsCancel });
      if (isOverWrite) {
        await fs.outputFile(dest, tpl, 'utf-8');
        await fs.outputFile(scssDest, moduleScss, 'utf-8');
      } else {
        createPage();
      }
    } else {
      await fs.outputFile(dest, tpl, 'utf-8');
      await fs.outputFile(scssDest, moduleScss, 'utf-8');
      updateRouter({ cwd, pageName: name, pathName, type: 'react' });
    }
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
};
// 更新路由文件
const updateRouter = async ({ cwd, pageName, pathName, type = 'vue' }: updateRouterParam) => {
  try {
    const dest = type === 'vue' ? 'src/router.ts' : 'src/routes/config.tsx';
    const sourceFile = project.addSourceFileAtPath(path.resolve(cwd, dest));
    const componentName = pageName
      .split(/-/g)
      .map(item => `${item.charAt(0).toUpperCase()}${item.slice(1)}`)
      .join('');
    // 引入page组件
    if (type === 'vue') {
      sourceFile.addImportDeclaration({
        defaultImport: componentName,
        moduleSpecifier: `@/pages/${pageName}.vue`,
      });
    } else {
      /**react插入方式略有不同, react为懒加载组件
       * 将const xxx = lazy(...) 插入到指定行
       */
      const imports = sourceFile.getImportDeclarations();
      const components = sourceFile
        .getVariableDeclarations()
        .filter(item => item.getType().getText() !== 'RouteConfigProps[]');
      sourceFile.insertVariableStatement(components.length + imports.length, {
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: componentName,
            initializer: `lazy(() => import('@/pages/${pageName}'))`,
          },
        ],
      });
      // 按需插入空行
      sourceFile.insertStatements(imports.length + components.length + 1, writer => {
        if (!writer.isInComment()) {
          return;
        }
        writer.newLine();
      });
    }
    // 路由标识， 用于过滤路由代码块
    const typeMark = type === 'vue' ? 'RouteRecordRaw[]' : 'RouteConfigProps[]';
    // note: 格式化后的代码， 如待写入的router文件格式相同
    const vueRouteItem = `
  {
    path: '/${pathName ?? pageName}',
    name: '/${pageName}',
    component: ${componentName}
  },
]`;
    const reactRouteItem = `
  {
    path: '/${pathName ?? pageName}',
    name: '/${pageName}',
    element: <${componentName} />,
  },
]`;
    // 插入路由item
    const item = type === 'vue' ? vueRouteItem : reactRouteItem;
    const routes = sourceFile
      .getVariableDeclarations()
      .filter(item => item.getType().getText() === typeMark)[0]
      .getInitializerOrThrow();

    let routeItemText = JSON.stringify(routes.getText()).slice(0, -4);
    routeItemText += JSON.stringify(item).slice(1);

    routes.replaceWithText(JSON.parse(routeItemText));
    await sourceFile.save();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
};

export default createPage;
