// async function getAllEmployees(){
//     let response =await fetch('http://localhost:8000/v1/employees/all');
//     let data = await response.json();
//     console.log(data);
// }

// getAllEmployees();

//Variables







//Handle Register and Login UI code starts here
let registerButton = document.getElementById('register');
let loginButton = document.getElementById('login');

registerButton.addEventListener('click',showRegister);

function showRegister(){
    let registerDiv = document.querySelector('#root .register');
    registerDiv.style.display = 'block';
    let loginDiv = document.querySelector('#root .login');
    loginDiv.style.display = 'none';
}

showRegister();

loginButton.addEventListener('click',(event)=>{
    let registerDiv = document.querySelector('#root .register');
    registerDiv.style.display = 'none';
    let loginDiv = document.querySelector('#root .login');
    loginDiv.style.display = 'block';
})
//Handle Register and Login UI code ends here


//Register Employee code starts here
const submitButton = document.getElementById('register-button');
submitButton.addEventListener('click',()=>{
    //taking data from each inputs
    const name = document.getElementById('name').value;
    document.getElementById('name').value = "";
    const email = document.getElementById('email').value;
    document.getElementById('email').value = "";
    const password = document.getElementById('password').value;
    document.getElementById('password').value = "";
    //console.log(name, email, password);
    let inputData = {
        'email':email,
        'name':name,
        'password':password
    }
    let res = registerEmp(inputData);
    
})

async function registerEmp(data){
    let registerPromis = fetch('http://localhost:8000/v1/employees/register',{
        'method':'POST',
        'headers':{
            'Content-Type':'application/json'
        },
        'body':JSON.stringify(data)
    })

    let responseData =await registerPromis.then((res)=>{
        if(res.ok){
            return res.json();
        }else{
            //throw error
        }
    })

    registerPromis.catch((error)=>{
        console.log('Error');
    })
    return responseData;
}
//Register Employee code ends here


//Login Employee code ends here