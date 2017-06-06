import test from 'tape';

// Component to test
const Paginator = function (elementsNumber = 0, numberOfElementsPerPage = 1) {

    if (numberOfElementsPerPage < 1) {
        throw Object.create(RangeError('Number of elements per page cannot be inferior than 1'));
    }

    let elements = elementsNumber;
    let elementsPerPage = numberOfElementsPerPage;

    const getTotalPages = function () {
        return Math.ceil(elements / elementsPerPage);
    };

    return {getTotalPages};
};


// Ideas:
// Número de páginas totales
// En qué página estoy
// Cuál es el previous y el next
// Cuántos ítems por página
// Offset de la página actual (el número de elemento del último elemento de la página actual)
// Número de links que vamos a mostrar (número de páginas a partir de la página actual)


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
