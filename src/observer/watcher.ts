import { Vue } from "..";
import { pushTarget, popTarget, Dep } from "./dep";

export class Watcher{
	private vm: Vue
	private expression: string
	private callback: Function
	private getter: Function
	private value: any
	private deps: Array<Dep> = []
	constructor(vm: Vue, exp: string | Function, callback: Function){
		this.vm = vm
		this.callback = callback
		if(typeof exp === 'function'){
			this.getter = exp
		}else{
			this.getter = parsePath(exp)
		}
		this.value = this.get()
	}

	get(){
		pushTarget(this)
		let value
		try{
			value = this.getter.call(this.vm)
		}catch(e){
			throw e
		}
		popTarget()
		return value
	}

	update(){

	}

	addDep(dep: Dep){
		dep.addSubs(this)
	}
}

function parsePath(exp: string) : Function{
	return new Function()
}