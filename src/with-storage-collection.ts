
import { Constructor, Base as BaseObject, isFunction } from '@viewjs/utils';
import { ModelEvents } from './types';
import { ModelCollection } from './model-collection'
import { Model } from './model';
import { createError, ModelErrorCode } from './errors';
import { Storage } from './storage';
import { IStorageModel, ModelStorageBaseOptions } from './with-storage-model';
import { withEventListener } from '@viewjs/events';

export interface StorageCollectionSaveOptions extends ModelStorageBaseOptions { }

export interface StorageCollectionFetchOptions extends ModelStorageBaseOptions {
    method?: 'reset' | 'add';
}

export interface StorageCollectionDeleteOptionsm extends ModelStorageBaseOptions { }

export interface IStorageCollection<TModel extends IStorageModel & Model> {
    create(input: any | object): Promise<TModel>;
    fetch(options?: StorageCollectionFetchOptions): Promise<any>;
    save(options?: StorageCollectionSaveOptions): Promise<any>;
}

export function withStorageCollection<
    T extends Constructor<ModelCollection<TModel>>,
    TModel extends IStorageModel & Model,
    TStorage extends Storage>(Base: T, storage?: ((model: ModelCollection<TModel>) => TStorage) | TStorage): T & Constructor<IStorageCollection<TModel>> {

    return class extends Base {

        private _listener = new (withEventListener(BaseObject));
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

        create(input: TModel | object): Promise<TModel> {
            const model = this.ensureModel(input);

            if (!model.storage) model.storage = this.storage;

            let promise: Promise<any> = Promise.resolve();
            if (model.isNew) {
                promise = model.save()
            }

            return promise.then(() => {
                this.push(model);
                return model;
            });

        }

        fetch(options: StorageCollectionFetchOptions = {}): Promise<any> {

            if (!this.storage) Promise.reject(createError(ModelErrorCode.MissingStorage, `storage not spicified on ${String(this)}`));

            this.trigger(ModelEvents.BeforeFetch);

            return this.storage!.list(options.meta).then(resp => {

                const result = this.parseRestResult(resp);
                if (options.method == 'reset') {
                    this.reset(result);
                } else {
                    result.map(m => this.push(m));
                }

                this.trigger(ModelEvents.Fetch);

            });

        }

        save() {
            this.trigger(ModelEvents.BeforeSave)
            return Promise.all(this.map(m => m.save())).then(() => {
                this.trigger(ModelEvents.Save);
                return [...this];
            });
        }

        parseRestResult(data: any): any[] {
            return data;
        }

        ensureModel(input: any) {
            const m: TModel = Base.prototype.ensureModel.call(this, input);
            if (!m.storage) m.storage = this.storage;
            return m;
        }


        protected didAddModel(model: TModel) {
            this._listener.listenToOnce(model, ModelEvents.BeforeDelete, () => {
                this.trigger(ModelEvents.BeforeDelete, model);
            })
            this._listener.listenToOnce(model, ModelEvents.Delete, () => {
                this.trigger(ModelEvents.Delete, model);
                this.remove(model);
            }, this);
        }

        protected didRemoveModel(model: TModel) {
            this._listener.stopListening(model);
        }

        destroy() {
            super.destroy();
            this._listener.stopListening();
            return this;
        }

    };
}