const mongoose = require('mongoose');

/*
const User = new mongoose.Schema({
      username: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      firstname: {
        type: String,
        required: true
      },
      middleName: {
        type: String
  
      },
      lastname: {
        type: String,
        required: true
      },
      birthday: {
        type: Date,
        required: false
      },
      passwordHash: {
        type: String
      },
      medicalCondition: {
        type: String,
        default: null
      },
      doctorsPhone: {
        type: Number
      },
      pPhone: {
        type: Number
      },
      bloodType: {
        type: String,
        enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'],
        required: true
      },
      sex: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
      },
      organDonor: {
        type: Boolean,
        defaultValue:null, 
      },
      _id_: {
        type: Number,
        default: null
      }

});

module.exports = mongoose.model('user', User)
*/

const User = new mongoose.Schema({
  user_id: {
    type: Number,
    default: null
  }, 
  username: {
    type: String
  },
  email: {
    type: String,
  },
  surname: {
    type: String,
  },
  name: {
    type: String,
  },
  middleName: {
    type: String

  },
  sexid: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
    
  },
  amka: {
    type: String,
    required: true
  },
  photo: {
    type: String,
  },
  birth: {
    type: Date,
    required: true    
  },
  address: {
    type: String

  },
  phone: {
    type: Number

  },
  emergencyPhone: {
    type: Number

  },
  doctorsPhone: {
    type: Number
  },
  medicalCondition: {
    type: String
  },
  bloodType: {
    type: String,
    enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'],
    required: true
  },
  medication: {
    type: String
  },
  allergies: {
    type: String
    
  },
  organDonor: {
    type: String
  }, 
  password: {
    type: String
  }
},
)

module.exports = mongoose.model('user', User)
