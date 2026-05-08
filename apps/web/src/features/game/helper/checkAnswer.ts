export const  checkAnswer = (input: string, correctWords: string[]): boolean =>{
    const normalizedInput = input
    .toLowerCase()
    .replaceAll(/[^\w\s]/g, '')
    .trim();

    const inputWords = normalizedInput.split(/\s+/).filter(w => w.length>0);
    const normalizedCorret = correctWords.map(w=>w.toLowerCase().trimEnd());

    return (
        inputWords.length === normalizedCorret.length && inputWords.every((word, i) => word === normalizedCorret[i])
    )
}