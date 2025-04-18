console.log("Hello World");

let a = prompt("Enter your marks: ");

if(a >= 90){
    alert("You got A+ Grade");
}
else if(a >= 80){
    alert("You got A Grade");
}
else if(a >= 70){
    alert("You got B+ Grade");
}
else if(a >= 60){
    alert("You got B Grade");
}
else if(a >= 50){
    alert("You got C Grade");
}
else{
    alert("You are Failed");
}


let b = prompt("Enter a number to check the divisibility: ");

if((b % 5 == 0) && (b % 3 == 0)){
    alert("The number is divisible by both 5 and 3");
}
else{
    alert("The number is not divisible by both 5 and 3");
}

let c = prompt("Enter your Age: ");
if(c <= 18){
    alert("You are not eligible to vote, because you are a minor");
}
else if(c >=18 && c < 60){
    alert("You are eligible to vote as you are an adult");
}
else{
    alert("You are eligible to vote as you are a senior citizen");
}