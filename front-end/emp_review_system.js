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
    registerEmp(inputData);
})

async function registerEmp(data){
    let registerPromis = fetch('http://localhost:8000/v1/employees/register',{
        'method':'POST',
        'headers':{
            'Content-Type':'application/json'
        },
        'body':JSON.stringify(data)
    })

    let responseData = await registerPromis.then((res)=>{
        if(res.ok){
            return res.json();
        }else{
            //throw error
        }
    })

    registerPromis.catch((error)=>{
        console.log('Error');
    })
    //work with response
    if(responseData.status_code===409){
        alert(responseData.message);
    }else if(responseData.status_code===201){
        alert(responseData.message);
    }
    
}
//Register Employee code ends here


//Login Employee code starts here
const login = document.getElementById('login-button');
login.addEventListener('click',()=>{
    //taking data from each inputs
    const email = document.getElementById('email-login').value;
    document.getElementById('email-login').value = "";
    const password = document.getElementById('password-login').value;
    document.getElementById('password-login').value = "";
    let inputData = {
        'email':email,
        'password':password
    }
    loginEmp(inputData);
})

async function loginEmp(data){
    let registerPromis = fetch('http://localhost:8000/v1/employees/login',{
        'method':'POST',
        'headers':{
            'Content-Type':'application/json'
        },
        'body':JSON.stringify(data)
    })

    let responseData = await registerPromis.then((res)=>{
        if(res.ok){
            return res.json();
        }else{
            //throw error
        }
    })

    registerPromis.catch((error)=>{
        console.log('Error');
    })
    //work with response
    if(responseData.status_code===200){
        //successfully logged in
        if(responseData.user.is_admin===true){
            //user is admin
            welcomeAdmin();
        }else{
            //user is not an admin
        }
    }else {
        console.log('Password or email id is wrong');
    }
}
//Login Employee code ends here


//Admin view function starts
async function welcomeAdmin(){
    let response =await fetch('http://localhost:8000/v1/employees/all');
    let data = await response.json();
    
    let registerDiv = document.querySelector('#root .register');
    registerDiv.style.display = 'none';
    let loginDiv = document.querySelector('#root .login');
    loginDiv.style.display = 'none';

    console.log(data);
    //show the data on UI
}