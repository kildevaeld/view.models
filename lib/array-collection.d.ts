import { ICollection, MetaKeys } from './types';
import { EventEmitter } from '@viewjs/events';
export declare class ArrayCollection<T> extends EventEmitter implements ICollection<T> {
    constructor(array?: Array<T>);
    private [MetaKeys.Models];
    /**
     * The length of the array
     *
     * @readonly
     * @type {number}
     * @memberof ArrayCollection
     */
    readonly length: number;
    /**
     * Get item at index
     *
     * @param {number} index
     * @returns {(T | undefined)}
     *
     * @memberof ArrayCollection
     */
    item(index: number): T | undefined;
    /**
     * Push an item and optionally trigger a change event
     *
     * @param {T} m
     * @param {boolean} [trigger=true]
     *
     * @memberof ArrayCollection
     */
    push(m: T, trigger?: boolean): number;
    /**
     * Pop a item from the array and optinally trigger a change event
     *
     * @param {boolean} [trigger=true]
     * @returns {(T | undefined)}
     *
     * @memberof ArrayCollection
     */
    pop(trigger?: boolean): T | undefined;
    insert(m: T, index: number): void;
    indexOf(m: T): number;
    removeAtIndex(index: number): T | undefined;
    remove(model: T): T | undefined;
    find(fn: (model: T, index: number, obj: T[]) => boolean): T | undefined;
    findIndex(fn: (model: T, index: number, obj: T[]) => boolean): number;
    sort(byComparatorOrProperty?: ((a: T, b: T) => number) | string): void;
    /**
     * Reset the array
     *
     * @param {T[]} [a]
     *
     * @memberof ArrayCollection
     */
    reset(a?: T[]): void;
    filter(fn: (a: T) => boolean): this;
    map<U>(fn: (a: T, idx: number) => U): ArrayCollection<U>;
    forEach(fn: (a: T, idx: number) => any): this;
    destroy(): void;
    [Symbol.iterator](): {
        next(): {
            done: boolean;
            value: T | null;
        };
    };
}
