export const add = (...val) => {
    console.log(val,'val');
    return 1 + 2 + 6 + val[0];
}
const aaa = 123;
console.log(add(87),aaa);