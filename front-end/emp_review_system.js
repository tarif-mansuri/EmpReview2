
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
            }else {
                let loginBtn = document.getElementById('login');
                loginBtn.style.visibility = 'hidden';
                let registerBtn = document.getElementById('register');
                registerBtn.style.visibility = 'hidden';

                let logOutBtn = document.getElementById('logout');
                logOutBtn.style.visibility = 'visible';

                if(data.user.is_admin === true){
                    //User is an admin
                    welcomeAdmin();
                }else{
                    //User is an employee
                    welcomEmployee(data.user, false);
                }
            }
        })
    })

})

let logOutButton = document.getElementById('logout');

logOutButton.addEventListener('click',()=>{
    fetch(`http://localhost:8000/v1/employees/logout`,{
        'method':'GET',
        'credentials':'include',
        'headers':{
            'content-type':'application/json'
        },

    }).then(data=>{
        return data.json();
    }).then(data=>{
        let loginBtn = document.getElementById('login');
        loginBtn.style.visibility = 'visible';
        let registerBtn = document.getElementById('register');
        registerBtn.style.visibility = 'visible';

        let logOutBtn = document.getElementById('logout');
        logOutBtn.style.visibility = 'hidden';

        let h3Ele = document.createElement('h3');
        h3Ele.innerText = data.message;
        let rootEle = document.getElementById('root');
        rootEle.innerHTML = '';
        let reviewContainerDiv = document.getElementById('reviews-container');
        reviewContainerDiv.innerHTML = '';
        rootEle.appendChild(h3Ele);
        //window.alert(data.message);
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
            showEmployeeUtil(empObj, true);
        }
    }))
}

function showEmployeeUtil(empObj, isAdmin){

    let rootEle = document.getElementById('root');
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

    let divEle = document.createElement('div');
    divEle.classList.add('emp');

    divEle.setAttribute('id',empObj._id.toString());

    divEle.appendChild(nameEle);
    divEle.appendChild(emailEle);
    divEle.appendChild(roleEle);
    divEle.appendChild(reviewButton);
    if(isAdmin === true){
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
        divEle.appendChild(updateButton);
        divEle.appendChild(deleteButton);
    }
    rootEle.appendChild(divEle);   
}

//Welcome Employee function starts here
function welcomEmployee(empObj){
            //1.fetch employee's own data, and show in UI + fetch data of all those employees whom he can review
            //2.Employee can see all those employees for whome he has been made a reviewer
            //working
            showEmployeeUtil(empObj);
            let reviewerFor = empObj.reviewer_for;
            for(let empId of reviewerFor){
                console.log(empId);
                fetch(`http://localhost:8000/v1/employees/${empId}`,{
                    'method':'GET',
                    'headers':{
                        'content-type':'application/json'
                    },
                    'credentials':'include',
                }).then(
                    data=>{
                        return data.json();
                    }
                ).then(
                    response=>{
                        empObj = response.employee;
                        showEmployeeUtil(empObj, false);
                    }
                )
            }
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
    let emp_id = event.target.parentElement.id;
    fetch(`http://localhost:8000/v1/employees/${emp_id}`,{
        'method':'GET',
        'credentials':'include',
        'headers':{
            'content-type':'application/json'
        },

    }).then((data)=>{
        return data.json();
    }).then((data)=>{
        //call whoami
        fetch(`http://localhost:8000/v1/employees/whoami`,{
            'method':'GET',
            'credentials':'include',
            'headers':{
                'content-type':'application/json'
            },
        }).then(
            (wmiData)=>{
                return wmiData.json();
            }
        ).then(
            (wmiResp)=>{
                if(wmiResp.user._id.toString() == emp_id){
                    let reviewArr = data.employee.reviews;
                    let id = data.employee._id.toString();
                    let name = data.employee.name;
                    let email = data.employee.email;

                    let nameEle = document.createElement('h3');
                    nameEle.innerText = `Name : ${name}`
                    let emailEle = document.createElement('h3');
                    emailEle.innerText = `Email : ${email}`

                    let sectionEle1 = document.createElement('section');
                    sectionEle1.appendChild(nameEle);
                    sectionEle1.appendChild(emailEle);

                    let rootEle = document.getElementById('root');
                    rootEle.innerHTML = '';
                    //show all reviews of employee
                    const revewsArr = data.employee.reviews;
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
                            authorEle.innerText =`Review By : ${data.employee.name}`;
                        })
                        //authorEle.innerText =`Review By : ${reviewrName}`;
                        authorEle.classList.add('auther');

                        let divEle = document.createElement('div');
                        divEle.classList.add('reviews');
                        divEle.setAttribute('id',review._id.toString());

                        divEle.appendChild(reviewEle);
                        divEle.appendChild(authorEle);

                        let feedbackMessage = review?.feedback ? review.feedback: null;

                        if(feedbackMessage == null){
                            let feedbackBtnEle = document.createElement('button');
                            feedbackBtnEle.addEventListener('click',()=>addFeedback(review._id.toString()));
                            feedbackBtnEle.innerText = 'Add Feedback';
                            divEle.appendChild(feedbackBtnEle);
                        }else{
                            let h4Ele = document.createElement('h4');
                            h4Ele.innerText = "Employee's Feedback";
                            divEle.appendChild(h4Ele);
                            let pEle = document.createElement('p');
                            pEle.innerText = feedbackMessage;
                            divEle.appendChild(pEle);
                        }
                        let reviewContainer = document.getElementById('reviews-container');
                        reviewContainer.appendChild(divEle);
                    }
                }else{
                    let reviewArr = data.employee.reviews;
                    let id = data.employee._id.toString();
                    let name = data.employee.name;
                    let email = data.employee.email;

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

                    //input field for adding reviewer
                    let reveInputEle = document.createElement('input');
                    reveInputEle.setAttribute('placeholder', 'Enter reviewer email');
                    reveInputEle.setAttribute('type', 'email');
                    reveInputEle.id = 'reviewer-input';

                    //Add reviewer button
                    let reveButtonEle = document.createElement('button');
                    reveButtonEle.innerText = 'Add Reviewer';
                    reveButtonEle.addEventListener('click',(event)=> addReviewer(id));

                    let sectionEle2 = document.createElement('section');
                    sectionEle2.classList.add('right-review-section');
                    sectionEle2.appendChild(textAreaEle);
                    sectionEle2.appendChild(buttonEle);
                    sectionEle2.appendChild(reveInputEle);
                    sectionEle2.appendChild(reveButtonEle);

                    let inputContainerDiv = document.createElement('div');
                    inputContainerDiv.classList.add('review-input');

                    inputContainerDiv.appendChild(sectionEle1);
                    inputContainerDiv.appendChild(sectionEle2);

                    let rootEle = document.getElementById('root');
                    rootEle.innerHTML = '';
                    rootEle.appendChild(inputContainerDiv);

                    //show all reviews of employee
                    const revewsArr = data.employee.reviews;
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
                            authorEle.innerText =`Review By : ${data.employee.name}`;
                        })
                        //authorEle.innerText =`Review By : ${reviewrName}`;
                        authorEle.classList.add('auther');

                        let divEle = document.createElement('div');
                        divEle.classList.add('reviews');
                        divEle.setAttribute('id',review._id.toString());

                        divEle.appendChild(reviewEle);
                        divEle.appendChild(authorEle);

                        //showing feedback
                        let feedbackMessage = review?.feedback ? review.feedback: null;

                        if(feedbackMessage != null){
                            let h4Ele = document.createElement('h4');
                            h4Ele.innerText = "Employee's Feedback";
                            divEle.appendChild(h4Ele);
                            let pEle = document.createElement('p');
                            pEle.innerText = feedbackMessage;
                            divEle.appendChild(pEle);
                        }
                        //Delete Button
                        let btnEle = document.createElement('button');
                        btnEle.addEventListener('click',(event)=>deleteReview(event, review._id.toString()));
                        btnEle.innerText = 'Delete';

                        //Update Button
                        //Update Button
                        let updateBtnEle = document.createElement('button');
                        updateBtnEle.addEventListener('click',()=>updateReview(review._id.toString()));
                        updateBtnEle.innerText = 'Update';

                        divEle.appendChild(btnEle);
                        divEle.appendChild(updateBtnEle);

                        let reviewContainer = document.getElementById('reviews-container');
                        reviewContainer.appendChild(divEle);
                    }
                }
            }
        )
    })
}

function addReview(event, empId){
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
        //show review in ui
        let reviewEle = document.createElement('p');
        reviewEle.innerText = data.review.message;

        let authorEle = document.createElement('p');
        authorEle.classList.add('auther');        
        fetch(`http://localhost:8000/v1/employees/${data.review.review_by.toString()}`,{
            'method':'GET',
            'credentials':'include'
            }).then((data)=>{
                return data.json();
            }).then((data)=>{
                authorEle.innerText =`Review By : ${data.employee.name}`;
            })
        authorEle.classList.add('auther');

        let divEle = document.createElement('div');
        divEle.classList.add('reviews');
        divEle.setAttribute('id',data.review._id.toString());

        divEle.appendChild(reviewEle);
        divEle.appendChild(authorEle);

        //Delete Button
        let btnEle = document.createElement('button');
        btnEle.addEventListener('click',(event)=>deleteReview(event, data.review._id.toString()));
        btnEle.innerText = 'Delete';

        //Update Button
        let updateBtnEle = document.createElement('button');
        updateBtnEle.addEventListener('click',()=>updateReview(data.review._id.toString()));
        updateBtnEle.innerText = 'Update';

        divEle.appendChild(btnEle);
        divEle.appendChild(updateBtnEle);

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
        if(data.status_code===204){
            let reviewContainerEle = document.getElementById('reviews-container');
            let deletedChildEle = document.getElementById(id);
            reviewContainerEle.removeChild(deletedChildEle);
        }
    })
}

function addReviewer(id){
    let inputEle = document.getElementById('reviewer-input');
    let email = inputEle.value;
    let requestData = {
        'id':id,
        'email':email
    }
    fetch(`http://localhost:8000/v1/employees/addreviwer`,{
        'method':'PUT',
        'credentials':'include',
        'headers':{
            'content-type':'application/json'
        },
        'body':JSON.stringify(requestData)
    }).then(data=>{
        return data.json();
    }).then(data=>{

    })

}

function updateReview(id){
    let reviewDiv = document.getElementById(id);
   
    let pEle = reviewDiv.firstChild;
    let inputEle = document.createElement('input');
    inputEle.value = pEle.innerText;

    reviewDiv.replaceChild(inputEle, pEle);

    let doneBtn = document.createElement('button');
    doneBtn.innerText = 'Done';

    reviewDiv.replaceChild(doneBtn, reviewDiv.lastChild);

    doneBtn.addEventListener('click', function updateReviewInDB(){
        let updatedMessage = inputEle.value;
        let requestData = {
            'message':updatedMessage
        };
        fetch(`http://localhost:8000/v1/reviews/update/${id}`,{
            'method':'PUT',
            'credentials':"include",
            'headers':{
                'content-type': 'application/json'
            },
            'body':JSON.stringify(requestData)
        }).then(data=>{
            return data.json();
        }).then(data=>{
            let pEple = document.createElement('p');
            pEple.innerText = data.review.message;
            reviewDiv.replaceChild(pEple, inputEle);
        })
    })

}

function addFeedback(id){
    let reviewDiv = document.getElementById(id);
    reviewDiv.removeChild(reviewDiv.lastChild);
    let textAreaEle = document.createElement('textarea');
    textAreaEle.setAttribute('cols','100');
    textAreaEle.setAttribute('rows','5');
    reviewDiv.appendChild(textAreaEle);
    let doneButton = document.createElement('button');
    doneButton.innerText = 'Done';
    reviewDiv.appendChild(doneButton);

    doneButton.addEventListener('click',()=>{
        let feedbackText = textAreaEle.value;
        let requestData = {
            'feedback': feedbackText
        }
        fetch(`http://localhost:8000/v1/reviews/feedback/${id}`,{
            'method':'PUT',
            'credentials':"include",
            'headers':{
                'content-type': 'application/json'
            },
            'body':JSON.stringify(requestData)
        }).then(
            (promiseObj)=>{
                return promiseObj.json();
            }
        ).then((resData)=>{
            reviewDiv.removeChild(reviewDiv.lastChild);
            reviewDiv.removeChild(reviewDiv.lastChild);
            let h4Ele = document.createElement('h4');
            h4Ele.innerText = "Employee's Feedback";
            reviewDiv.appendChild(h4Ele);

            let pEle = document.createElement('p');
            pEle.innerText = resData.review.feedback;
            reviewDiv.appendChild(pEle);
        })
    })

}

function isSeesionActive(){
    fetch(`http://localhost:8000/v1/employees/whoami`,{
        'method':'GET',
        'headers':{
            'content-type':'application/json'
        },
        'credentials':'include'
    }).then(
        promiseObj=>{
            return promiseObj.json();
        }
    ).then(
        responseData=>{
            if(responseData.status_code===200){
                //Hide Login and Register buttons
                let loginBtn = document.getElementById('login');
                loginBtn.style.visibility = 'hidden';

                let registerBtn = document.getElementById('register');
                registerBtn.style.visibility = 'hidden';

                //show Logout button
                let logOutBtn = document.getElementById('logout');
                logOutBtn.style.visibility = 'visible';


                //user is logged in
                if(responseData.user.is_admin===true){
                    welcomeAdmin();
                }else{
                    welcomEmployee(responseData.user);
                }
            }else{
                //user NOT logged in
                let h3Ele = document.createElement('h3');
                h3Ele.innerText = `Welcome to ERS homepage, Please register or login to use ERS Application`;
                let rootEle = document.getElementById('root');
                rootEle.innerHTML = '';
                rootEle.appendChild(h3Ele);

            }
        }
    )
}

isSeesionActive();