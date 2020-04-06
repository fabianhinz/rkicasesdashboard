const summUp = <T>(arr: { [k in keyof T]: any }[], key: keyof T) =>
    arr.reduce((acc, obj) => {
        if (typeof obj[key] === 'number') return (acc += obj[key])
        else return (acc += 0)
    }, 0)

const percentageOf = (now: number, prev: number) => {
    const diffInPercent = (1 - prev / now) * 100
    return diffInPercent > 0 ? `+${diffInPercent.toFixed(2)} %` : `${diffInPercent.toFixed(2)} %`
}

export { summUp, percentageOf }
