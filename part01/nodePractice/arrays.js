const array = [1, 2, 3]

const array2 = array.concat(5);
console.log(array);

array2.forEach((a) => {
  console.log(a);
});

const doubledArray = array.map(e => e * 2);
console.log(doubledArray);

const [first, ...rest] = doubledArray;

console.log(first);
console.log(rest);