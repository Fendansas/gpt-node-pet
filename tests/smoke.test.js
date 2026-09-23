

function sum (a, b){
    return a+b
}


test('two plus two is four', ()=>{
    expect(sum(2,2)).toBe(4)
})

test('5+3=8', ()=>{
    expect(sum(5,3)).toBe(8);
})

test('-2+5=3',() =>{
    expect(sum(-2,5)).toBe(3);
})

