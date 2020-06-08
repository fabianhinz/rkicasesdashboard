import Dexie from 'dexie'

type Keys = 'layout' | 'settings' | 'enabledStates' | 'theme' | 'visibleCharts' | 'favoriteCounties'

class Db extends Dexie {
    data: Dexie.Table<any, Keys>

    constructor(databaseName: string) {
        super(databaseName)
        this.version(1).stores({
            data: '++, value',
        })
        this.data = this.table('data')
    }
}

const db = new Db('rkicasesdashboard')

export async function getOrThrow<T>(key: Keys) {
    const data: T = await db.data.get(key)
    if (!data) throw new Error(`could not get data for ${key}`)
    else return data
}

export default db
