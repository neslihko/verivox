export const getRandomNumber = (minNumber: number, maxNumber: number) => {
    const min = Math.ceil(minNumber);
    const max = Math.floor(maxNumber);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// `delay` is defined in milliseconds
export const sleep = async (delay: number) => {
    await new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

// `minDelay` and `maxDelay` are defined in milliseconds
export const randomSleep = async (minDelay = 250, maxDelay = 2000) => {
    const randomDelay = getRandomNumber(minDelay, maxDelay);
    await sleep(randomDelay);
}
