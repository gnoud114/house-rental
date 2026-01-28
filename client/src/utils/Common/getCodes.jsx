import { getNumbersArea, getNumbersPrice } from "./getNumbers"

export const getCodePrice = (totals) => {
    return totals?.map(item => {
        let arrMaxMin = getNumbersPrice(item.value)
        let min = 0
        let max = 0
        if (arrMaxMin.length === 1) {
            if (item.value.includes('Dưới')) {
                min = 0
                max = arrMaxMin[0]
            } else if (item.value.includes('Trên')) {
                min = arrMaxMin[0]
                max = 999999
            }
        } else if (arrMaxMin.length === 2) {
            min = arrMaxMin[0]
            max = arrMaxMin[1]
        }
        return ({
            ...item,
            min,
            max
        })
    })
}

export const getCodeArea = (totals) => {
    return totals?.map(item => {
        let arrMaxMin = getNumbersArea(item.value)
        let min = 0
        let max = 0
        if (arrMaxMin.length === 1) {
            if (item.value.includes('Dưới')) {
                min = 0
                max = arrMaxMin[0]
            } else if (item.value.includes('Trên')) {
                min = arrMaxMin[0]
                max = 999999
            }
        } else if (arrMaxMin.length === 2) {
            min = arrMaxMin[0]
            max = arrMaxMin[1]
        }
        return ({
            ...item,
            min,
            max
        })
    })
}

export const getCodes = (value, prices) => {
    const pricesWithMinMax = getCodePrice(prices)
    if (Array.isArray(value)) {
        return pricesWithMinMax.filter(item => (item.min >= value[0] && item.min <= value[1]) || (item.max >= value[0] && item.max <= value[1]))
    } else {
        return pricesWithMinMax.filter(item => item.min <= value && item.max > value)
    }
}

export const getCodesArea = (value, areas) => {
    const areasWithMinMax = getCodeArea(areas)
    if (Array.isArray(value)) {
        return areasWithMinMax.filter(item => (item.min >= value[0] && item.min <= value[1]) || (item.max >= value[0] && item.max <= value[1]))
    } else {
        return areasWithMinMax.filter(item => item.min <= value && item.max > value)
    }
}
