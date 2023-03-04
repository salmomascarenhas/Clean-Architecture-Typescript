import { CacheStore } from "@/data/protocols/cache/cache-store"
export class LocalSavePurchases {

    constructor(private readonly cacheStore: CacheStore) { }

    async init(): Promise<void> {
        return new Promise(resolve => resolve())
    }

    async save(): Promise<void> {
        this.cacheStore.delete('purchases')
    }
}