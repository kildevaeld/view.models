export interface ModelConstructor<T> {
    new (a?: any): T;
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
export declare namespace MetaKeys {
    const Attributes: unique symbol;
    const Models: unique symbol;
}
export interface Destroyable {
    destroy(): void;
}
export declare function isDestroyable(a: any): a is Destroyable;
export interface ICollection<T> {
    length: number;
    item(index: number): T | undefined;
    push(items: T): number;
    pop(): T | undefined;
}
export declare namespace ModelEvents {
    const Add = "add";
    const BeforeRemove = "before:remove";
    const Remove = "remove";
    const Clear = "clear";
    const BeforeSort = "before:sort";
    const Sort = "sort";
    const Change = "change";
    const BeforeReset = "before:reset";
    const Reset = "reset";
}
