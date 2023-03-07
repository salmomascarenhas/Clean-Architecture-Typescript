import { CacheStore } from '@/data/protocols/cache'
import { SavePurchases } from "@/domain/usecases"

export class CacheStoreSpy implements CacheStore {
    messages: Array<CacheStoreSpy.Action> = []
    deleteKey: string
    insertKey: string
    insertValues: Array<SavePurchases.Params> = []

    delete(key: string): void {
        this.messages.push(CacheStoreSpy.Action.delete)
        this.deleteKey = key
    }

    insert(key: string, value: any): void {
        this.messages.push(CacheStoreSpy.Action.insert)
        this.insertKey = key
        this.insertValues = value
    }

    replace(key: string, value: any): void {
        this.delete(key)
        this.insert(key, value)
    }

    simulateDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
            this.messages.push(CacheStoreSpy.Action.delete)
            throw new Error()
        })
    }

    simulateInsertError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
            this.messages.push(CacheStoreSpy.Action.insert)
            throw new Error()
        })
    }
}

export namespace CacheStoreSpy {
    export enum Action {
        delete = 'delete',
        insert = 'insert'
    }
}