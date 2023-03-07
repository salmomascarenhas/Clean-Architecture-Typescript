import { CacheStore } from "@/data/protocols/cache/cache-store"
import { LoadPurchases, SavePurchases } from "@/domain/usecases"
export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
    readonly key = 'purchases'
    constructor(
        private readonly cacheStore: CacheStore,
        private readonly currentData: Date
    ) { }

    async save(purchases: Array<SavePurchases.Params>): Promise<void> {
        this.cacheStore.replace(this.key, {
            timestamp: this.currentData,
            value: purchases
        })
    }

    async loadAll(): Promise<Array<LoadPurchases.Result>> {
        try {
            const cache = this.cacheStore.fetch(this.key)
            const maxAge = new Date(cache.timestamp)
            maxAge.setDate(maxAge.getDate() + 3)
            if (maxAge > this.currentData) {
                return cache.value
            } else {
                throw new Error()
            }
        } catch (error) {
            this.cacheStore.delete(this.key)
            return []

        }
    }
}