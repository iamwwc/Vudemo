import { Watcher } from "./watcher";
import { remove } from "../util/helper";

export class Dep {
	static target: Watcher | null = null
	private subs: Array<Watcher> = []
	constructor() {

	}

	addSubs(watcher: Watcher) {
		this.subs.push(watcher)
	}

	delSubs(watcher: Watcher) {
		remove(this.subs,watcher)
	}

	// watcher与Dep互相记录
	depend() {
		if (Dep.target) {
			Dep.target.addDep(this)
		}
	}
	notify() {
		for (let i = 0; i < this.subs.length; i++) {
			this.subs[i].update()
		}
	}
}

const targetStack: Array<Watcher> = []
export function pushTarget(watcher: Watcher) {
	targetStack.push(watcher)
	Dep.target = watcher
}

export function popTarget() {
	targetStack.pop()
	Dep.target = targetStack[targetStack.length - 1]
}