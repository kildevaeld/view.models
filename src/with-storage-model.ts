import { MetaKeys, ModelEvents, Options } from './types';
import { Storage, MetaData } from './storage';
import { Model } from './model';
import { Constructor, isFunction, triggerMethodOn, isPlainObject } from '@viewjs/utils';
import { createError, ModelErrorCode } from './errors';



export interface ModelStorageBaseOptions extends Options {
    meta?: MetaData;
}

export interface ModelSaveOptions extends ModelStorageBaseOptions {
    force?: boolean;

}

export interface ModelFetchOptions extends ModelStorageBaseOptions {

}

export interface ModelDeleteOptions extends ModelStorageBaseOptions {

}

export interface IStorageModel {
    storage: Storage | undefined;
    readonly isNew: boolean;
    readonly isDirty: boolean;
    save(options?: ModelSaveOptions): Promise<any>;
    fetch(options?: ModelFetchOptions): Promise<any>;
    delete(options?: ModelDeleteOptions): Promise<any>;
}

export function withStorageModel<
    T extends Constructor<Model>,
    TStorage extends Storage
    >(Base: T, storage?: ((model: Model & IStorageModel) => TStorage) | TStorage): T & Constructor<IStorageModel> {

    return class extends Base {

        private _changes: { [key: string]: any } | undefined;
        private _storage: TStorage | undefined;

        set storage(i: TStorage | undefined) {
            this._storage = i;
        }
        get storage(): TStorage | undefined {
            if (!this._storage && storage) {
                this._storage = isFunction(storage) ? storage(this) : storage;
            }
            return this._storage;
        }

        get changes() {
            return this._changes;
        }

        get isDirty() {
            return !!this.changes;
        }

        get isNew() {
            return !!!this.id;
        }

        save(options: ModelSaveOptions = {}) {
            if (!this.storage) Promise.reject(createError(ModelErrorCode.MissingStorage, `storage not spicified on ${String(this)}`));

            if (!this.isDirty && !this.isNew && !options.force) {
                return Promise.resolve();
            } else if (!this.isDirty && this.isNew && this[MetaKeys.Attributes].size == 0) {
                return Promise.resolve();
            }

            if (!options.silent)
                this.trigger(ModelEvents.BeforeSave, options.meta);

            return this.storage!.save(this, options.meta).then(resp => {
                this.set(resp);
                this._changes = void 0;
                if (!options.silent)
                    this.trigger(ModelEvents.Save, options.meta, resp);
            });

        }

        fetch(options: ModelFetchOptions = {}) {
            if (!this.id) return Promise.reject(createError(`cannot fetch a model with no id`));
            if (!this.storage) throw createError(ModelErrorCode.MissingStorage, `storage not spicified on ${String(this)}`);

            if (!options.silent)
                this.trigger(ModelEvents.BeforeFetch, options.meta);

            return this.storage!.get(String(this.id), options.meta)
                .then(resp => {
                    if (!isPlainObject(resp)) throw new TypeError('not an object');
                    this.set(resp);
                    this._changes = void 0;
                    if (!options.silent)
                        this.trigger(ModelEvents.Fetch, options.meta, resp);
                });

        }

        delete(options: ModelDeleteOptions = {}) {
            if (!this.id) return Promise.reject(createError(`cannot delete a model with no id`));
            if (!this.storage) throw createError(ModelErrorCode.MissingStorage, `storage not spicified on ${String(this)}`);

            if (!options.silent)
                this.trigger(ModelEvents.BeforeDelete);

            return this.storage!.delete(String(this.id), options.meta).then(_ => {
                if (!options.silent)
                    triggerMethodOn(this, ModelEvents.Delete, this);
            });
        }


        onChange(changes: any) {
            this._changes = changes;
        }

    }
}
