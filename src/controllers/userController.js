const userModel = require('../models/userModel')
const { isValidRequestBody, isValidEmail, isValid, isValidPassword, isValidMobile, isValidPlace, isValidPincode } = require('../utils/validation');
const { uploadFile } = require('../aws/aws');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
require('dotenv').config();
const { JWT_SECRET,JWT_EXPIRY } = process.env;



//================================= Register User ================================================//


const signUp = async (req, res) => {
  try {
    let files = req.files;
    let data = req.body;

   

    let { fname, lname, email, phone, password, address } = data;

    if (!isValidRequestBody(data))
      return res.status(400).send({ status: false, message: "Body can't be empty" });

    if (!isValid(fname) || !isValid(lname) || !isValid(email) || !isValid(password) || !isValid(phone) || !isValid(address))
      return res.status(400).send({status: false,message: "Please provide all valid field"});

    if (!isValidEmail(email) || !isValidMobile(phone))
      return res.status(400).send({ status: false, messsage: "Please provide valid email and valid Mobile no." });

    let checkUnique = await userModel.findOne({
        $or:[{ email: email },{ phone: phone }]});

    if (checkUnique) {
      return res.status(400).send({ status: false, message: "This email Id or mobile no.is already in use."});
    }

    if (!isValidPassword(password))
      return res.status(400).send({status: false,messsage:"Please provide valid password,it should contain uppercase,number  and 7-15 length",});

      let hashedPassword = await bcrypt.hash(password, 10);
      data.password = hashedPassword
      
    if (address) {
      if (typeof address != "object") {
        return res.status(400).send({status: false,message: "Value of address must be in json format"});
      }

      if (!isValid(address.shipping) 
            || !isValid(address.shipping.street) 
            || !isValid(address.shipping.city)
            || !isValid(address.shipping.pincode)
            || !isValid(address.billing)
            || !isValid(address.billing.street)
            || !isValid(address.billing.city)
            || !isValid(address.billing.pincode)
            || !isValid(address.billing))
        return res.status(400).send({ status: false, messsage: "Please provide All Shipping field is mandatory" });

      if (!isValidPlace(address.shipping.city) || !isValidPlace(address.billing.city))
        return res.status(400).send({ status: false, messsage: "Please provide city" });

    } else {
      return res.status(400).send({ status: false, messsage: "Please provide address" });
    }

    if (isValid(files)) {
      if (files.length > 1) {
        return res.status(400).send({status: false,message: "You can't enter more than one file for create "});
      }

      let uploadFileURL = await uploadFile(files[0]);
      data.profileImage = uploadFileURL;
    } else {
      return res.status(400).send({ status: false, message: "Profile Image is Mandatory" });
    }
    
    let savedata = await userModel.create(data);

    return res.status(201).send({status: true,message: "User created successfully", data: savedata});
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};



//==================================== Login User ============================================//


const signIn = async (req, res) => {
  try {
    let data = req.body
    //console.log(data)
    
    if (!isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: "Please input user Details" });
    }

    let { email, password } = data;

    if (!isValid(email) || !isValid(password)) {
      return res.status(400).send({ status: false, message: "EmailId is mandatory" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "EmailId should be Valid" });
    }

    const userData = await userModel.findOne({ email: email});
      if (!userData) {
          return res.status(401).send({ status: false, message: "No such user exist. Please Enter a valid Email and Password." });
          }

    let hash = userData.password;

    let isCorrect = bcrypt.compare(password, hash);
    if (!isCorrect)
      return res.status(400).send({ status: false, message: "Password is incorrect" });
      const token = jwt.sign({userId: userData._id.toString()}, JWT_SECRET,{
        expiresIn : JWT_EXPIRY
    })

    res.setHeader("x-api-key", token);
    return res.status(200).send({status: true,message: "User login successfull", data: {token}});
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


//======================================== Get User ==========================================//


const getUser = async (req, res) =>{
  try {
    let userId = req.params.userId;

    if (!isValidObjectId(userId))
      return res.status(400).send({ status: false, message: "User is invalid" });

    let getData = await userModel.findOne({ _id: userId });

    if (!getData)
      return res.status(404).send({ status: false, message: "user not found" });
      
    return res.status(200).send({ status: true, message: "User profile details", data: getData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//======================================== Update User ==========================================//

const modifyUser = async (req, res) => {
  try {
    let userId = req.params.userId;

    if (!isValidObjectId(userId))
      return res.status(400).send({ status: false, message: "User Id is invalid." });

    let checkUser = await userModel.findOne({ _id: userId });
    if (!checkUser)
      return res.status(404).send({ status: false, message: "User Id not found." });

    let data = req.body;
    let files = req.files;

    if (!isValidRequestBody(data))
      return res.status(400).send({ status: false, message: "At least one field is mendatory." });

    let { fname, lname, email, phone, password, address } = data;

    let updatedData = {};

    if (fname) {
      if (!isValid(fname)) {
        return res.status(400).send({ status: false, message: "First name must be string." });
      }
      updatedData.fname = fname;
    }

    if (lname) {
      if (!isValid(lname)) {
        return res.status(400).send({ status: false, message: "Last name must be string." });
      }
      updatedData.lname = lname;
    }

    if (email) {
      if (!isValidEmail(email) || isValid(email)) {
        return res.status(400).send({ status: false, message: "Email id must be proper syntax." });
      }

      let checkEmailId = await userModel.findOne({ email: email });

      if (checkEmailId) {
        return res.status(400).send({status: false,message:"This Email id is already used ,Please provide another Email Id."});
      }
      updatedData.email = email;
    }
    if (phone) {
      if (!isValidMobile(phone)) {
        return res.status(400).send({status: false,message: "Mobile number must be Indian format."});
      }
      let checkphone = await userModel.findOne({ phone: phone });
      if (checkphone) {
        return res.status(400).send({status: false,message:"This phone number is already used ,Please provide another phone number."});
      }
      phone = phone.trim();
      updatedData.phone = phone;
    }
    if (password) {
      if (!isValidPassword(password) || !isValid(password)) {
        return res.status(400).send({ status: false, messsage: "Please provide valid password." });
      }
      let hashing = bcrypt.hashSync("password", 8);
      updatedData.password = hashing;
    }
    if (address) {
      address = JSON.parse(data.address);

      if (typeof address != "object") {
        return res.status(400).send({ status: false, message: "Address must be Object." });
      }

      let { shipping, billing } = address;
      if (shipping) {
        if (typeof shipping != "object") {
          return res.status(400).send({ status: false, message: "Shipping  must be Object." });
        }

        let { street, city, pincode } = shipping;
        if (street) {
          if (!isValid(street)) {
            return res.status(400).send({ status: false, message: "Street  can not be empty." });
          }
        }
        if (city) {
          if (!isValid(city)) {
            return res.status(400).send({ status: false, message: "Please enter valid city." });
          }
        }
        if (pincode) {
          if (!isValidPincode(pincode)) {
            return res.status(400).send({status: false,message: "Pincode must be in numbers only."});
          }
        }
      }
      if (billing) {
        if (typeof billing != "object") {
          return res.status(400).send({ status: false, message: "Billing  must be Otring." });
        }

        let { street, city, pincode } = billing;
        if (street) {
          if (!isValid(street)) {
            return res.status(400).send({ status: false, message: "Street  can not be empty." });
          }
        }
        if (city) {
          if (!isValidPlace(city)) {
            return res.status(400).send({ status: false, message: "Please enter valid city." });
          }
        }
        if (pincode) {
          if (!isValidPincode(pincode)) {
            return res.status(400).send({status: false,message: "Pincode must be in numbers only."});
          }
        }
      }
      updatedData.address = address;
    }

    if (files && files.length > 0) {
      let uploadFileURL = await uploadFile(files[0]);

      updatedData.profileImage = uploadFileURL;
    }

    let updateUserData = await userModel.findOneAndUpdate(
      { _id: userId },
      updatedData,
      { new: true }
    );

    return res.status(200).send({status: true,message: "User profile updated",data: updateUserData});
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = { signUp,signIn,getUser,modifyUser };