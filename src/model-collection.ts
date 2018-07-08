import { ArrayCollection } from './array-collection';
import { ModelConstructor } from './types';
import { Model } from './model';
import { Invoker, uniqueId, isPlainObject } from '@viewjs/utils';

export class ModelCollection<M extends Model> extends ArrayCollection<M> {
    Model: ModelConstructor<M> = Model as any;

    constructor(models?: M[]) {
        super();
        if (Array.isArray(models)) {
            models.forEach(m => this.push(m));
        }
    }


    createModel(o?: { [key: string]: any }) {
        const model = Invoker.get(this.Model);
        if (o) {
            for (let key in o) {
                model.set(key, o[key]);
            }
        }

        if (!model.has(this.Model.idAttribute)) {
            model.set(this.Model.idAttribute, uniqueId());
        }

        return model;
    }

	/**
	 * Push a model to the collection
	 *
	 * @param {(M | any)} m
	 * @param {boolean} [trigger=true]
	 * @returns {number}
	 * @memberof ModelCollection
	 */
    push(m: M | any, trigger = true): number {
        if (!(m instanceof this.Model)) {
            if (!isPlainObject(m)) throw new TypeError("invalid type");
            m = this.createModel(m);
        } else if ((m instanceof Model) && !m.has(this.Model.idAttribute)) {
            m.set(this.Model.idAttribute, uniqueId());
        }

        const found = this.find(model => model.id == m.id)
        if (found && found !== m) {
            let json = m.toJSON();
            for (let k in json) {
                m.set(k, json[k]);
            }
            return this.length;
        } else if (found === m) return this.length;

        return super.push(m, trigger);
    }


}