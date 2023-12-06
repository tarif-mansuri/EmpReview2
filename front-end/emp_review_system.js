// async function getAllEmployees(){
//     let response =await fetch('http://localhost:8000/v1/employees/all');
//     let data = await response.json();
//     console.log(data);
// }

// getAllEmployees();

//Variables

//show register page code starts here

let registerButton = document.getElementById('register');

registerButton.addEventListener('click',()=>{
    let rootEle = document.getElementById('root');
    rootEle.innerHTML="";
    let nameEle = document.createElement('input');
    nameEle.setAttribute('type','text');
    nameEle.setAttribute('name','name');
    nameEle.setAttribute('placeholder','Enter your name');
    nameEle.setAttribute('id','name');

    let emailEle = document.createElement('input');
    emailEle.setAttribute('type','email');
    emailEle.setAttribute('name','email');
    emailEle.setAttribute('placeholder','Enter your email');
    emailEle.setAttribute('id','email');

    let passwordEle = document.createElement('input');
    passwordEle.setAttribute('type','password');
    passwordEle.setAttribute('name','password');
    passwordEle.setAttribute('placeholder','Enter your password');
    passwordEle.setAttribute('id','password');

    let buttonEle = document.createElement('button');
    buttonEle.innerText = 'Register';

    let divEle = document.createElement('div');
    divEle.classList.add('register');

    divEle.appendChild(nameEle);
    divEle.appendChild(emailEle);
    divEle.appendChild(passwordEle);
    divEle.appendChild(buttonEle);

    rootEle.appendChild(divEle);

    //adding do-register event listern in do register button
    buttonEle.addEventListener('click',function doRegister(){
        const name = nameEle.value;
        const email = emailEle.value;
        const password = passwordEle.value;
        const data = {
            'name':name,
            'email':email,
            'password':password
        };
        fetch("http://localhost:8000/v1/employees/register",{
            'method':'POST',
            'credentials':'include',
            'headers':{
                'Content-Type':'application/json'
            },
            'body':JSON.stringify(data)

        }).then((data)=>{
            console.log(data);
        })
    })
});

//show register page code ends here


//Show Login UI code starts here
let loginButton = document.getElementById('login');

loginButton.addEventListener('click',()=>{
    let rootEle = document.getElementById('root');
    rootEle.innerHTML="";
    let emailEle = document.createElement('input');
    emailEle.setAttribute('type','email');
    emailEle.setAttribute('name','email');
    emailEle.setAttribute('placeholder','Enter your email');
    emailEle.setAttribute('id','email');

    let passwordEle = document.createElement('input');
    passwordEle.setAttribute('type','password');
    passwordEle.setAttribute('name','password');
    passwordEle.setAttribute('placeholder','Enter your password');
    passwordEle.setAttribute('id','password');

    let buttonEle = document.createElement('button');
    buttonEle.innerText = 'Login';

    let divEle = document.createElement('div');
    divEle.classList.add('login');

    divEle.appendChild(emailEle);
    divEle.appendChild(passwordEle);
    divEle.appendChild(buttonEle);

    rootEle.appendChild(divEle);

    //Adding DO-Login event listner code
    buttonEle.addEventListener('click', function doLogin(){
        const emailId = emailEle.value;
        const pass = passwordEle.value;

        const data = {
            'email':emailId,
            'password':pass
        }

        fetch('http://localhost:8000/v1/employees/login',{
            'method':'POST',
            'credentials':'include',
            'headers':{
                'Content-Type':'application/json'
            },
            'body':JSON.stringify(data)
        }).then((data)=>{
            return data.json();
        }).then((data)=>{
            if(data.user.is_admin===true){
                welcomeAdmin();
            }
        })
    })

})

function welcomeAdmin(){
    fetch('http://localhost:8000/v1/employees/all',{
        'method':'GET',
        'credentials':'include',
        'headers':{
            'Content-Type':'application/json'
        },
    }).then((data)=>{
        return data.json();
    }).then((data=>{
        let rootEle = document.getElementById('root');
        rootEle.innerHTML="";
        const empList = data.allEmp;
        for(empObj of empList){
            let nameEle = document.createElement('label');
            nameEle.innerText = empObj.name;
            let emailEle = document.createElement('label');
            emailEle.innerText = empObj.email;
            let roleEle = document.createElement('label');
            roleEle.innerText = empObj.is_admin===true?'Admin':'Employee';

            let reviewButton = document.createElement('button');
            reviewButton.innerText = 'Reviews';

            let updateButton = document.createElement('button');
            updateButton.innerText = 'Update';

            let deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';

            let divEle = document.createElement('div');
            divEle.classList.add('emp');

            divEle.appendChild(nameEle);
            divEle.appendChild(emailEle);
            divEle.appendChild(roleEle);
            divEle.appendChild(reviewButton);
            divEle.appendChild(updateButton);
            divEle.appendChild(deleteButton);
            rootEle.appendChild(divEle);
        }
    }))
}


















// function showRegister(){
//     let registerDiv = document.querySelector('#root .register');
//     registerDiv.style.display = 'block';
//     let loginDiv = document.querySelector('#root .login');
//     loginDiv.style.display = 'none';
// }

//showRegister();

// loginButton.addEventListener('click',(event)=>{
//     let registerDiv = document.querySelector('#root .register');
//     registerDiv.style.display = 'none';
//     let loginDiv = document.querySelector('#root .login');
//     loginDiv.style.display = 'block';
// })
//Handle Register and Login UI code ends here


//Register Employee code starts here
// const submitButton = document.getElementById('register-button');
// submitButton.addEventListener('click',()=>{
//     //taking data from each inputs
//     const name = document.getElementById('name').value;
//     document.getElementById('name').value = "";
//     const email = document.getElementById('email').value;
//     document.getElementById('email').value = "";
//     const password = document.getElementById('password').value;
//     document.getElementById('password').value = "";
//     //console.log(name, email, password);
//     let inputData = {
//         'email':email,
//         'name':name,
//         'password':password
//     }
//     registerEmp(inputData);
// })

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
// login.addEventListener('click',()=>{
//     //taking data from each inputs
//     const email = document.getElementById('email-login').value;
//     document.getElementById('email-login').value = "";
//     const password = document.getElementById('password-login').value;
//     document.getElementById('password-login').value = "";
//     let inputData = {
//         'email':email,
//         'password':password
//     }
//     loginEmp(inputData);
// })

// async function loginEmp(data){
//     let registerPromis = fetch('http://localhost:8000/v1/employees/login',{
//         'method':'POST',
//         'credentials':'include',
//         'headers':{
//             'Content-Type':'application/json'
//         },
//         'body':JSON.stringify(data)
//     })

//     let responseData = await registerPromis.then((res)=>{
//         if(res.ok){
//             return res.json();
//         }else{
//             //throw error
//         }
//     })

//     registerPromis.catch((error)=>{
//         console.log('Error');
//     })
//     //work with response
//     if(responseData.status_code===200){
//         //successfully logged in
//         if(responseData.user.is_admin===true){
//             //user is admin
//             welcomeAdmin();
//         }else{
//             //user is not an admin
//         }
//     }else {
//         console.log('Password or email id is wrong');
//     }
// }
// //Login Employee code ends here


// //Admin view function starts
// async function welcomeAdmin(){
//     let response =await fetch('http://localhost:8000/v1/employees/all',{
//         'method':'GET',
//         'credentials':'include',
//         'headers':{
//             'Content-Type':'application/json'
//         },
//     });
//     let data = await response.json();
    
//     let registerDiv = document.querySelector('#root .register');
//     registerDiv.style.display = 'none';
//     let loginDiv = document.querySelector('#root .login');
//     loginDiv.style.display = 'none';

//     console.log(data);
//     //show the data on UI
// }