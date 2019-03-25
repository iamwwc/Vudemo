export enum Type {
	DOM = 1,
	TEXT = 2,
	empty = 3
}

export default interface VNode {
	tagName?: string
	type: number
	lowCaseTagName?: string
	childrens?: Array<VNode>
}

export class TextVNode implements VNode {
	type: number
	expression: string
	text: string
}

export class EmptyVNode implements VNode {
	type: number;
	text: string
}

export class DOMVNode implements VNode {
	tagName: string;
	type: number;
	lowCaseTagName: string;
	childrens
	attrsMap: { [key: string]: string }
	attrsList!: Array<{
		name: string,
		value: string
	}>
}