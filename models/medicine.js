const mongoose = require('mongoose');


const MedicineScheme = mongoose.Schema({
    
    userid:{
        type:String,
        ref:'User',
        required:true
    },
    name:{
        type:String,
        required:true
    },
    quantity:{
        type:String,
        default:'1'
    },
    unit:{
        type:String,
        default:'Piece'
    },
    frequency:{
        type:String,
        default:'Frequency'
    },
    onceday:{
        type:String,
        default:''
    },
    morning:{
        type:String,
        default:'false'
    },
    morningtime:{
        type:String,
    },
    noon:{
        type:String,
        default:'false'
    },
    noontime:{
        type:String,
    },
    evening:{
        type:String,
        default:'false'
    },
    eveningtime:{
        type:String,
    },
    night:{
        type:String,
        default:'false'
    },
    nighttime:{
        type:String,
    },
    weekdays:{
        type:Array,
        default:[]
    },
    notification:{
        type:Boolean,
        default:true
    }
    
},{timestamps:true});


module.exports = mongoose.model('Medicine',MedicineScheme);