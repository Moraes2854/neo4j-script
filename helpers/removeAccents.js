const removeAccents = ( str ) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/(\r\n|\n|\r)/gm, '');
}

module.exports = { removeAccents };