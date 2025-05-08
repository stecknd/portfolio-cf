export const stringToBinary = (str: string) => {
    let bin = '';
    for( let i = 0; i < str.length; i++ ) {
        bin += str.charCodeAt(i).toString(2);
    }
    return bin;
}

export const addOne = (bin: string) => {
    bin += '10000000';
    return bin;
}

export const pad = (bin: string) => {
    const length = bin.length;
    const mod = length % 512;
    const padLength = (mod < 448 ? 448 : 448 + 512) - mod;
    const pad = '0'.repeat(padLength);
    bin += pad;
    return bin;
}