import { defineReactive } from "../util";
import { def } from "../util/helper";
import { observer } from ".";

export class Observer {
	private value: any
	constructor(value: any) {
		this.value = value
		def(value, '__ob__', this)
		if (Array.isArray(value)) {
			this.observeArray(this.value)
		} else {
			this.walk(this.value)
		}
	}

	observeArray(value: Array<any>) {
		for (let i = 0; i < value.length; i++) {
			observer(value[i])
		}
	}

	walk(value: any) {
		let keys = Object.keys(value)
		for (let i = 0; i < keys.length; i++) {
			defineReactive(value, keys[i])
		}
	}
}