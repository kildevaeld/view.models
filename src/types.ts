import { isFunction } from '@viewjs/utils';

export interface ModelConstructor<T> {
    new(a?: any): T
    idAttribute: string;
}

export interface AttributeValueMap {
    [key: string]: any;
    [index: number]: any;
}

export interface IModel {
    set<U>(key: string | number, value: U, options?: any): this;
    set<U>(key: AttributeValueMap, options?: any): this;
    set<U>(key: string | number | AttributeValueMap, value?: U, options?: any): this;
    get<U>(key: string | number): U | undefined;
    has(key: string | number): boolean;
    unset<U>(key: string | number): U | undefined;
    toJSON(): any;
}

export namespace MetaKeys {
    export const Attributes = Symbol("attributes");
    export const Models = Symbol("models");
}

export interface Destroyable {
    destroy(): void;
}

export function isDestroyable(a: any): a is Destroyable {
    return a && isFunction(a.destroy);
}

export interface ICollection<T> {
    length: number;
    item(index: number): T | undefined;
    push(items: T): number;
    pop(): T | undefined;
    //indexOf(item: T): number;
}

export namespace ModelEvents {
    export const Add = "add";
    export const BeforeRemove = "before:remove";
    export const Remove = "remove";
    export const Clear = "clear";
    export const BeforeSort = "before:sort";
    export const Sort = "sort";
    export const Change = "change";
    export const BeforeReset = "before:reset";
    export const Reset = "reset";
}