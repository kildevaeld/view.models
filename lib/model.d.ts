import { MetaKeys, IModel } from './types';
import { EventEmitter } from '@viewjs/events';
export declare function isModel(a: any): a is IModel;
export interface ModelSetOptions {
    silent?: boolean;
}
export declare class Model extends EventEmitter implements IModel {
    static idAttribute: string;
    [MetaKeys.Attributes]: Map<string | number, any>;
    readonly id: {} | undefined;
    constructor(attrs?: any);
    set<U>(key: string | number, value: U, options?: ModelSetOptions): this;
    get<U>(key: string | number): U | undefined;
    has(key: string | number): boolean;
    unset<U>(key: string | number): U | undefined;
    clear(): this;
    toJSON(): any;
}
