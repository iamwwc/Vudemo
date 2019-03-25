import { isDef, noop } from "./util/helper";

export class Vue {
	private $options: Options
	constructor(options: Options) {
		this.$options = options
		this.init()
	}
	private init() {
		this.initState()
	}
	private initState() {
		const data = this.$options.data
		if (isDef(data)) {
			this.initData()
		}
	}

	private initData() {
		const data = this.$options
		
	}
}

let sharedProxyHook = {
	configurable: true,
	enumerable: true,
	get: noop,
	set: noop
}
function proxy(obj: Object, srcKey: any, key: any) {
	sharedProxyHook.get = function () {
		return obj[srcKey][key]
	}
	sharedProxyHook.set = function (newV) {
		obj[srcKey][key] = newV
	}
	Object.defineProperty(obj, key, sharedProxyHook)
}

interface Options {
	data: any,
	template?: string,
	watch: any
}