import Page from './page.component';

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

export default Paginator;
