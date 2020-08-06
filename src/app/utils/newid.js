const newId = (prefix='id') => {
    return `${prefix}_${ new Date().getTime() }`;
}

export default newId;
