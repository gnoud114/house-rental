export const getNumbersPrice = (string) => string.split(' ').map(item => +item).filter(item => !isNaN(item))
export const getNumbersArea = (string) => string.split(' ').map(item => {
    const match = item.match(/\d+(\.\d+)?/)
    return match ? +match[0] : NaN
}).filter(item => !isNaN(item))