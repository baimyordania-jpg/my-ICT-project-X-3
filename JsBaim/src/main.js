//javascript -->Programming Language "comment 1 baris"
/*
"comment paragraft"
1. output and input
2. variable and data type
3. condition (if else)
4. looping (pengulangan)
5. function
*/

//output
//1. using console.log();
console.log("Assalamualaikum");
console.log("Welcome to My firstjavascript");
//2. using alert(); (peringatan)
alert("astaaaaaaaaa");
//3. using innerHTML
document.getElementById("bye").innerHTML="to ibrahim X-3"

//variable --> to store data (untuk menyimpan data)
//variable : (let, var, const)
//let
let namaku = "Ibrahim";
console.log(namaku);
let lastname = " Kh";
console.log(lastname);
console.log(namaku, lastname);

let a = 10;
a = 3;
console.log(a);

var b = 5;
var b = 1;
console.log(b);

const z = 33;
console.log(z);

//type data
//1. string = character --> use ""/''
//2. number (integer, float)
//      integer = bilangan bulat
//      float = bilangan pecahan/desimal
//3. boolean = true, false

let dataone = "Fabian A.P"; //string
let datatwo = 67; //integer
let datathree = 15.4; //float
let datafour = false; //boolean

//operator
/*1. operator aritmatika
- penjumlahan (+)
- pengurangan (-)
- perkalian (*)
- pembagian (/)
- perpangkatan (**)
- modulus (%) --> sisa hasil bagi
*/ //Example
let number1 = 10;
let number2 = 5;
console.log(number1 + number2);
console.log(number1 - number2);
console.log(number1 * number2);
console.log(number1 / number2);
console.log(number1 ** number2);
console.log(number1 % number2);

//menghitung luas persegi panjang --> luas = panjang * lebar
let panjang = 30;
let lebar = 2;
let luas = panjang * lebar;
console.log("Luas persegi adalah" , luas);


//membuat rumus BMI
//berat-badan(kg) dibagi tinggi-badan(cm) pangkat2 dikali 10.000
let berat_badan  = 50;
let tinggi_badan = 150;
let kali = 10000;
let total1 = berat_badan/(tinggi_badan**2)*kali;
console.log("berat badan = ", berat_badan);
console.log("tinggi badan = ", tinggi_badan);
console.log("Total BMI adalah" , total1);

/* comparison (operators (perbandingan))
- equal to (==)
- not equal (!=)
- greater than (>)
- great than or equal (>=)
- less than (<)
-less than or equal (<=)
*/
let s = 5;
console.log(s == 5); //true
console.log(s != 5); //false
console.log(s > 5); //false
console.log(s >= 5); //true
console.log(s < 10); //true
console.log(s <= 5); //true

/*
Logical  operators
- AND (&&) semua kondisi harus true
- OR (||)  salah satu harus true, maka hasilnya tetap true
- NOT (!)  nilai kebalikan jika condisi example(A= true, maka hasilnya false)
*/

//1. condition
/*
if (condition){
    action;
}
*/
let h = 10;
if (h >= 10){
    console.log("Hello");
}

/*2. conditions
if (actions){
    action 1;
}
else{
    action 2;
}
*/
let q = 17
if (q < 10){
    console.log("Goodbye");
}
else{
    console.log("im comming");
}