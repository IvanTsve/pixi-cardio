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
                    mappedResult.push({
                        elIndex: jIndex,
                        reelIndex: k,
                        symbol: reelResult[k][jIndex],
                    });
                }
            }
        }
        let allSame = mappedResult.every(el => el.symbol === mappedResult[0].symbol);
        
        // if (mappedResult.length > 0 && mappedResult[0].symbol == mappedResult[1].symbol) {
        if (mappedResult.length > 0 && allSame) {
            return mappedResult;
        }
    }
    return null;
}
export default isWining;