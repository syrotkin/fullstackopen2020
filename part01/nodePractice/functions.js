const sum = (p1, p2) => {
    console.log(p1);
    console.log(p2);
    return p1 + p2;
};

const result = sum(1, 4);

const square = p => {
    console.log(p);
    return p * p;
};

const array = [1, 2, 3];
const arraySquared = array.map(element => element * element);

console.log(arraySquared);

// function declaration
function product(a, b) {
    return a * b;
}

// function expression
const average = (a, b) => {
  return (a + b) / 2;
};

