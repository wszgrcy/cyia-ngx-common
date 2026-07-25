/**
 * Selectorless Renderer 完整示例组件集合
 * 
 * 本文件包含所有用于演示 selectorless 功能的子组件。
 * 每个组件对应一个或多个示例,展示不同的渲染场景。
 */
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import {  NgTemplateOutlet, NgComponentOutlet } from '@angular/common';


// ============================================================
// 基础组件定义 (在模块外动态定义,用于演示)
// ============================================================

// --- 示例1: 普通有选择器组件 ---
@Component({
  standalone: true,
  selector: 'app-s-normal-comp',
  template: `<span>normal content</span>`,
})
export class SNormalComp {}

// --- 示例2: 无选择器组件 (真正的 selectorless) ---
@Component({
  standalone: true,
  selector: 'app-s-no-selector-comp',
  template: `<span>no-selector content</span>`,
})
export class SNoSelectorComp {}

// --- 示例3/5/等: 被排除的组件 ---
@Component({
  standalone: true,
  selector: 'app-s-excluded-comp',
  template: `<span>excluded content</span>`,
})
export class SExcludedComp {}

// --- 示例4: 排除前组件 ---
@Component({
  standalone: true,
  selector: 'app-s-before-comp',
  template: `before`,
})
export class SBeforeComp {}

// --- 示例4: 排除后组件 (无选择器,通过示例包装展示) ---
// Note: This component has no selector, so it's only used directly in templates, not as a tag

// --- 示例5: 多个被排除组件的变体 ---
@Component({
  standalone: true,
  selector: 'multi-first',
  template: `first`,
})
export class SMultiFirstComp {}

@Component({
  standalone: true,
  selector: 'multi-middle',
  template: `middle`,
})
export class SMultiMiddleComp {}

@Component({
  standalone: true,
  selector: 'multi-last',
  template: `last`,
})
export class SMultiLastComp {}

// --- 示例6: comp-tag-1 (组件在前) ---
@Component({
  standalone: true,
  selector: 'ct-comp1',
  template: `comp-content`,
})
export class SCTComp1Comp {}

// --- 示例7: tag-comp-1 (标签在前) ---
@Component({
  standalone: true,
  selector: 'tc-comp1',
  template: `comp-content`,
})
export class STCComp1Comp {}

// --- 示例8: tag-comp-tag-1 ---
@Component({
  standalone: true,
  selector: 'tct-comp1',
  template: `comp-content`,
})
export class STagCompTag1Comp {}

// --- 示例9: multi-tag-comp ---
@Component({
  standalone: true,
  selector: 'mtc-comp',
  template: `comp`,
})
export class SMultiTagCompComp {}

// --- 示例10: nested-tag-comp ---
@Component({
  standalone: true,
  selector: 'ntc-comp',
  template: `comp`,
})
export class SNestedTagCompComp {}

// --- 示例11: alternating comp-tag ---
@Component({
  standalone: true,
  selector: 'alt-c1',
  template: `c1`,
})
export class SAltC1Comp {}

@Component({
  standalone: true,
  selector: 'alt-c2',
  template: `c2`,
})
export class SAltC2Comp {}

// --- 示例12: multi-child-comp ---
@Component({
  standalone: true,
  selector: 'mcc-comp',
  template: `<span>a</span><span>b</span><span>c</span>`,
})
export class SMultiChildCompComp {}

// --- 示例13: mixed-content-comp ---
@Component({
  standalone: true,
  selector: 'mcc2-comp',
  template: `text <em>emphasis</em> more text`,
})
export class SMixedContentCompComp {}

// --- 示例14: deep-nested-comp ---
@Component({
  standalone: true,
  selector: 'dnc-comp',
  template: `<div><ul><li>nested</li></ul></div>`,
})
export class SDeepNestedCompComp {}

// --- 示例15: for-comp (被排除组件内部包含 @for) ---
@Component({
  standalone: true,
  selector: 'fc-for-comp',
  template: `@for(item of items(); track item){ <span>{{ item }}</span> }`,
})
export class SForCompComp {
  items = signal(['1', '2', '3']);
}

// --- 示例16: if-comp (被排除组件内部包含 @if) ---
@Component({
  standalone: true,
  selector: 'ic-if-comp',
  template: `@if(show()){ <span>shown</span> }`,
})
export class SIfCompComp {
  show = signal(true);
}

// --- 示例17: switch-comp (被排除组件内部包含 @switch) ---
@Component({
  standalone: true,
  selector: 'sc-switch-comp',
  template: `@switch(val()){ @case(1){ <span>one</span> } }`,
})
export class SSwitchCompComp {
  val = signal(1);
}

// --- 示例18: nested excluded comps ---
@Component({
  standalone: true,
  selector: 'inner-ne-comp',
  template: `<span>inner</span>`,
})
export class SInnerNestedExcludedComp {}

@Component({
  standalone: true,
  selector: 'outer-ne-comp',
  template: `<span>outer <inner-ne-comp></inner-ne-comp></span>`,
  imports: [SInnerNestedExcludedComp],
})
export class SOuterNestedExcludedComp {}

// --- 示例19: mixed normal + excluded ---
@Component({
  standalone: true,
  selector: 'mixed-excl-comp',
  template: `excluded`,
})
export class SMixedExcludedComp {}

// --- 示例20: content-outlet-comp (被排除组件使用 ng-content) ---
@Component({
  standalone: true,
  selector: 'co-comp',
  template: `<ng-content></ng-content>`,
})
export class SContentOutletComp {}

// ============================================================
// 动态插入相关示例 (21-38)
// ============================================================

// --- 示例21: template-comp-1 (模板 + 被排除组件) ---
@Component({
  standalone: true,
  selector: 'tc-t1-comp',
  template: `comp`,
})
export class STCt1Comp {}

// --- 示例22: comp-template-1 (被排除组件 + 模板) ---
@Component({
  standalone: true,
  selector: 'ct-t1-comp',
  template: `comp`,
})
export class SCTt1Comp {}

// --- 示例25: static-dynamic-comp ---
@Component({
  standalone: true,
  selector: 'sd-static',
  template: `<span>static-comp</span>`,
})
export class SSDStaticComp {}

@Component({
  standalone: true,
  selector: 'sd-dynamic',
  template: `dynamic`,
})
export class SSDynamicComp {}

// --- 示例33-38 需要的组件 ---
@Component({
  standalone: true,
  selector: 'ctd-comp',
  template: `<span>comp</span>`,
})
export class SCTDComp {}

@Component({
  standalone: true,
  selector: 'dtc-comp',
  template: `dynamic`,
})
export class SDTCComp {}

@Component({
  standalone: true,
  selector: 'tcd-comp',
  template: `before`,
})
export class STCDComp {}

@Component({
  standalone: true,
  selector: 'tdc-comp',
  template: `before`,
})
export class STDCComp {}

@Component({
  standalone: true,
  selector: 'dct-comp',
  template: `dynamic`,
})
export class SDCTComp {}

@Component({
  standalone: true,
  selector: 'cdt-comp',
  template: `<span>comp</span>`,
})
export class SCDTComp {}

// --- 示例39-42 @if related ---
@Component({
  standalone: true,
  selector: 'cif-comp',
  template: `<span>comp</span>`,
})
export class SCIfComp {}

@Component({
  standalone: true,
  selector: 'ic-if1-comp',
  template: `comp`,
})
export class SICIf1Comp {}

@Component({
  standalone: true,
  selector: 'itc-if-comp',
  template: `comp`,
})
export class SITCIfComp {}

@Component({
  standalone: true,
  selector: 'cit-if-comp',
  template: `<span>comp</span>`,
})
export class SCItIfComp {}

// --- 示例43-46 @for/@switch related ---
@Component({
  standalone: true,
  selector: 'fc-for1-comp',
  template: `comp`,
})
export class SFCFor1Comp {}

@Component({
  standalone: true,
  selector: 'cf-comp',
  template: `<span>comp</span>`,
})
export class SCFComp {}

@Component({
  standalone: true,
  selector: 'ss-comp1',
  template: `comp`,
})
export class SSSComp1 {}

@Component({
  standalone: true,
  selector: 'cs-comp',
  template: `<span>comp</span>`,
})
export class SCsComp {}

// --- 示例47-48 ---
@Component({
  standalone: true,
  selector: 'cft-comp',
  template: `<span>comp</span>`,
})
export class SCFTComp {}

@Component({
  standalone: true,
  selector: 'tfc-comp',
  template: `comp`,
})
export class STFCComp {}

// --- 示例49: comp-in-template ---
@Component({
  standalone: true,
  selector: 'cit-comp',
  template: `<span>comp</span>`,
})
export class SCItComp {}

// --- 示例50: comp-in-dynamic ---
@Component({
  standalone: true,
  selector: 'cid-excluded',
  template: `<span>excluded</span>`,
})
export class SCIdExcludedComp {}

@Component({
  standalone: true,
  selector: 'cid-container',
  template: `container <ng-content></ng-content>`,
})
export class SCIdContainerComp {}

// --- 示例53: comp-toggle ---
@Component({
  standalone: true,
  selector: 'ctoggle-comp',
  template: `<span>comp</span>`,
})
export class SToggleComp {}

// --- 示例56: insert-position ---
@Component({
  standalone: true,
  selector: 'ip-comp1',
  template: `<span>comp1</span>`,
})
export class SIpComp1 {}

@Component({
  standalone: true,
  selector: 'ip-comp2',
  template: `<span>comp2</span>`,
})
export class SIpComp2 {}

// --- 示例57: comp-in-container ---
@Component({
  standalone: true,
  selector: 'cic-comp',
  template: `<span>comp</span>`,
})
export class SCICComp {}

// --- 示例58: comp-with-comment ---
@Component({
  standalone: true,
  selector: 'cwc-comp',
  template: `<span>comp</span>`,
})
export class SWCComp {}

// --- 示例59: text-only-comp ---
@Component({
  standalone: true,
  selector: 'toc-comp',
  template: `plain text content`,
})
export class STextOnlyComp {}

// --- 示例60: special-chars-comp ---
@Component({
  standalone: true,
  selector: 'scc-comp',
  template: `1 &lt; 2 && 3 &gt; 4`,
})
export class SSpecialCharsComp {}


// ============================================================
// 父级容器组件 - 组合以上基础组件形成完整示例
// ============================================================

/**
 * 主演示组件,包含所有60+个示例的组合
 */
// Note: SelectorlessAllExamplesComponent removed - using individual example components directly


// ============================================================
// 组合示例组件 - 每个对应 HTML 中的一个具体示例
// ============================================================

/**
 * 示例6: 被排除组件 + 普通标签(组件在前)
 */
@Component({
  standalone: true,
  imports: [SCTComp1Comp],
  selector: 'app-s-comp-tag-1',
  template: `<ct-comp1></ct-comp1><span>text</span>`,
})
export class SCompTag1Example {}

/**
 * 示例7: 普通标签 + 被排除组件(标签在前)
 */
@Component({
  standalone: true,
  imports: [STCComp1Comp],
  selector: 'app-s-tag-comp-1',
  template: `<span>text</span><tc-comp1></tc-comp1>`,
})
export class STagComp1Example {}

/**
 * 示例8: 标签 + 被排除组件 + 标签
 */
@Component({
  standalone: true,
  imports: [STagCompTag1Comp],
  selector: 'app-s-tag-comp-tag-1',
  template: `<span>before</span><tct-comp1></tct-comp1><span>after</span>`,
})
export class STagCompTag1Example {}

/**
 * 示例9: 多个标签包围单个被排除组件
 */
@Component({
  standalone: true,
  imports: [SMultiTagCompComp],
  selector: 'app-s-multi-tag-comp',
  template: `<span>1</span><span>2</span><mtc-comp></mtc-comp><span>3</span><span>4</span>`,
})
export class SMultiTagCompExample {}

/**
 * 示例10: 嵌套标签中的被排除组件
 */
@Component({
  standalone: true,
  imports: [SNestedTagCompComp],
  selector: 'app-s-nested-tag-comp',
  template: `<div><span>a</span><ntc-comp></ntc-comp><span>b</span></div>`,
})
export class SNestedTagCompExample {}

/**
 * 示例11: 多个被排除组件与多个标签交替排列
 */
@Component({
  standalone: true,
  imports: [SAltC1Comp, SAltC2Comp],
  selector: 'app-s-alternating-comp-tag',
  template: `<span>a</span><alt-c1></alt-c1><span>b</span><alt-c2></alt-c2><span>c</span>`,
})
export class SAlternatingCompTagExample {}

/**
 * 示例12: 被排除组件内部包含多个子元素
 */
@Component({
  standalone: true,
  imports: [SMultiChildCompComp],
  selector: 'app-s-multi-child-comp',
  template: `<mcc-comp></mcc-comp>`,
})
export class SMultiChildCompExample {}

/**
 * 示例13: 被排除组件内部文本与标签混合
 */
@Component({
  standalone: true,
  imports: [SMixedContentCompComp],
  selector: 'app-s-mixed-content-comp',
  template: `<mcc2-comp></mcc2-comp>`,
})
export class SMixedContentCompExample {}

/**
 * 示例14: 被排除组件包含深层嵌套结构
 */
@Component({
  standalone: true,
  imports: [SDeepNestedCompComp],
  selector: 'app-s-deep-nested-comp',
  template: `<dnc-comp></dnc-comp>`,
})
export class SDeepNestedCompExample {}

/**
 * 示例15: 被排除组件包含 @for 列表
 */
@Component({
  standalone: true,
  imports: [SForCompComp],
  selector: 'app-s-for-comp',
  template: `<fc-for-comp></fc-for-comp>`,
})
export class SForCompExample {}

/**
 * 示例16: 被排除组件包含 @if 条件渲染
 */
@Component({
  standalone: true,
  imports: [SIfCompComp],
  selector: 'app-s-if-comp',
  template: `<ic-if-comp></ic-if-comp>`,
})
export class SIfCompExample {}

/**
 * 示例17: 被排除组件包含 @switch 条件渲染
 */
@Component({
  standalone: true,
  imports: [SSwitchCompComp],
  selector: 'app-s-switch-comp',
  template: `<sc-switch-comp></sc-switch-comp>`,
})
export class SSwitchCompExample {}

/**
 * 示例18: 多个被排除组件相互嵌套
 */
@Component({
  standalone: true,
  imports: [SOuterNestedExcludedComp],
  selector: 'app-s-nested-excluded-comps',
  template: `<outer-ne-comp></outer-ne-comp>`,
})
export class SNestedExcludedCompsExample {}

/**
 * 示例19: 被排除组件与普通(有选择器)组件混合
 */
/**
 * 普通有选择器组件 (用于示例19对比)
 */
@Component({
  standalone: true,
  selector: 'normal-demo-comp',
  template: `<span>b</span>`,
})
export class NormalDemoComp {}

/**
 * 示例19: 被排除组件与普通(有选择器)组件混合
 */
@Component({
  standalone: true,
  imports: [SMixedExcludedComp, NormalDemoComp],
  selector: 'app-s-mixed-normal-excluded',
  template: `<span>a</span><mixed-excl-comp></mixed-excl-comp><normal-demo-comp></normal-demo-comp>`,
})
export class SMixedNormalExcludedExample {}

/**
 * 示例20: 被排除组件使用 ng-content 透传内容
 */
@Component({
  standalone: true,
  imports: [SContentOutletComp],
  selector: 'app-s-content-outlet-comp',
  template: `<co-comp><span>transmitted content</span></co-comp>`,
})
export class SContentOutletCompExample {}

/**
 * 示例21: ng-template 动态 + 被排除组件
 */
@Component({
  standalone: true,
  imports: [NgTemplateOutlet, STCt1Comp],
  selector: 'app-s-template-comp-1',
  template: `
    <ng-template #tpl><span>template</span></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
    <tc-t1-comp></tc-t1-comp>
  `,
})
export class STemplateComp1Example {}

/**
 * 示例22: 被排除组件 + ng-template 动态
 */
@Component({
  standalone: true,
  imports: [NgTemplateOutlet, SCTt1Comp],
  selector: 'app-s-comp-template-1',
  template: `
    <ct-t1-comp></ct-t1-comp>
    <ng-template #tpl><span>template</span></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
  `,
})
export class SCompTemplate1Example {}

/**
 * 示例23: ng-template 动态 + 标签 + 被排除组件
 */
@Component({
  standalone: true,
  imports: [NgTemplateOutlet, STCt1Comp],
  selector: 'app-s-template-tag-comp',
  template: `
    <ng-template #tpl><span>template</span></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
    <span>middle</span>
    <tc-t1-comp></tc-t1-comp>
  `,
})
export class STemplateTagCompExample {}

/**
 * 示例24: 被排除组件 + 标签 + ng-template 动态
 */
@Component({
  standalone: true,
  imports: [NgTemplateOutlet, SCTt1Comp],
  selector: 'app-s-comp-tag-template',
  template: `
    <ct-t1-comp></ct-t1-comp>
    <span>middle</span>
    <ng-template #tpl><span>template</span></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
  `,
})
export class SCompTagTemplateExample {}

/**
 * 示例25: 被排除组件 + *ngComponentOutlet 动态组件
 */
@Component({
  standalone: true,
  imports: [NgComponentOutlet, SSDStaticComp],
  selector: 'app-s-static-dynamic-comp',
  template: `<sd-static></sd-static><ng-container *ngComponentOutlet="SSDynamicComp"></ng-container>`,
})
export class SStaticDynamicCompExample {
  SSDynamicComp = SSDynamicComp;
}

/**
 * 示例26: *ngComponentOutlet 动态组件 + 被排除组件
 */
@Component({
  standalone: true,
  imports: [NgComponentOutlet, SSDStaticComp],
  selector: 'app-s-dynamic-static-comp',
  template: `<ng-container *ngComponentOutlet="SSDynamicComp"></ng-container><sd-static></sd-static>`,
})
export class SDynamicStaticCompExample {
  SSDynamicComp = SSDynamicComp;
}

/**
 * 示例27: ng-template + 被排除组件 + *ngComponentOutlet
 */
@Component({
  standalone: true,
  imports: [NgTemplateOutlet, NgComponentOutlet, STCt1Comp],
  selector: 'app-s-template-comp-dynamic',
  template: `
    <ng-template #tpl><span>template</span></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
    <tc-t1-comp></tc-t1-comp>
    <ng-container *ngComponentOutlet=DynamicComp></ng-container>
  `,
})
export class STemplateCompDynamicExample {
  DynamicComp = SSDynamicComp;
}

/**
 * 示例28: 被排除组件 + ng-template + *ngComponentOutlet
 */
@Component({
  standalone: true,
  imports: [NgTemplateOutlet, NgComponentOutlet, SCTt1Comp],
  selector: 'app-s-comp-template-dynamic',
  template: `
    <ct-t1-comp></ct-t1-comp>
    <ng-template #tpl><span>template</span></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
    <ng-container *ngComponentOutlet=DynamicComp></ng-container>
  `,
})
export class SCompTemplateDynamicExample {
  DynamicComp = SSDynamicComp;
}

/**
 * 示例29: 被排除组件 + *ngComponentOutlet + ng-template
 */
@Component({
  standalone: true,
  imports: [NgTemplateOutlet, NgComponentOutlet, SCTt1Comp],
  selector: 'app-s-comp-dynamic-template',
  template: `
    <ct-t1-comp></ct-t1-comp>
    <ng-container *ngComponentOutlet=DynamicComp></ng-container>
    <ng-template #tpl><span>template</span></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
  `,
})
export class SCompDynamicTemplateExample {
  DynamicComp = SSDynamicComp;
}

/**
 * 示例30: *ngComponentOutlet + 被排除组件 + ng-template
 */
@Component({
  standalone: true,
  imports: [NgTemplateOutlet, NgComponentOutlet, STCt1Comp],
  selector: 'app-s-dynamic-comp-template',
  template: `
    <ng-container *ngComponentOutlet=DynamicComp></ng-container>
    <tc-t1-comp></tc-t1-comp>
    <ng-template #tpl><span>template</span></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
  `,
})
export class SDynamicCompTemplateExample {
  DynamicComp = SSDynamicComp;
}

/**
 * 示例31: ng-template + *ngComponentOutlet + 被排除组件
 */
@Component({
  standalone: true,
  imports: [NgTemplateOutlet, NgComponentOutlet, STCt1Comp],
  selector: 'app-s-template-dynamic-comp',
  template: `
    <ng-template #tpl><span>template</span></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
    <ng-container *ngComponentOutlet=DynamicComp></ng-container>
    <tc-t1-comp></tc-t1-comp>
  `,
})
export class STemplateDynamicCompExample {
  DynamicComp = SSDynamicComp;
}

/**
 * 示例32: *ngComponentOutlet + ng-template + 被排除组件
 */
@Component({
  standalone: true,
  imports: [NgTemplateOutlet, NgComponentOutlet, STCt1Comp],
  selector: 'app-s-dynamic-template-comp',
  template: `
    <ng-container *ngComponentOutlet=DynamicComp></ng-container>
    <ng-template #tpl><span>template</span></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
    <tc-t1-comp></tc-t1-comp>
  `,
})
export class SDynamicTemplateCompExample {
  DynamicComp = SSDynamicComp;
}

/**
 * 示例33: 被排除组件 + 标签 + *ngComponentOutlet
 */
@Component({
  standalone: true,
  imports: [NgComponentOutlet, SCTDComp],
  selector: 'app-s-comp-tag-dynamic',
  template: `<ctd-comp></ctd-comp><span>middle</span><ng-container *ngComponentOutlet=DynamicComp></ng-container>`,
})
export class SCompTagDynamicExample {
  DynamicComp = SSDynamicComp;
}

/**
 * 示例34: *ngComponentOutlet + 标签 + 被排除组件
 */
@Component({
  standalone: true,
  imports: [NgComponentOutlet, SDTCComp],
  selector: 'app-s-dynamic-tag-comp',
  template: `<ng-container *ngComponentOutlet=DynamicComp></ng-container><span>middle</span><dtc-comp></dtc-comp>`,
})
export class SDynamicTagCompExample {
  DynamicComp = SSDynamicComp;
}

/**
 * 示例35: 标签 + 被排除组件 + *ngComponentOutlet
 */
@Component({
  standalone: true,
  imports: [NgComponentOutlet, STCDComp],
  selector: 'app-s-tag-comp-dynamic',
  template: `<tcd-comp></tcd-comp><span>before</span><ng-container *ngComponentOutlet=DynamicComp></ng-container>`,
})
export class STagCompDynamicExample {
  DynamicComp = SSDynamicComp;
}

/**
 * 示例36: 标签 + *ngComponentOutlet + 被排除组件
 */
@Component({
  standalone: true,
  imports: [NgComponentOutlet, STDCComp],
  selector: 'app-s-tag-dynamic-comp',
  template: `<tdc-comp></tdc-comp><ng-container *ngComponentOutlet=DynamicComp></ng-container><span>before</span>`,
})
export class STagDynamicCompExample {
  DynamicComp = SSDynamicComp;
}

/**
 * 示例37: *ngComponentOutlet + 被排除组件 + 标签
 */
@Component({
  standalone: true,
  imports: [NgComponentOutlet, SDCTComp],
  selector: 'app-s-dynamic-comp-tag',
  template: `<ng-container *ngComponentOutlet=DynamicComp></ng-container><dct-comp></dct-comp><span>after</span>`,
})
export class SDynamicCompTagExample {
  DynamicComp = SSDynamicComp;
}

/**
 * 示例38: 被排除组件 + *ngComponentOutlet + 标签
 */
@Component({
  standalone: true,
  imports: [NgComponentOutlet, SCDTComp],
  selector: 'app-s-comp-dynamic-tag',
  template: `<cdt-comp></cdt-comp><ng-container *ngComponentOutlet=DynamicComp></ng-container><span>after</span>`,
})
export class SCompDynamicTagExample {
  DynamicComp = SSDynamicComp;
}

/**
 * 示例39: 被排除组件 + @if 条件控制
 */
@Component({
  standalone: true,
  imports: [SCIfComp],
  selector: 'app-s-comp-if',
  template: `<cif-comp></cif-comp>@if(show()){ <span>conditional</span> }`,
})
export class SCompIfExample {
  show = signal(true);
}

/**
 * 示例40: @if 条件控制 + 被排除组件
 */
@Component({
  standalone: true,
  imports: [SICIf1Comp],
  selector: 'app-s-if-comp-1',
  template: `@if(show()){ <span>conditional</span> }<ic-if1-comp></ic-if1-comp>`,
})
export class SIfComp1Example {
  show = signal(true);
}

/**
 * 示例41: @if 条件 + 标签 + 被排除组件
 */
@Component({
  standalone: true,
  imports: [SITCIfComp],
  selector: 'app-s-if-tag-comp',
  template: `@if(show()){ <span>conditional</span> }<span>middle</span><itc-if-comp></itc-if-comp>`,
})
export class SIfTagCompExample {
  show = signal(true);
}

/**
 * 示例42: 被排除组件 + @if 条件 + 标签
 */
@Component({
  standalone: true,
  imports: [SCItIfComp],
  selector: 'app-s-comp-if-tag',
  template: `<cit-if-comp></cit-if-comp>@if(show()){ <span>conditional</span> }<span>after</span>`,
})
export class SCompIfTagExample {
  show = signal(true);
}

/**
 * 示例43: @for 循环 + 被排除组件
 */
@Component({
  standalone: true,
  imports: [SFCFor1Comp],
  selector: 'app-s-for-comp-1',
  template: `@for(item of items(); track item){{{ item }}}<fc-for1-comp></fc-for1-comp>`,
})
export class SForComp1Example {
  items = signal(['1', '2', '3']);
}

/**
 * 示例44: 被排除组件 + @for 循环
 */
@Component({
  standalone: true,
  imports: [SCFComp],
  selector: 'app-s-comp-for',
  template: `<cf-comp></cf-comp>@for(item of items(); track item){{{ item }}}`,
})
export class SCompForExample {
  items = signal(['1', '2', '3']);
}

/**
 * 示例45: @switch + 被排除组件
 */
@Component({
  standalone: true,
  imports: [SSSComp1],
  selector: 'app-s-switch-comp-1',
  template: `@switch(val()){ @case(1){ <span>one</span> } }<ss-comp1></ss-comp1>`,
})
export class SSwitchComp1Example {
  val = signal(1);
}

/**
 * 示例46: 被排除组件 + @switch
 */
@Component({
  standalone: true,
  imports: [SCsComp],
  selector: 'app-s-comp-switch',
  template: `<cs-comp></cs-comp>@switch(val()){ @case(1){ <span>one</span> } }`,
})
export class SCompSwitchExample {
  val = signal(1);
}

/**
 * 示例47: 被排除组件 + @for 循环 + 标签
 */
@Component({
  standalone: true,
  imports: [SCFTComp],
  selector: 'app-s-comp-for-tag',
  template: `<cft-comp></cft-comp>@for(item of items(); track item){{{ item }}}<span>after</span>`,
})
export class SCompForTagExample {
  items = signal(['a', 'b', 'c']);
}

/**
 * 示例48: 标签 + @for 循环 + 被排除组件
 */
@Component({
  standalone: true,
  imports: [STFCComp],
  selector: 'app-s-tag-for-comp',
  template: `<span>before</span>@for(item of items(); track item){{{ item }}}<tfc-comp></tfc-comp>`,
})
export class STagForCompExample {
  items = signal(['a', 'b', 'c']);
}

/**
 * 示例49: 被排除组件嵌套在 ng-template 中
 */
@Component({
  standalone: true,
  imports: [NgTemplateOutlet, SCItComp],
  selector: 'app-s-comp-in-template',
  template: `
    <ng-template #tpl><cit-comp></cit-comp></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
  `,
})
export class SCompInTemplateExample {}

/**
 * 示例50: 被排除组件作为动态组件的内容
 */
@Component({
  standalone: true,
  imports: [NgComponentOutlet],
  selector: 'app-s-comp-in-dynamic',
  template: `<ng-container *ngComponentOutlet=ContainerComp></ng-container>`,
})
export class SCompInDynamicExample {
  ContainerComp = SCIdContainerComp;
}

/**
 * 示例51: 所有类型混合 - 完整演示
 */
@Component({
  standalone: true,
  imports: [
    NgTemplateOutlet, NgComponentOutlet,
    SExcludedComp
  ],
  selector: 'app-s-all-mixed',
  template: `
    <span>start</span>
    <app-s-excluded-comp></app-s-excluded-comp>
    <ng-template #tpl><span>template</span></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
    <ng-container *ngComponentOutlet=DynamicComp></ng-container>
    @if(show()){ <span>conditional</span> }
    @for(item of items(); track item){{{ item }}}
    @switch(val()){ @case(1){ <span>one</span> } }
    <span>end</span>
  `,
})
export class SAllMixedExample {
  show = signal(true);
  items = signal(['a', 'b', 'c']);
  val = signal(1);
  DynamicComp = SSDynamicComp;
}

/**
 * 示例52: 所有类型混合 - 反向顺序
 */
@Component({
  standalone: true,
  imports: [NgComponentOutlet, NgTemplateOutlet, STCt1Comp],
  selector: 'app-s-all-mixed-reverse',
  template: `
    <span>end</span>
    <ng-container *ngComponentOutlet=DynamicComp></ng-container>
    <ng-template #tpl><span>template</span></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
    <tc-t1-comp></tc-t1-comp>
    <span>start</span>
  `,
})
export class SAllMixedReverseExample {
  DynamicComp = SSDynamicComp;
}

/**
 * 示例53: 被排除组件的动态添加/删除
 */
@Component({
  standalone: true,
  imports: [SToggleComp],
  selector: 'app-s-comp-toggle',
  template: `@if(show()){ <ctoggle-comp></ctoggle-comp> }`,
})
export class SCompToggleExample {
  show = signal(true);
}

/**
 * 示例54: 多个被排除组件的动态增删
 */
@Component({
  standalone: true,
  imports: [SExcludedComp],
  selector: 'app-s-multi-comp-toggle',
  template: `
    @for(_ of comps(); track $index){ <app-s-excluded-comp></app-s-excluded-comp> }
    @if(comps().length === 0){ <em>No components</em> }
  `,
})
export class SMultiCompToggleExample {
  comps = signal<string[]>([]);

  add() { this.comps.update(c => [...c, 'new']); }
  remove() { this.comps.update(c => c.slice(0, -1)); }
  reset() { this.comps.set([]); }
}

/**
 * 示例55: @for 循环中被排除组件的动态增删
 */
@Component({
  standalone: true,
  imports: [SExcludedComp],
  selector: 'app-s-for-comp-toggle',
  template: `
    @for(item of items(); track item){ <app-s-excluded-comp></app-s-excluded-comp> }
    @empty{ <em>No items</em> }
  `,
})
export class SForCompToggleExample {
  items = signal<string[]>(['a', 'b']);

  add() { this.items.update(i => [...i, String(Date.now())]); }
  remove() { this.items.update(i => i.slice(0, -1)); }
  reset() { this.items.set(['a', 'b']); }
}

/**
 * 示例56: 被排除组件在不同插入位置的验证
 */
@Component({
  standalone: true,
  imports: [SIpComp1, SIpComp2],
  selector: 'app-s-insert-position',
  template: `
    <span>first</span>
    <ip-comp1></ip-comp1>
    <span>middle</span>
    <ip-comp2></ip-comp2>
    <span>last</span>
  `,
})
export class SInsertPositionExample {}

/**
 * 示例57: 被排除组件与 ng-container 配合使用
 */
@Component({
  standalone: true,
  imports: [NgTemplateOutlet, SCICComp],
  selector: 'app-s-comp-in-container',
  template: `
    <ng-template #tpl><cic-comp></cic-comp></ng-template>
    <ng-container *ngTemplateOutlet="tpl"></ng-container>
  `,
})
export class SCompInContainerExample {}

/**
 * 示例58: 被排除组件与 HTML 注释共存
 */
@Component({
  standalone: true,
  imports: [SWCComp],
  selector: 'app-s-comp-with-comment',
  template: `<!-- comment --><cwc-comp></cwc-comp>`,
})
export class SCompWithCommentExample {}

/**
 * 示例59: 被排除组件包含纯文本节点
 */
@Component({
  standalone: true,
  imports: [STextOnlyComp],
  selector: 'app-s-text-only-comp',
  template: `<toc-comp></toc-comp>`,
})
export class STextOnlyCompExample {}

/**
 * 示例60: 被排除组件包含特殊字符
 */
@Component({
  standalone: true,
  imports: [SSpecialCharsComp],
  selector: 'app-s-special-chars-comp',
  template: `<scc-comp></scc-comp>`,
})
export class SSpecialCharsCompExample {}


// ============================================================
// 示例4: 排除后内容展示组件 (无选择器组件的包装)
// ============================================================

/**
 * 示例4b: 排除后的内容直接渲染 (无选择器组件包装)
 */
@Component({
  standalone: true,
  selector: 'app-s-after-content-demo',
  template: `after-content`,
})
export class SAfterContentDemoExample {}

/**
 * 示例5: 多个被排除组件并列
 */
@Component({
  standalone: true,
  imports: [SMultiFirstComp, SMultiMiddleComp, SMultiLastComp],
  selector: 'app-s-multi-excluded',
  template: `<multi-first></multi-first><multi-middle></multi-middle><multi-last></multi-last>`,
})
export class SMultiExcludedExample {}


// ============================================================
// 导出所有组件
// ============================================================

export const SelectorlessExamplesComponents = [
  // 基础组件
  SNormalComp, SNoSelectorComp, SExcludedComp,
  SBeforeComp, SMultiFirstComp, SMultiMiddleComp, SMultiLastComp,
  SMultiFirstComp, SMultiMiddleComp, SMultiLastComp,
  SCTComp1Comp, STCComp1Comp, STagCompTag1Comp,
  SMultiTagCompComp, SNestedTagCompComp,
  SAltC1Comp, SAltC2Comp,
  SMultiChildCompComp, SMixedContentCompComp,
  SDeepNestedCompComp, SForCompComp,
  SIfCompComp, SSwitchCompComp,
  SOuterNestedExcludedComp, SInnerNestedExcludedComp,
  SMixedExcludedComp, SContentOutletComp,
  SSDynamicComp, SSDStaticComp,

  // 示例组件
  SCompTag1Example, STagComp1Example, STagCompTag1Example,
  SMultiTagCompExample, SNestedTagCompExample,
  SAlternatingCompTagExample, SMultiChildCompExample,
  SMixedContentCompExample, SDeepNestedCompExample,
  SForCompExample, SIfCompExample, SSwitchCompExample,
  SNestedExcludedCompsExample, SMixedNormalExcludedExample,
  SContentOutletCompExample,

  // 动态插入示例
  STemplateComp1Example, SCompTemplate1Example,
  STemplateTagCompExample, SCompTagTemplateExample,
  SStaticDynamicCompExample, SDynamicStaticCompExample,
  STemplateCompDynamicExample, SCompTemplateDynamicExample,
  SCompDynamicTemplateExample, SDynamicCompTemplateExample,
  STemplateDynamicCompExample, SDynamicTemplateCompExample,

  // 33-38
  SCompTagDynamicExample, SDynamicTagCompExample,
  STagCompDynamicExample, STagDynamicCompExample,
  SDynamicCompTagExample, SCompDynamicTagExample,

  // 39-46
  SCompIfExample, SIfComp1Example, SIfTagCompExample,
  SCompIfTagExample, SForComp1Example, SCompForExample,
  SSwitchComp1Example, SCompSwitchExample,

  // 47-48
  SCompForTagExample, STagForCompExample,

  // 49-50
  SCompInTemplateExample, SCompInDynamicExample,

  // 51-52
  SAllMixedExample, SAllMixedReverseExample,

  // 53-55
  SCompToggleExample, SMultiCompToggleExample, SForCompToggleExample,

  // 56-60
  SInsertPositionExample, SCompInContainerExample,
  SCompWithCommentExample, STextOnlyCompExample,
  SSpecialCharsCompExample,

  // 其他辅助
  SCTt1Comp, STCt1Comp,
  SCTDComp, SDTCComp, STCDComp, STDCComp, SDCTComp, SCDTComp,
  SCIfComp, SICIf1Comp, SITCIfComp, SCItIfComp,
  SFCFor1Comp, SCFComp, SSSComp1, SCsComp,
  SCFTComp, STFCComp,
  SCItComp, SCIdExcludedComp, SCIdContainerComp,
  SToggleComp, SIpComp1, SIpComp2,
  SCICComp, SWCComp, STextOnlyComp, SSpecialCharsComp,
  SMultiExcludedExample,
];
