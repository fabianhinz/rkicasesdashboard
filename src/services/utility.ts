import { RkiData } from '../model/model'

const summUp = <T>(arr: { [k in keyof T]: any }[], key: keyof T) =>
    arr.reduce((acc, obj) => {
        if (!obj || typeof obj[key] !== 'number') return (acc += 0)
        return (acc += obj[key])
    }, 0)

const percentageOf = (now: number, prev: number) => {
    const diffInPercent = (1 - prev / now) * 100

    return {
        value: diffInPercent,
        formatted:
            diffInPercent > 0 ? `+${diffInPercent.toFixed(2)} %` : `${diffInPercent.toFixed(2)} %`,
    }
}

const calculateDoublingRates = (docs: RkiData[]) =>
    docs.map((doc, index) => {
        // ? we need 2 prior datapoints to calculate the doubling rate
        if (index < 2) return doc

        const now = summUp([docs[index], docs[index - 1]], 'cases') / 2
        const prev = docs[index - 2].cases
        const growth: number = 1 + percentageOf(now, prev).value / 100

        const doublingRate = Math.log(2) / Math.log(growth)

        if (isNaN(doublingRate) || doublingRate < 0 || doublingRate === Infinity) return doc
        return { ...doc, doublingRate }
    })

export { summUp, percentageOf, calculateDoublingRates }

//now:  (20680 + 20141) / 2 >> 20.410,5
//prev: 19395
// growth 1,0497538032
