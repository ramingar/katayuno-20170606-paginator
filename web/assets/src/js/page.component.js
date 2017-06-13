const Page = function (offsetFirstElement, offsetLastElement) {
    let nextObject = undefined;
    let previousObject = undefined;

    const next = function (n = null) {
        if (null !== n) {
            nextObject = n;
        }
        return nextObject;
    };

    const previous = function (p = null) {
        if (null !== p) {
            previousObject = p;
        }
        return previousObject;
    };

    return {offsetFirstElement, offsetLastElement, next, previous};
};

export default Page;
