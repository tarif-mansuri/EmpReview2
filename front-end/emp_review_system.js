
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
            return data.json();
        }).then((data)=>{
            h1Ele = document.createElement('h1');
            if(data.status_code === 409){
                h1Ele.innerText = `${data.message}`;
            }else{
                h1Ele.innerText = `Hi ${data.user.name}, You have been registered successfully`
            }
            rootEle.innerHTML = "";
            rootEle.appendChild(h1Ele);
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
            //1 user's email not registered in database
            //2 wront credentials
            //3 user is an admin
            //4 user is an employee
            h1Ele = document.createElement('h1');
            let rootEle = document.getElementById('root');
            rootEle.innerHTML = "";
            if(data.status_code===404){
                //user not registered
                h1Ele.innerText = 'User is not registered, Please register';
                rootEle.appendChild(h1Ele);
            }else if(data.status_code===409){
                //wrong credentials
                h1Ele.innerText = 'Incorrect userid or password';
                rootEle.appendChild(h1Ele);
            }else if(data.user.is_admin === true){
                //User is an admin
                welcomeAdmin();
            }else{
                //User is an employee
                welcomEmployee(data);
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
            nameEle.classList.add('credentials');

            let emailEle = document.createElement('label');
            emailEle.innerText = empObj.email;
            emailEle.classList.add('credentials');

            let roleEle = document.createElement('label');
            roleEle.innerText = empObj.is_admin===true?'Admin':'Employee';
            roleEle.classList.add('btn-field');

            let reviewButton = document.createElement('button');
            reviewButton.innerText = 'Reviews';
            reviewButton.classList.add('btn-field');

            //Adding review listener
            reviewButton.addEventListener('click', (event)=>showReviews(event));

            let updateButton = document.createElement('button');
            updateButton.innerText = 'Update';
            updateButton.classList.add('btn-field');

            //Adding update listener
            updateButton.addEventListener('click',updateEmployee);

            let deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.classList.add('btn-field');

            //Adding delete listener
            deleteButton.addEventListener('click', deleteEmployee);

            let divEle = document.createElement('div');
            divEle.classList.add('emp');

            divEle.setAttribute('id',empObj._id.toString());

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

//Welcome Employee function starts here
function welcomEmployee(){
    //1.fetch employee's own data, and show in UI + fetch data of all those employees whom he can review
    //2.Employee can see all those employees for whome he has been made a reviewer
}

//Delete Employee code starts here
function deleteEmployee(event){

    let divEle = event.target.parentElement;
    let id = divEle.id;
    fetch(`http://localhost:8000/v1/employees/delete/${id}`,{
        'method':'DELETE',
        'credentials':'include',
        'headers':{
            'content-cype':'application/json'
        }

    }).then((data)=>{
        return data.json();
    }).then((data)=>{
        let rootEle = document.getElementById('root');
        if(data.status_code===204){
            rootEle.removeChild(divEle)
        }
    }) 
}//Delete Employee code ends here

//Update Employee code starts here
function updateEmployee(event){
    let clickedDivEle = event.target.parentElement;
    let id = clickedDivEle.id;

    let inputName = document.createElement('input');
    inputName.classList.add('credentials');
    inputName.setAttribute('value', clickedDivEle.children[0].innerText);

    let inputEmail = document.createElement('input');
    inputEmail.classList.add('credentials');
    inputEmail.setAttribute('value', clickedDivEle.children[1].innerText);

    let inputRole = document.createElement('input');
    inputRole.classList.add('btn-field');
    inputRole.setAttribute('value',clickedDivEle.children[2].innerText);

    let reviewButton = document.createElement('button');
    reviewButton.classList.add('btn-field');
    reviewButton.innerText = clickedDivEle.children[3].innerText;

    let doneButton = document.createElement('button');
    doneButton.classList.add('btn-field');
    doneButton.innerText = 'Done';


    //Update data in database
    doneButton.addEventListener('click',()=>{
        let name = inputName.value;
        let email = inputEmail.value;
        let role = inputRole.value;

        let data = {
            'name':name,
            'email':email,
            'is_admin': role==='Admin'?true:false
        }

        fetch(`http://localhost:8000/v1/employees/update/${id}`,{
            'credentials':'include',    
            'method':'PUT',
            'headers':{
               'Content-Type':'application/json' 
            },
            body:JSON.stringify(data)
        }).then((data)=>{
            return data.json();
        }).then((data)=>{
            welcomeAdmin();
        })
    })

    let deleteButton = document.createElement('button');
    deleteButton.classList.add('btn-field');
    deleteButton.innerText = clickedDivEle.children[5].innerText;

    let divEle = document.createElement('div');
    divEle.classList.add('emp');
    divEle.setAttribute('id',id);

    divEle.appendChild(inputName);
    divEle.appendChild(inputEmail);
    divEle.appendChild(inputRole);
    divEle.appendChild(reviewButton);
    divEle.appendChild(doneButton);
    divEle.appendChild(deleteButton);

    let rootEle = document.getElementById('root');
    rootEle.replaceChild(divEle, clickedDivEle);
}

function showReviews(event){
    let id = event.target.parentElement.id;
    fetch(`http://localhost:8000/v1/employees/${id}`,{
        'method':'GET',
        'credentials':'include',
        'headers':{
            'content-type':'application/json'
        },

    }).then((data)=>{
        return data.json();
    }).then((data)=>{
        let reviewArr = data.allEmp.reviews;
        let id = data.allEmp._id.toString();
        let name = data.allEmp.name;
        let email = data.allEmp.email;

        let nameEle = document.createElement('h3');
        nameEle.innerText = `Name : ${name}`
        let emailEle = document.createElement('h3');
        emailEle.innerText = `Email : ${email}`

        let sectionEle1 = document.createElement('section');
        sectionEle1.appendChild(nameEle);
        sectionEle1.appendChild(emailEle);

        let textAreaEle = document.createElement('textarea');
        textAreaEle.setAttribute('cols','60');
        textAreaEle.setAttribute('rows','4');
        textAreaEle.setAttribute('id', 'input-text-area');
        
        let buttonEle = document.createElement('button');
        buttonEle.innerText = 'Add Review';
        buttonEle.addEventListener('click',(event)=> addReview(event, id));

        let sectionEle2 = document.createElement('section');
        sectionEle2.classList.add('right-review-section');
        sectionEle2.appendChild(textAreaEle);
        sectionEle2.appendChild(buttonEle);

        let inputContainerDiv = document.createElement('div');
        inputContainerDiv.classList.add('review-input');

        inputContainerDiv.appendChild(sectionEle1);
        inputContainerDiv.appendChild(sectionEle2);

        let rootEle = document.getElementById('root');
        rootEle.innerHTML = '';
        rootEle.appendChild(inputContainerDiv);

        //show all reviews of employee
        const revewsArr = data.allEmp.reviews;
        for(let review of revewsArr){
            let reviewEle = document.createElement('p');
            reviewEle.innerText = review.message;

            let authorEle = document.createElement('p');
            authorEle.classList.add('auther');
            fetch(`http://localhost:8000/v1/employees/${review.review_by.toString()}`,{
                'credentials':'include'
            }).then((data)=>{
                return data.json();
            }).then((data)=>{
                authorEle.innerText =`Review By : ${data.allEmp.name}`;
            })
            //authorEle.innerText =`Review By : ${reviewrName}`;
            authorEle.classList.add('auther');

            let divEle = document.createElement('div');
            divEle.classList.add('reviews');
            divEle.setAttribute('id',review._id.toString());

            divEle.appendChild(reviewEle);
            divEle.appendChild(authorEle);

            let btnEle = document.createElement('button');
            btnEle.addEventListener('click',(event)=>deleteReview(event, review._id.toString()));
            btnEle.innerText = 'Delete';

            divEle.appendChild(btnEle);

            let reviewContainer = document.getElementById('reviews-container');
            reviewContainer.appendChild(divEle);
        }
    })
}

function addReview(event, empId){
    //console.log(`addReview: ${loggedInData}`);
    //push review into data base
    let textInputAreaEle = document.getElementById('input-text-area');
    let text = textInputAreaEle.value;
    let data = {
        'message':text,
        'review_for':empId
    }
    fetch(`http://localhost:8000/v1/reviews/add`,{
        'method':'POST',
        'credentials':'include',
        'headers':{
            'content-type':'application/json'
        },
        'body':JSON.stringify(data)
    }).then((data)=>{
        return data.json();
    }).then(data=>{
       // console.log(data);
        //show review in ui
        let reviewEle = document.createElement('p');
        reviewEle.innerText = data.review.message;

        let authorEle = document.createElement('p');
        authorEle.classList.add('auther');
        authorEle.innerText =`Written By : ${data.review.review_by.name}`;
        authorEle.classList.add('auther');

        let divEle = document.createElement('div');
        divEle.classList.add('reviews');
        divEle.setAttribute('id',data.review._id.toString());

        divEle.appendChild(reviewEle);
        divEle.appendChild(authorEle);

        let btnEle = document.createElement('button');
        btnEle.addEventListener('click',(event)=>deleteReview(event, data.review._id.toString()));
        btnEle.innerText = 'Delete';

        divEle.appendChild(btnEle);

        let reviewContainer = document.getElementById('reviews-container');

        reviewContainer.appendChild(divEle);
    })
    
}

function deleteReview(event, id){
    fetch(`http://localhost:8000/v1/reviews/delete/${id}`,{
        'method':'DELETE',
        'credentials':'include',
        'headers':{
            'content-type':'application/json'
        }
    }).then((data)=>{
        return data.json();
    }).then((data)=>{
        console.log(data);
        if(data.status_code===204){
            let reviewContainerEle = document.getElementById('reviews-container');
            console.log(reviewContainerEle);
            let deletedChildEle = document.getElementById(id);
            console.log(deletedChildEle);
            reviewContainerEle.removeChild(deletedChildEle);
        }
    })
}