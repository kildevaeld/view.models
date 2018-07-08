import { IModel, ModelConstructor } from './types';
import { IModelController } from './with-model';
/**
     *
     * @export
     * @template
     * @param {T} target
     * @param {*} prop
     * @param {TypedPropertyDescriptor<U>} [descriptor]
     */
export declare function property<T extends IModel, U>(target: T, prop: any, descriptor?: TypedPropertyDescriptor<U>): TypedPropertyDescriptor<U>;
export declare function idAttribute(prop: string): <T extends ModelConstructor<IModel>>(target: T) => void;
export declare namespace model {
    function event(event: string, property?: string): <T extends IModelController<M>, M extends IModel>(target: T, prop: string, desc: TypedPropertyDescriptor<(...args: any[]) => any>) => void;
    function change(property?: string): <T extends IModelController<M>, M extends IModel>(target: T, prop: string, desc: TypedPropertyDescriptor<(...args: any[]) => any>) => void;
}
