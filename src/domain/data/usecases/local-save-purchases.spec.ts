class LocalSavePurchases {

    constructor(private readonly cacheStore: CacheStore) {}

    async init(): Promise<void> {
        return new Promise(resolve => resolve())
    }
}

interface CacheStore {
}

class CacheStoreSpy implements CacheStore {
    deleteCallsCount = 0
}

describe('LocalSavePurchases', () => {
    test('Should not delete cache on sut.init', () => {
        const cacheStore = new CacheStoreSpy()
        new LocalSavePurchases(cacheStore)
        expect(cacheStore.deleteCallsCount).toBe(0)
    })
})