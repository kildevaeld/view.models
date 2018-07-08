import { Constructor, Base } from '@viewjs/utils';
import { IModel } from './types';
export interface IModelController<M extends IModel> {
    model?: M;
    setModel(model?: M, trigger?: boolean): this;
    modelEvents?: ModelEventsMap;
}
export declare type ModelEventsMap = {
    [key: string]: (string | ((...args: any[]) => any))[];
};
export declare function withModel<T extends Constructor<Base>, M extends IModel>(Base: T, TModel?: Constructor<M>): T & Constructor<IModelController<M>>;
