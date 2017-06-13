import test from 'tape';

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

// Component to test
const Paginator = function (elements = 0, elementsPerPage = 1) {

    if (elementsPerPage < 1) {
        throw Object.create(RangeError('Number of elements per page cannot be inferior than 1'));
    }

    const totalPages = Math.ceil(elements / elementsPerPage);
    const pages = [];
    let currentPage = 1;
    const MIN_PAGE = 1;

    const getPage = function (index) {
        return undefined === pages[index] ? pages[index] : null;
    };

    const pagesConstructor = function () {
        let offsetFirstElement = 0;
        let offsetLastElement = 0;
        let newPage = {};

        for (let pagesCounter = MIN_PAGE; pagesCounter <= totalPages; pagesCounter++) {

            offsetLastElement = ((elementsPerPage * pagesCounter) - 1) > (elements - 1)
                ? elements - 1
                : (elementsPerPage * pagesCounter) - 1;
            newPage = Page(offsetFirstElement, offsetLastElement);
            offsetFirstElement = offsetLastElement + 1;

            pages.push(newPage);
            if (undefined !== pages[pages.length - 2]) {
                pages[pages.length - 1].previous(pages[pages.length - 2]);
                pages[pages.length - 2].next(pages[pages.length - 1]);
            }
        }
    };

    const throwPageErrorException = function (pageNumber) {
        throw Object.create(RangeError('Page ' + pageNumber + ' doesn\'t exist. Existing pages go from ' +
            MIN_PAGE + ' to ' + totalPages + '.'));
    };

    const validPage = function (pageNumber) {
        return !(pageNumber > totalPages || pageNumber < MIN_PAGE);
    };


    // Public methods

    const getTotalPages = function () {
        return totalPages;
    };

    const go = function (pageNumber) {
        if (!validPage(pageNumber)) {
            throwPageErrorException(pageNumber);
        }
        currentPage = pageNumber;
    };

    const previousPage = function () {
        return 0 === (currentPage - 1) ? MIN_PAGE : currentPage - 1;
    };

    const nextPage = function () {
        return (currentPage + 1) > totalPages ? totalPages : currentPage + 1;
    };

    const getCurrentPage = function () {
        return currentPage;
    };

    const offsetsRange = function (pageNumber) {
        if (!validPage(pageNumber)) {
            throwPageErrorException(pageNumber);
        }
        return [pages[pageNumber - 1].offsetFirstElement, pages[pageNumber - 1].offsetLastElement];
    };

    pagesConstructor();

    return {getTotalPages, go, previousPage, nextPage, currentPage: getCurrentPage, offsetsRange};
};

// TESTS
test('-------- Component: return total number of pages', (assert) => {
    const message = 'Wrong number of pages';

    const elementsNumber = 10;
    const elementsPerPage = 10;
    const expectedPages = 1;

    const paginator = Paginator(elementsNumber, elementsPerPage);
    const actualPages = paginator.getTotalPages();

    assert.equal(actualPages, expectedPages, message);
    assert.end();
});

test('-------- Component: return total number of pages when total of elements is not a multiple of elements per page', (assert) => {
    const message = 'Wrong number of pages';

    const elementsNumber = 12;
    const elementsPerPage = 10;
    const expectedPages = 2;

    const paginator = Paginator(elementsNumber, elementsPerPage);
    const actualPages = paginator.getTotalPages();

    assert.equal(actualPages, expectedPages, message);
    assert.end();
});

test('-------- Component: elements per page must be greater than 0', (assert) => {
    const message = 'If we assign 0 or less as the number of elements per page, our Paginator throws a RangeError';

    const elementsNumber = 10;
    const elementsPerPage = 0;
    const exceptionExpected = RangeError;

    const actualException = () => Paginator(elementsNumber, elementsPerPage);

    assert.throws(actualException, exceptionExpected, message);
    assert.end();
});

test('-------- Component: testing previous page', (assert) => {
    const message = 'Previous page must be the previous to the current page.';

    const elementsNumber = 12;
    const elementsPerPage = 10;
    const expectedPreviousPage = 1;

    const paginator = Paginator(elementsNumber, elementsPerPage);
    paginator.go(2);
    const actualPreviousPage = paginator.previousPage();

    assert.equal(actualPreviousPage, expectedPreviousPage, message);
    assert.end();
});

test('-------- Component: testing next page', (assert) => {
    const message = 'Next page must be the next to the current page.';

    const elementsNumber = 12;
    const elementsPerPage = 10;
    const expectedPreviousPage = 2;

    const paginator = Paginator(elementsNumber, elementsPerPage);
    const actualPreviousPage = paginator.nextPage();

    assert.equal(actualPreviousPage, expectedPreviousPage, message);
    assert.end();
});

test('-------- Component: testing previous page when we are in the first page', (assert) => {
    const message = 'Previous page when we are in the first page must be the first page.';

    const elementsNumber = 12;
    const elementsPerPage = 10;
    const expectedPreviousPage = 1;

    const paginator = Paginator(elementsNumber, elementsPerPage);
    const actualPreviousPage = paginator.previousPage();

    assert.equal(actualPreviousPage, expectedPreviousPage, message);
    assert.end();
});

test('-------- Component: testing next page when we are in the last page', (assert) => {
    const message = 'Next page when we are in the last page must be the last page.';

    const elementsNumber = 12;
    const elementsPerPage = 10;
    const expectedPreviousPage = 2;

    const paginator = Paginator(elementsNumber, elementsPerPage);
    const actualPreviousPage = paginator.nextPage();

    assert.equal(actualPreviousPage, expectedPreviousPage, message);
    assert.end();
});

test('-------- Component: we cannot navigate to an unexisting page', (assert) => {
    const message = 'The page we want to navigate doesn\'t exist and we cannot navigate to it.';

    const elementsNumber = 12;
    const elementsPerPage = 10;
    const exceptionExpected = RangeError;

    const paginator = Paginator(elementsNumber, elementsPerPage);
    const actualValue = () => paginator.go(3);

    assert.throws(actualValue, exceptionExpected, message);
    assert.end();
});

test('-------- Component: asking for the current page', (assert) => {
    const message = 'That is not the current page';

    const elementsNumber = 14;
    const elementsPerPage = 10;
    const expectedPage = 2;

    const paginator = Paginator(elementsNumber, elementsPerPage);
    paginator.go(paginator.nextPage());
    const actualPage = paginator.currentPage();

    assert.equal(actualPage, expectedPage, message);
    assert.end();
});

test('-------- Component: calculate offsets of the first and the last element of a page', (assert) => {
    const message = 'Offsets means what index takes the last and the first item of a page on the total of elements.';

    const elementsNumber = 14;
    const elementsPerPage = 10;
    const expectedRangeOffsets = [10, 13];

    const paginator = Paginator(elementsNumber, elementsPerPage);
    const actualRangeOffsets = paginator.offsetsRange(2);

    assert.deepEqual(actualRangeOffsets, expectedRangeOffsets, message);
    assert.end();
});
