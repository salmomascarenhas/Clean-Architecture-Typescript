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
    test('Should not delete cache on sut.init', () => {
        const { cacheStore } = makeSut()
        new LocalSavePurchases(cacheStore)
        expect(cacheStore.deleteCallsCount).toBe(0)
    })

    test('Should delete old cache on sut.save', async () => {
        const { cacheStore, sut } = makeSut()
        const purchases = mockPurchases()
        await sut.save(purchases)
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should not inser new cache if delete fails', () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateDeleteError()
        const purchases = mockPurchases()
        const promise = sut.save(purchases)
        expect(cacheStore.insertCallsCount).toBe(0)
        expect(promise).rejects.toThrow()
    })

    test('Should insert new cache if delete sucess', async () => {
        const { cacheStore, sut } = makeSut()
        const purchases = mockPurchases()
        await sut.save(purchases)
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.insertCallsCount).toBe(1)
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual(purchases)
    })

    test('Should throw if insert throws', () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateInsertError()
        const purchases = mockPurchases()
        const promise = sut.save(purchases)
        expect(promise).rejects.toThrow()
    })
})