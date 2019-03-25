import { Observer } from "./observer";
import { hasOwn } from "../util/helper";

export function observer(data: any){
	
	if(!hasOwn(data,'__ob__')){
		new Observer(data)
	}
}