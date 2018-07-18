import { ArrayCollection } from './array-collection';
import { ModelConstructor } from './types';
import { Model } from './model';
export interface ModelCollectionOptions<M extends Model> {
    Model?: ModelConstructor<M>;
}
export declare class ModelCollection<M extends Model> extends ArrayCollection<M> {
    private _Model;
    Model: ModelConstructor<M>;
    constructor(models?: M[], options?: ModelCollectionOptions<M>);
    protected ensureModel(m: any): M;
    createModel(o?: {
        [key: string]: any;
    }): M;
    /**
     * Push a model to the collection
     *
     * @param {(M | any)} m
     * @param {boolean} [trigger=true]
     * @returns {number}
     * @memberof ModelCollection
     */
    push(m: M | any, trigger?: boolean): number;
    reset(a?: M[]): void;
    insert(m: M | any, index: number): void;
    removeAtIndex(index: number): M | undefined;
    protected didAddModel(_: M): void;
    protected didRemoveModel(_: M): void;
}
