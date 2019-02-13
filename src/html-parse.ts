// 全部的合法tag字符
const validTagLetter = ``

// 如果用字面值常量，那么只需要 \/ ，只转译 /
// 但由于在String里面 \ 本身就有特殊含义，所以需要 \\ 两次转译
// </div> 与 </div     ewq     > 都可以
// [^>]* 表示排除了 > 之外的全部符号
const endTagRE = new RegExp(`/^<\\/${validTagLetter}[^>]*>`)

// i flags 忽略大小写
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp
const doctype = /^<!DOCTYPE [^>]+>/i


export function parseHtml(html: string){
    let last: string
    while(html){
        last = html

        //start tag
        if(last.indexOf('<')){
            // 开始或者结束标签

        }

    }
}