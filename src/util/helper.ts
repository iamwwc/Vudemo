export function remove(obj: Array<Object>, key: Object) {
	for (let i = 0; 0 < obj.length; i++) {
		if (obj[i] === key) {
			obj.splice(i, 1)
			return
		}
	}
}

export function noop(...args){}

export function def(obj: Object, key:any, value:any, enmuerable?:boolean){
	Object.defineProperty(obj,key,{
		configurable:true,
		enumerable:!!enmuerable,
		value: value
	})
}

export function hasOwn(obj: Object, key:any){
	return obj !== null && typeof obj[key] !== 'undefined'
}

export function define(obj: Object, key: string, value: any){
	Object.defineProperty(obj,key,value)
}

export function isDef(target: any){
	if(typeof target !== 'undefined' && target !== null){
		return true
	}
	return false
}


// Following codes inspired by Vue

/**
 * object can compile to json
 *  */ 
export function isObject(o: any){
	return o !== null && typeof o === 'object'
}

/**
 * strict check
 * o must be a plain object
 * @param o params
 */
export function isPlainObject(o: any){
	return Object.prototype.toString.call(o) === '[object Object]' 
}