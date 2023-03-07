import { CacheStoreSpy } from "@/data/tests/mock-cache"
import { mockPurchases } from "@/data/tests/mock-purchases"
import { LocalLoadPurchases } from "@/data/usecases"

type SutTypes = {
    sut: LocalLoadPurchases
    cacheStore: CacheStoreSpy
}

const makeSut = (timestamp: Date = new Date()): SutTypes => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalLoadPurchases(cacheStore, timestamp)
    return {
        sut,
        cacheStore
    }
}

describe('LocalLoadPurchases', () => {
    test('Should not delete or insert cache on sut.init', () => {
        const { cacheStore } = makeSut()
        expect(cacheStore.messages).toEqual([])
    })

    test('Should not insert new cache if delete fails', async () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateDeleteError()
        const purchases = mockPurchases()
        const promise = sut.save(purchases)
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Action.delete])
        await expect(promise).rejects.toThrow()
    })

    test('Should insert new cache if delete sucessds', async () => {
        const timestamp = new Date()
        const { cacheStore, sut } = makeSut(timestamp)
        const purchases = mockPurchases()
        const promise = sut.save(purchases)
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
        expect(cacheStore.deleteKey).toBe('purchases')
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual({
            timestamp,
            value: purchases
        })
        await expect(promise).resolves.toBeFalsy()
    })

    test('Should throw if insert throws', async () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateInsertError()
        const purchases = mockPurchases()
        const promise = sut.save(purchases)
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
        await expect(promise).rejects.toThrow()
    })
})