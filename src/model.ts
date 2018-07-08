import { equal, triggerMethodOn, isFunction } from '@viewjs/utils';
import { MetaKeys, IModel } from './types';
import { EventEmitter } from '@viewjs/events';

export function isModel(a: any): a is IModel {
    return a && ((a instanceof Model)
        || (isFunction(a.set)
            && isFunction(a.get)
            && isFunction(a.unset)
            && isFunction(a.clear))
    );
}

export interface ModelSetOptions {
    silent?: boolean;
}
export class Model extends EventEmitter implements IModel {
    static idAttribute = "id";
    [MetaKeys.Attributes]: Map<string | number, any> = new Map();

    get id() {
        return this.get((this.constructor as any).idAttribute)
    }

    constructor(attrs?: any) {
        super();
        if (attrs) {
            for (let k in attrs) {
                this.set(k, attrs[k], { silent: true });
            }
        }
    }

    set<U>(key: string | number, value: U, options?: ModelSetOptions) {
        let old = this.get(key)
        if (equal(old, value)) {
            return this;
        }

        this[MetaKeys.Attributes].set(key, value);

        if (options && options.silent) return this;

        triggerMethodOn(this, `change:${key}`, old, value)
        triggerMethodOn(this, 'change', { [key]: value })
        return this;
    }

    get<U>(key: string | number): U | undefined {
        return this[MetaKeys.Attributes].get(key);
    }

    has(key: string | number): boolean {
        return this[MetaKeys.Attributes].has(key);
    }

    unset<U>(key: string | number): U | undefined {
        let t = this.get<U>(key);
        this[MetaKeys.Attributes].delete(key);
        return t;
    }

    clear() {
        this[MetaKeys.Attributes] = new Map();
        triggerMethodOn(this, 'clear');
        return this;
    }

    toJSON() {
        let out: any = {};

        this[MetaKeys.Attributes].forEach((value: any, key: any) => {
            out[key] = value;
        });

        return out;
    }
}