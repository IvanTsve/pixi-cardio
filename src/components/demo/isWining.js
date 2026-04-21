import wins from './winTable';
function isWining(reelResult) {
    let mappedResult = [];

    for (let i = 0; i < wins.length; i++) {
        mappedResult = [];
        const winCase = wins[i];
        for (let jIndex = 0; jIndex < winCase.length; jIndex++) {
            const elements = winCase[jIndex];
            for (let k = 0; k < elements.length; k++) {
                const element = elements[k];
                if (element == 1) {
                    mappedResult.push(reelResult[jIndex][k]);
                }
            }
        }
        let allSame = mappedResult.every(el => el === mappedResult[0]);
        if (mappedResult.length > 0 && allSame) {
            return true;
        }
    }    

    return false;

}

export default isWining;