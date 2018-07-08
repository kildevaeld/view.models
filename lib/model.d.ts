import { Base } from '@viewjs/utils';
import { MetaKeys, IModel, AttributeValueMap } from './types';
import { EventEmitter } from '@viewjs/events';
export declare function isModel(a: any): a is IModel;
export declare function enumerable<T extends Base, U>(value: boolean): (target: T, propertyKey: string | number | symbol, descriptor?: TypedPropertyDescriptor<U> | undefined) => any;
export declare function define<T extends Base, U>(value: TypedPropertyDescriptor<U>): (target: T, propertyKey: string | number | symbol, descriptor?: TypedPropertyDescriptor<U> | undefined) => TypedPropertyDescriptor<U>;
export interface ModelSetOptions {
    silent?: boolean;
}
export declare class Model extends EventEmitter implements IModel {
    static idAttribute: string;
    [MetaKeys.Attributes]: Map<string | number, any>;
    readonly id: {} | undefined;
    constructor(attrs?: any);
    set<U>(key: string | number | AttributeValueMap, value?: U, options?: ModelSetOptions): this;
    get<U>(key: string | number): U | undefined;
    has(key: string | number): boolean;
    unset<U>(key: string | number): U | undefined;
    clear(): this;
    toJSON(): any;
}
