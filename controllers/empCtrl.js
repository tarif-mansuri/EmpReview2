const empModel = require('../models/employee');
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
            'message': 'User already registered',
            'user': userFound
        });
        return res;
    }
    res.status(201);
        res.json({
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
        res.status(404);
        res.json({
            'message': "User not found in database"
        })
        return res;
    }

    if(password===userFound.password){
        //user logged in successfully
        res.cookie('emp_id', userFound._id.toString());
        res.status(200);
        res.json({
            'message':'User logged in successfully'
        });
        return res;
    }else{
        //password is not correct
        res.status(400);
        res.json({
            'message':'Enter the correct password'
        });
        return res;
    }
}

module.exports.logout = async (req, res)=>{
    res.cookie('emp_id', '-1');
        res.status(200);
        res.json({
            message: 'Logged out successfully'
        });
        return res;
}

module.exports.employees = async (req, res)=>{
    //fetch all employees from database
    const empList =await empModel.find().populate('review');

    res.status(200);
    res.json({
        'message': 'Employees fetched successfully',
        'allEmp':empList
    })
    return res;
}

module.exports.delete = async (req, res)=>{
    //get id from url paramaters
    const empId = req.params.id;
    const user = await empModel.findByIdAndDelete(empId);
    res.json({
        "id":empId,
        "user": user
    })
    return res;
}

module.exports.update = async(req, res)=>{
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
    const savedUser = await empModel.findByIdAndUpdate(empId, data);
    res.status(201);
    res.json({
        "message":"Employee updated successfully",
        "user": savedUser
    })
    return res;
} 
