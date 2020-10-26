import { get as nestedGet, set as nestedSet } from "nested-property";

import { pick } from "@src/utils";


export default abstract class EntityCollection<T extends Entity> {
    ns: string;
    factory: (data: object, options?: object) => Promise<Entity<any>>;

    constructor(ns: string, factory: (data: object, options?: object) => Promise<Entity<any>>) {
        this.ns = ns;
        this.factory = factory;
    }

    abstract get collection(): Collection<T>;

    run(method: string, args: any[]) {
        const callback = this[method];
        if (callback) {
            callback.apply(this, args);
        }
    }

    get entities(): any[] {
        return this.collection.entities;
    }

    all(keys?: string[]) {
        if (keys) {
            return this.entities.map(e => pick(e, keys));
        }
        return this.entities;
    }

    one(pid: string) {
        return this.collection.get(pid);
    }

    get(pid, key) {
        const entity = this.one(pid);
        return nestedGet(entity, key);
    }

    set(pid, key, val) {
        const entity = this.one(pid);
        const update = { _id: pid };
        nestedSet(update, key, val);
        entity.update(update);
        return this.one(pid);
    }

    getFlag(pid, scope, key) {
        const entity = this.one(pid);
        return entity.getFlag(scope, key);
    }

    setFlag(pid, scope, key, value) {
        const entity = this.one(pid);
        entity.setFlag(scope, key, value);
        return this.one(pid);
    }

    unsetFlag(pid, scope, key) {
        const entity = this.one(pid);
        entity.unsetFlag(scope, key);
        return this.one(pid);
    }

    find(key, val) {
        return this.collection.find(p => nestedGet(p, key) == val);
    }

    filter(key, val) {
        return this.collection.filter(p => nestedGet(p, key) == val);
    }

    toggle(pid, key) {
        this.set(pid, key, !this.get(pid, key))
        return this.one(pid);
    }

    async create(name) {
        const entity = await this.factory({ name });
        return entity._id;
    }

    async remove(pid) {
        const entity = this.one(pid);
        await entity.delete();
    }
}
