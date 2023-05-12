export function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max);
}

export function randint(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}