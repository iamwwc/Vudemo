import { Dep } from "../observer/dep";

export function defineReactive(obj: Object, key: string, val?: any){
	const dep = new Dep()
	const property = Object.getOwnPropertyDescriptor(obj, key)

	const getter = property && property.get
	const setter = property && property.set

	Object.defineProperty(obj,key, {
		configurable:true,
		enumerable: true,
		get: function reactiveGetter(){
			const value = getter ? getter.call(obj) : val
			if(Dep.target){
				dep.depend()
			}
			return value
		},
		set: function reactiveSetter(newV) {
			const value = getter ? getter.call(obj) : val

			if(setter){
				val = setter.call(obj, newV)
			}else{
				val = newV
			}
			dep.notify()
		}
	})
}