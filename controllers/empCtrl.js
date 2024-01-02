const empModel = require('../models/employee');
const reviewModel = require('../models/review');
module.exports.register =async (req, res)=>{
    const {email, name, password} = req.body;
    //check if user already exists or not
    const userFound = await empModel.findOne({'email':email});
    let savedUser;
    if(userFound==null){
        //push user in database
        savedUser = await empModel.create({
            'email': email,
            'name': name,
            'password': password
        })
    }else{
        //return response, user already exists
        res.status(200);
        res.json({
            'status_code':409,
            'message': 'User already registered',
            'user': userFound
        });
        return res;
    }
    res.status(201);
        res.json({
            'status_code':201,
            'message': 'User has been registered successfully',
            'user': savedUser
        });
    return res;
}

module.exports.login = async (req, res) =>{
    const {email, password} = req.body;
    //check if user exists before login
    const userFound = await empModel.findOne({'email':email});
    if(userFound==null){
        res.json({
            'status_code':404,
            'message': "User not found in database"
        })
        return res;
    }

    if(password===userFound.password){
        //user logged in successfully
        res.cookie('emp_id', userFound._id.toString()),{
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        };
        res.json({
            'status_code':200,
            'message':'User logged in successfully',
            'user': userFound
        });
        return res;
    }else{
        //password is not correct
        res.json({
            'status_code':409,
            'message':'Enter the correct password'
        });
        return res;
    }
}

module.exports.logout = async (req, res)=>{
        res.cookie('emp_id', '-1');
        res.json({
            'status_code':200,
            'message': 'You have logged out successfully.'
        });
        return res;
}

module.exports.employees = async (req, res)=>{
    const coockie = req.cookies.emp_id;
    const loggedInUser = await empModel.findById(coockie);
    if(loggedInUser==null){
        res.json({
            'message': 'User is not logged in',
            'status_code': 403
        })
        return res;
    }
    //fetch all employees from database
    const empList =await empModel.find().populate('reviews');
    res.status(200);
    res.json({
        'message': 'Employees fetched successfully',
        'allEmp':empList
    })
    return res;
}

module.exports.employee = async (req, res)=>{
    const coockie = req.cookies.emp_id;
    const loggedInUser = await empModel.findById(coockie);
    if(loggedInUser==null){
        res.json({
            'message': 'User is not logged in',
            'status_code': 403
        })
        return res;
    }
    //fetch employee by his id from database
    let id = req.params.id;
    const empObject =await empModel.findById(id).populate('reviews');
    res.status(200);
    res.json({
        'message': 'Employee fetched successfully',
        'employee':empObject
    })
    return res;
}

module.exports.delete = async (req, res)=>{
    const coockie = req.cookies.emp_id;
    const loggedInUser = await empModel.findById(coockie);
    if(loggedInUser==null){
        res.json({
            'message': 'User is not logged in',
            'status_code': 403
        })
        return res;
    }

    //get id from url paramaters
    const empId = req.params.id;
    const empObj = await empModel.findByIdAndDelete(empId);
    //if employee has been deleted, delete all the reviews made by him from reviews collection
    if(empObj!=null){
        const reviewsIdArray = empObj.reviews;
        for(reviewId of reviewsIdArray){
            await reviewModel.findByIdAndDelete(reviewId);
        }
    }
    res.json({
        'status_code':204,
        "id":empId,
        "user": empObj
    })
    return res;
}

module.exports.update = async(req, res)=>{
    const coockie = req.cookies.emp_id;
    const loggedInUser = await empModel.findById(coockie);
    if(loggedInUser==null){
        res.json({
            'message': 'User is not logged in',
            'status_code': 403
        })
        return res;
    }
    //get id from url paramaters
    const empId = req.params.id;
    const {password, name, is_admin} = req.body;
    let data = {};
    if(password!=null){
        data.password = password;
    }
    if(name!=null){
        data.name = name;
    }
    if(is_admin!=null){
        data.is_admin = is_admin;
    }
    const userData = await empModel.findByIdAndUpdate(empId, data);
    res.status(201);
    res.json({
        "message":"Employee updated successfully",
        "user": userData
    })
    return res;
}

module.exports.whoAmI = async(req, res)=>{
    const coockie = req.cookies.emp_id;
    if(coockie == -1 || coockie == '-1' || coockie == null || coockie == undefined){
        res.json({
            'status_code': 403,
            'message': 'User is not logged in'
        })
        return res;
    }
    const loggedInUser = await empModel.findById(coockie);  
        res.json({
            'status_code':200,
            'user':loggedInUser
        })
        return res;
}

//id passed in url will be id of the employee whose review is happening
//and id passed in payload ie body will be id of the employee who is being made a participant
module.exports.addReviewParticipant = async (req, res)=>{

    const userId = req.headers.cookie?.split('=')[1];
    if(userId == null || userId == undefined || userId == -1){
        res.json({
            'status_code':403,
            "message":"Please Login first"
        });
        return res;
    }

    const empObj =await empModel.findById(userId);
    if(empObj.is_admin == false){
        res.json({
            'status_code':401,
            "message":"Only admin is allowed to add Reviewer"
        });
        return res;
    }

    let revieweeId = req.body.id;
    let reviewerEmail = req.body.email;
    
    let reviewerEmployee = await empModel.findOne({'email':reviewerEmail});
    reviewerEmployee.reviewer_for.push(revieweeId);
    await reviewerEmployee.save();
    
    res.json({
        'status_code':201,
        'message':'Reviewer added successfully'
    });
}

//id passed in url will be id of the employee whose review is happening
//and id passed in payload ie body will be id of the employee who is being made a participant
module.exports.removeReviewParticipant = async (req, res)=>{
    const coockie = req.cookies.emp_id;
    const loggedInUser = await empModel.findById(coockie);
    if(loggedInUser==null){
        res.json({
            'message': 'User is not logged in',
            'status_code': 403
        })
        return res;
    }
    const userId = req.headers.cookie?.split('=')[1];
    if(userId == null || userId == undefined || userId == -1){
        res.status(403);
        res.json({
            "message":"Please Login first"
        });
        return res;
    }

    const empObj =await empModel.findById(userId);
    if(empObj.is_admin == false){
        res.status(403);
        res.json({
            "message":"Only admin is allowed to add participantes"
        });
        return res;
    }

    const revieweeId = req.params.id;
    const {participant} = req.body;
    
    const emp = await empModel.findById(revieweeId);
    
    //remove participant from reviewer_for array
    let i=0;
    for(let savedParticipant of emp.reviewer_for){
        if(savedParticipant == participant){
            emp.reviewer_for.splice(i, 1);
            break;
        }
    }
    await emp.save();

    return res.json({
        "message": "participant has been added successfully"
    })
}
