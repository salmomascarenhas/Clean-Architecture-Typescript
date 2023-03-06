import { CacheStoreSpy } from "@/data/tests/mock-cache"
import { mockPurchases } from "@/data/tests/mock-purchases"
import { LocalSavePurchases } from "@/data/usecases"

type SutTypes = {
    sut: LocalSavePurchases
    cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore)
    return {
        sut,
        cacheStore
    }
}

describe('LocalSavePurchases', () => {
    test('Should not delete or insert cache on sut.init', () => {
        const { cacheStore } = makeSut()
        new LocalSavePurchases(cacheStore)
        expect(cacheStore.messages).toEqual([])
    })

    test('Should delete old cache on sut.save', async () => {
        const { cacheStore, sut } = makeSut()
        const purchases = mockPurchases()
        await sut.save(purchases)
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should not insert new cache if delete fails', () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateDeleteError()
        const purchases = mockPurchases()
        const promise = sut.save(purchases)
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])
        expect(promise).rejects.toThrow()
    })

    test('Should insert new cache if delete sucessds', async () => {
        const { cacheStore, sut } = makeSut()
        const purchases = mockPurchases()
        await sut.save(purchases)
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual(purchases)
    })

    test('Should throw if insert throws', () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateInsertError()
        const purchases = mockPurchases()
        const promise = sut.save(purchases)
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
        expect(promise).rejects.toThrow()
    })
})