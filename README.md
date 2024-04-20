# 使用方法

## 事件修饰器

```ts
import { ModifierEventsPlugin } from '@cyia/ngx-common/event';
@NgModule({
 //...
  providers: [
    ModifierEventsPlugin,
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ModifierEventsPlugin,
      multi: true,
      deps: [DOCUMENT],
    },
  ],
 //...
})
```

- 内部 output 使用`once`修饰符

```ts
import { injectEventModifier } from '@cyia/ngx-common/event';

  constructor() {
    // 自动处理
    injectEventModifier(this);
  }
```

# 更新日志

## 10.1.0

- 增加`monaco-textmate`模块,用于在 monaco 中使用 vscode 相关主题及 token 分割方法

## 10.0.1

- 暴露载入提示组件相关常量

## 10.0.0

- 升级至 ng10 版本
- 增加动态懒加载组件指令及对动态懒加载组件的自定义表单控件支持

## 9.0.0

- 升级至 ng9 版本
  > `ComponentFactory.create`不能自定义选择器,否则无法销毁,原因未知(Angular Material Design 中的 cdk 也是外面包了一层)
- 为了更明显的更新依赖包,主版本号和 Angular 的版本号一致

## 2.2.1

- 增加了自动化生成使用文档和代码注释(简易,正在制作)

## 2.2.0

- 废弃`CyiaHttpModule`使用,改为`CyiaRepositoryModule`
  > 解耦,提高灵活性

## 2.1.7

- 重写了载入提示组件

## 2.03

- 请求参数类型增加

## 2.02

- 结构化实体中的 bug 修复

## 1.2.0

- 升级为 ng7 编译

## 1.1.9

- 对请求地址整合的'/'处理

## 1.1.8

- 更新编译方式

## 1.1.6

- 更新 http 合并参数的一个错误

## 1.1.3

- 修正依赖 需要 rxjs

## 1.1.1

- 增加 window 类型判断

## 1.1.0

- 增加 http 请求封装
- 增加深度对象复制封装
