## 简介

- 通过使用特定装饰器装饰过的类进行获得强类型化数据返回的一个模块
- 数据来源可以是`HttpClient`并且不仅仅为请求
- 可以直接设置类数据源,也可以在类数据源的基础上设置属性数据源,单独获得某一属性
- 支持属性多装饰器处理,当使用多装饰器时,只有第一个装饰器生效,其余装饰器使用`itemSelect`对该属性操作
- 可以设置类继承,和属性继承,设置继承之后,数据默认从父级装饰器中的数据源方法中获得

## 使用

```ts
@ClassDataSource({
  source: () => of([{ name: 'hello' }]),
})
class Test {
  name: string;
}

repository.findMany(Test).subscribe((res) => {
  //doc 返回Test类实例数组 [{ name: 'hello' }]
});
```

