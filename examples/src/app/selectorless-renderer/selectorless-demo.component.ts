/**
 * Selectorless Renderer 演示主组件
 *
 * 这个组件负责:
 * 1. 在 ngOnInit 中调用 selectorlessExcludeTag() 注册需要排除的选择器
 * 2. 导入所有子示例组件
 * 3. 提供交互控制面板的功能
 */
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { selectorlessExcludeTag, setSelectorlessFilter } from '@cyia/ngx-common/service';
// 导入所有示例组件 (从 all-examples.component.ts)
import {
  SCompTag1Example,
  STagComp1Example,
  STagCompTag1Example,
  SMultiTagCompExample,
  SNestedTagCompExample,
  SAlternatingCompTagExample,
  SMultiChildCompExample,
  SMixedContentCompExample,
  SDeepNestedCompExample,
  SForCompExample,
  SIfCompExample,
  SSwitchCompExample,
  SNestedExcludedCompsExample,
  SMixedNormalExcludedExample,
  SContentOutletCompExample,
  SMultiExcludedExample,
  STemplateComp1Example,
  SCompTemplate1Example,
  STemplateTagCompExample,
  SCompTagTemplateExample,
  SStaticDynamicCompExample,
  SDynamicStaticCompExample,
  STemplateCompDynamicExample,
  SCompTemplateDynamicExample,
  SCompDynamicTemplateExample,
  SDynamicCompTemplateExample,
  STemplateDynamicCompExample,
  SDynamicTemplateCompExample,
  SCompTagDynamicExample,
  SDynamicTagCompExample,
  STagCompDynamicExample,
  STagDynamicCompExample,
  SDynamicCompTagExample,
  SCompDynamicTagExample,
  SCompIfExample,
  SIfComp1Example,
  SIfTagCompExample,
  SCompIfTagExample,
  SForComp1Example,
  SCompForExample,
  SSwitchComp1Example,
  SCompSwitchExample,
  SCompForTagExample,
  STagForCompExample,
  SCompInTemplateExample,
  SCompInDynamicExample,
  SAllMixedExample,
  SAllMixedReverseExample,
  SCompToggleExample,
  SMultiCompToggleExample,
  SForCompToggleExample,
  SInsertPositionExample,
  SCompInContainerExample,
  SCompWithCommentExample,
  STextOnlyCompExample,
  SSpecialCharsCompExample,
  SAfterContentDemoExample,

  // 基础组件 (用于直接展示)
  SNormalComp,
  SNoSelectorComp,
  SExcludedComp,
  SBeforeComp,
} from './all-examples.component';

setSelectorlessFilter((name) => name.startsWith('app-s'));

@Component({
  selector: 'selectorless-renderer-demo',
  standalone: true,
  imports: [
    NgIf,
    // 基础组件 (用于直接展示)
    SNormalComp,
    SNoSelectorComp,
    SExcludedComp,
    SBeforeComp,
    // 所有示例组件 (其他基础组件已通过子组件的 imports 自动注入)
    SCompTag1Example,
    STagComp1Example,
    STagCompTag1Example,
    SMultiTagCompExample,
    SNestedTagCompExample,
    SAlternatingCompTagExample,
    SMultiChildCompExample,
    SMixedContentCompExample,
    SDeepNestedCompExample,
    SForCompExample,
    SIfCompExample,
    SSwitchCompExample,
    SNestedExcludedCompsExample,
    SMixedNormalExcludedExample,
    SContentOutletCompExample,
    SMultiExcludedExample,
    STemplateComp1Example,
    SCompTemplate1Example,
    STemplateTagCompExample,
    SCompTagTemplateExample,
    SStaticDynamicCompExample,
    SDynamicStaticCompExample,
    STemplateCompDynamicExample,
    SCompTemplateDynamicExample,
    SCompDynamicTemplateExample,
    SDynamicCompTemplateExample,
    STemplateDynamicCompExample,
    SDynamicTemplateCompExample,
    SCompTagDynamicExample,
    SDynamicTagCompExample,
    STagCompDynamicExample,
    STagDynamicCompExample,
    SDynamicCompTagExample,
    SCompDynamicTagExample,
    SCompIfExample,
    SIfComp1Example,
    SIfTagCompExample,
    SCompIfTagExample,
    SForComp1Example,
    SCompForExample,
    SSwitchComp1Example,
    SCompSwitchExample,
    SCompForTagExample,
    STagForCompExample,
    SCompInTemplateExample,
    SCompInDynamicExample,
    SAllMixedExample,
    SAllMixedReverseExample,
    SCompToggleExample,
    SMultiCompToggleExample,
    SForCompToggleExample,
    SInsertPositionExample,
    SCompInContainerExample,
    SCompWithCommentExample,
    STextOnlyCompExample,
    SSpecialCharsCompExample,
    SAfterContentDemoExample,
  ],
  templateUrl: './component.html',
  styleUrl: './component.scss',
})
export class SelectorlessRendererDemoComponent implements OnInit {
  /** 当前是否处于排除模式 */
  isExcluded = true;

  /** 动态组件列表 */
  dynamicComps = signal<string[]>([]);

  /** 获取组件数量 */
  get compCount(): number {
    return this.dynamicComps().length;
  }

  ngOnInit(): void {
    // 注册所有需要排除的选择器
  }

  /** 添加组件 */
  addComp(): void {
    this.dynamicComps.update((comps) => [...comps, `comp-${Date.now()}`]);
  }

  /** 移除最后一个组件 */
  removeComp(): void {
    this.dynamicComps.update((comps) => comps.slice(0, -1));
  }

  /** 重置所有组件 */
  resetComps(): void {
    this.dynamicComps.set([]);
  }
}
