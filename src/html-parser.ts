import VNode, { Type, DOMVNode, TextVNode, EmptyVNode } from "./vdom/vnode";

/**
 * 猜测这是能用到tag的合法字符
 * 用来匹配 v-on
 *  */
const ncname = '[a-zA-Z_][\\w\\-\\.]*';

/**
 * v-on:emit=""
 * 
 * ((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)
 */
const qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')'

/**
 * /^<((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)/
 * 
 * ? 的存在使得前面的非捕获组变得可有可无
 * 匹配 
 *  <div      v-on:emit=""
 * 中的 <div 
 * 捕获 div
 */
const startTagOpen = new RegExp('^<' + qnameCapture)

/**
 * 匹配 "        />"
 *  或者 "     >"
 * 
 * 通过这种方式来判断是否是自闭和标签
 */
const startTagClose = /^\s*(\/?)>/

/**
 *  如果用字面值常量，那么只需要 \/ ，只转译 /
    但由于在String里面 \ 本身就有特殊含义，所以需要 \\ 两次转译
    1. </div> 与 </div     ewq     > 都可以
    2. [^>]* 表示排除了 > 之外的全部符号
    3. tag开头必须是字母，后面可有任意数量的 \w - .
 */
const endTagRE = /^<\/((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)[^>]*>/

// i flags 忽略大小写
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp
const doctype = /^<!DOCTYPE [^>]+>/i

/**比如
 * <div refresh></div>
 *  refresh 就是单独的一个属性
 * 由中括号以外的字符构成的集合
 */
const singleAttrKeyRE = /([^\s"'<>/=]+)/

// 赋值符号
// 这里不进行捕获
const singleAssignRE = /(?:=)/

/** 合法的属性的value值
 *  name='wwc'
 *  name="wwc"
 *  name=wwc
 * 都可以
 */
const singleAttrValues = [
	/"([^"]*)"+/.source,
	/'([^']*)'+/.source,
	/([^\\s"'=<>/`]+)/.source
	// 最后一个 + 在括号内，前两个都有 *，
	// 所以[]内表达式会重复，+只需要保证最后的单引号或者双引号
	// 而最后一个由于没有 引号，所以需要至少含有一个
]

const attributes = new RegExp(
	'^\\s*' + singleAttrKeyRE.source + //匹配attr key
	'(?:\\s*(' + singleAssignRE.source + ')' +  // 匹配 =
	'\\s*(?:' + singleAttrValues.join('|') + '))?'
	// 匹配 attr value
	//因为在singleAttrValues使用的()，这里直接用(?:x)
)

/**
 * 匹配 {{ title }}
 */
const defaultTextRegx = /\{\{((?:.|\n)+?)\}\}/g

export function parseHtml(html: string) {

	let index = 0
	let stack: Array<VNode> = []
	let currentParent: VNode, root: VNode = undefined
	function slice(n: number) {
		index += n
		html = html.substring(n)
	}

	function parseStartTag() {
		let start = html.match(startTagOpen)
		if (start) {
			const match: {
				[key: string]: any,
				attrs: Array<{
					name: string
					value: string
				}>
			} = {
				tagName: start[1],
				attrs: []
			}

			// 切割掉 <div
			slice(start[0].length)

			// 开始分离 attr
			let end, attr
			while (!(end = html.match(startTagClose)) && (attr = html.match(attributes))) {
				slice(attr[0].length)
				match.attrs.push({
					name: attr[1],
					value: attr[3]
				})
			}

			// 匹配到了 ><span>text</span>
			if (end) {
				slice(end[0].length)
				match.unarySlash = end[1]
				return match
			}
		}
	}

	function parseEndTag(tag: string) {
		let i
		for (i = stack.length - 1; i >= 0; i--) {
			if (stack[i].lowCaseTagName === tag.toLowerCase()) {
				break;
			}
		}

		if (i >= 0) {
			if (i > 0) { // 说明还有父元素
				currentParent = stack[i - 1]
			} else { // 此标签为root，parent 为 null
				currentParent = null
			}
			stack.length = i
		}
	}

	function parseTextTag(text: string) {
		if (!defaultTextRegx.exec(text)) {
			return
		}

		let match: RegExpExecArray
		let lastIndex = defaultTextRegx.lastIndex = 0
		let index
		let tokens: Array<string> = []

		// 切割 文本，每次匹配 {{xxx}}
		while ((match = defaultTextRegx.exec(text))) {
			index = match.index
			if (index > lastIndex) {
				tokens.push(JSON.stringify(text.slice(lastIndex, index)))
			}
			let exp = match[1].trim()
			tokens.push(`_s(${exp})`)
			lastIndex = index + match[0].length
		}

		// {{xxx}} 都处理完之后， 将剩下的字符添加到最后
		if (lastIndex < text.length) {
			tokens.push(JSON.stringify(text.slice(lastIndex)))
		}
		return tokens.join('+')
	}

	function makeAttrMap(attrs: { [key: string]: string }[]): { [key: string]: string } {
		return Object.keys(attrs).reduce((prev, next) => {
			return prev[attrs[next]] = attrs[next]
		}, {})
	}

	while (html) {
		let textEnd = html.indexOf('<')
		//start tag
		if (textEnd === 0) {
			// 开始或者结束标签
			const endTagEnd = html.match(endTagRE)
			if (endTagEnd) {
				slice(endTagEnd[0].length)
				parseEndTag(endTagEnd[1])
			}

			if (html.match(startTagOpen)) {
				const startTagMatch = parseStartTag()
				const element: DOMVNode = {
					tagName: startTagMatch.tagName,
					lowCaseTagName: startTagMatch.tagName.toLowerCase(),
					type: 2,
					attrsMap: makeAttrMap(startTagMatch.attrs),
					attrsList: startTagMatch.attrs,
					childrens: []
				}

				if (!root) {
					root = element
				}

				if (currentParent) {
					currentParent.childrens.push(element)
				}

				// "" 说明是开标签，有child node
				// 如果是 "/"说明是自闭和标签
				if (!startTagMatch.unarySlash) {
					currentParent = element
					stack.push(element)
				}
				continue
			}
		} else { // 存在文本节点
			let text = html.substring(0, textEnd)
			slice(textEnd)
			let expression
			if (expression = parseTextTag(text)) {
				currentParent.childrens.push({
					expression,
					type: 1,
					text
				} as TextVNode)
			} else {
				currentParent.childrens.push({
					type: 3,
					text
				} as EmptyVNode)
			}
		}

	}
	return root
}