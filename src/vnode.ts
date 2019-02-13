interface Attr {
    [k: string]: string
}

export default class VNode{
    tagName: string
    props: Array<{[k: string]:string}>
    childrens: Array<VNode>

    constructor(tagName: string, props: Array<{[k: string]:string}>, childrens: Array<VNode>){
        this.tagName = tagName
        this.props = props
        this.childrens = childrens
    }
}