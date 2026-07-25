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
import { selectorlessExcludeTag, selectorlessResetTag } from '../../../../lib/src/service/exclude-component';
import { reflectComponentType } from '@angular/core';

// 导入所有示例组件 (从 all-examples.component.ts)
import {
  SCompTag1Example, STagComp1Example, STagCompTag1Example,
  SMultiTagCompExample, SNestedTagCompExample,
  SAlternatingCompTagExample, SMultiChildCompExample,
  SMixedContentCompExample, SDeepNestedCompExample,
  SForCompExample, SIfCompExample, SSwitchCompExample,
  SNestedExcludedCompsExample, SMixedNormalExcludedExample,
  SContentOutletCompExample, SMultiExcludedExample,
  STemplateComp1Example, SCompTemplate1Example,
  STemplateTagCompExample, SCompTagTemplateExample,
  SStaticDynamicCompExample, SDynamicStaticCompExample,
  STemplateCompDynamicExample, SCompTemplateDynamicExample,
  SCompDynamicTemplateExample, SDynamicCompTemplateExample,
  STemplateDynamicCompExample, SDynamicTemplateCompExample,
  SCompTagDynamicExample, SDynamicTagCompExample,
  STagCompDynamicExample, STagDynamicCompExample,
  SDynamicCompTagExample, SCompDynamicTagExample,
  SCompIfExample, SIfComp1Example, SIfTagCompExample,
  SCompIfTagExample, SForComp1Example, SCompForExample,
  SSwitchComp1Example, SCompSwitchExample,
  SCompForTagExample, STagForCompExample,
  SCompInTemplateExample, SCompInDynamicExample,
  SAllMixedExample, SAllMixedReverseExample,
  SCompToggleExample, SMultiCompToggleExample, SForCompToggleExample,
  SInsertPositionExample, SCompInContainerExample,
  SCompWithCommentExample, STextOnlyCompExample,
  SSpecialCharsCompExample, SAfterContentDemoExample,

  // 基础组件 (用于直接展示)
  SNormalComp, SNoSelectorComp, SExcludedComp, SBeforeComp,

  // 辅助组件 (用于获取选择器)
  SExcludedComp as SE1, SBeforeComp as SB1, SMultiFirstComp as SMF1,
  SMultiMiddleComp as SMM1, SMultiLastComp as SML1,
  SCTComp1Comp as SCt1, STCComp1Comp as STc1, STagCompTag1Comp as SCT1,
  SMultiTagCompComp as STM, SNestedTagCompComp as STN,
  SAltC1Comp as SAC1, SAltC2Comp as SAC2,
  SMultiChildCompComp as SMC, SMixedContentCompComp as SMTX,
  SDeepNestedCompComp as SDN, SForCompComp as SFC,
  SIfCompComp as SIFC, SSwitchCompComp as SSWC,
  SOuterNestedExcludedComp as SOE, SInnerNestedExcludedComp as SIE,
  SMixedExcludedComp as SME, SContentOutletComp as SCO,
  SSDynamicComp as SDY, SSDStaticComp as SST,
  SCTt1Comp, STCt1Comp,
  SCTDComp, SDTCComp, STCDComp, STDCComp, SDCTComp, SCDTComp,
  SCIfComp, SICIf1Comp, SITCIfComp, SCItIfComp,
  SFCFor1Comp, SCFComp, SSSComp1, SCsComp,
  SCFTComp, STFCComp,
  SCItComp, SCIdExcludedComp, SCIdContainerComp,
  SToggleComp, SIpComp1, SIpComp2,
  SCICComp, SWCComp, STextOnlyComp, SSpecialCharsComp,
} from './all-examples.component';

/** 收集所有需要排除的选择器 */
function getAllExcludedSelectors(): string[] {
  const selectors = new Set<string>();
  
  // 从已定义的组件中收集选择器
  const compClasses = [
    SE1, SB1, SMF1, SMM1, SML1,
    SCt1, STc1, SCT1,
    STM, STN,
    SAC1, SAC2,
    SMC, SMTX,
    SDN, SFC,
    SIFC, SSWC,
    SOE, SIE,
    SME, SCO,
    SDY, SST,
    SCTt1Comp, STCt1Comp,
    SCTDComp, SDTCComp, STCDComp, STDCComp, SDCTComp, SCDTComp,
    SCIfComp, SICIf1Comp, SITCIfComp, SCItIfComp,
    SFCFor1Comp, SCFComp, SSSComp1, SCsComp,
    SCFTComp, STFCComp,
    SCItComp, SCIdExcludedComp, SCIdContainerComp,
    SToggleComp, SIpComp1, SIpComp2,
    SCICComp, SWCComp, STextOnlyComp, SSpecialCharsComp,
  ];

  for (const Comp of compClasses) {
    const reflected = reflectComponentType(Comp);
    if (reflected?.selector) {
      selectors.add(reflected.selector);
    }
  }

  return [...selectors];
}

@Component({
  selector: 'selectorless-renderer-demo',
  standalone: true,
  imports: [
    NgIf,
    // 基础组件 (用于直接展示)
    SNormalComp, SNoSelectorComp, SExcludedComp, SBeforeComp,
    // 所有示例组件 (其他基础组件已通过子组件的 imports 自动注入)
    SCompTag1Example, STagComp1Example, STagCompTag1Example,
    SMultiTagCompExample, SNestedTagCompExample,
    SAlternatingCompTagExample, SMultiChildCompExample,
    SMixedContentCompExample, SDeepNestedCompExample,
    SForCompExample, SIfCompExample, SSwitchCompExample,
    SNestedExcludedCompsExample, SMixedNormalExcludedExample,
    SContentOutletCompExample, SMultiExcludedExample,
    STemplateComp1Example, SCompTemplate1Example,
    STemplateTagCompExample, SCompTagTemplateExample,
    SStaticDynamicCompExample, SDynamicStaticCompExample,
    STemplateCompDynamicExample, SCompTemplateDynamicExample,
    SCompDynamicTemplateExample, SDynamicCompTemplateExample,
    STemplateDynamicCompExample, SDynamicTemplateCompExample,
    SCompTagDynamicExample, SDynamicTagCompExample,
    STagCompDynamicExample, STagDynamicCompExample,
    SDynamicCompTagExample, SCompDynamicTagExample,
    SCompIfExample, SIfComp1Example, SIfTagCompExample,
    SCompIfTagExample, SForComp1Example, SCompForExample,
    SSwitchComp1Example, SCompSwitchExample,
    SCompForTagExample, STagForCompExample,
    SCompInTemplateExample, SCompInDynamicExample,
    SAllMixedExample, SAllMixedReverseExample,
    SCompToggleExample, SMultiCompToggleExample, SForCompToggleExample,
    SInsertPositionExample, SCompInContainerExample,
    SCompWithCommentExample, STextOnlyCompExample,
    SSpecialCharsCompExample, SAfterContentDemoExample,
  ],
  templateUrl: './component.html',
  styleUrl: './component.scss',
})
export class SelectorlessRendererDemoComponent implements OnInit, OnDestroy {
  
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
    const selectors = getAllExcludedSelectors();
    console.log('Selectorless: Registering excluded selectors:', selectors);
    
    selectorlessResetTag();
    selectors.forEach(selector => {
      selectorlessExcludeTag(selector);
    });
  }

  ngOnDestroy(): void {
    // 清理排除列表
    selectorlessResetTag();
  }

  /** Toggle exclude mode */
  toggleExclude(): void {
    this.isExcluded = !this.isExcluded;
    if (this.isExcluded) {
      const selectors = getAllExcludedSelectors();
      selectors.forEach(selector => selectorlessExcludeTag(selector));
    } else {
      selectorlessResetTag();
    }
  }

  /** 添加组件 */
  addComp(): void {
    this.dynamicComps.update(comps => [...comps, `comp-${Date.now()}`]);
  }

  /** 移除最后一个组件 */
  removeComp(): void {
    this.dynamicComps.update(comps => comps.slice(0, -1));
  }

  /** 重置所有组件 */
  resetComps(): void {
    this.dynamicComps.set([]);
  }
}
