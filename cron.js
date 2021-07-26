const cron = require('node-cron');
const date = require('date-and-time');
const now = new Date();
const Medicine = require('./models/medicine');
var BulkMailer = require("./bulkmailer");


function  prepareEmail(email,username,medname,quantity,unit,time)
{
    return `${email}#Hey ${username} <br><br> It's time for you to take ${quantity} ${unit} of your medicine ${medname} at ${time}`;
}


var options = {
    transport: {
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
    }
    },
    verbose: true
};
var bulkMailer = new BulkMailer(options)


let batch = [];
var task2 = cron.schedule('* * * * *', async () => {

    //When your server is using IST Time
    // let time = date.format(new Date(),'hh:mm A [GMT]Z').toString().slice(0,8);

    //When your server is using UTC Time
    let time = date.format(date.addMinutes(date.addHours(new Date(),5),30),'hh:mm A [GMT]Z').toString().slice(0,8);

    let day = date.format(new Date(), 'ddd');
    console.log(time);
    console.log(day);
    let med = await Medicine.find({notification:true}).populate('userid','-password');
    var to = '';
    med.forEach( obj => {
        if(obj.frequency === 'everyday' || (obj.frequency === 'once' && obj.onceday === day) || (obj.frequency === 'custom' && obj.weekdays.includes(day.toLocaleLowerCase())))
        {

            if(obj.morning === 'true' && obj.morningtime == time)
            {

                if(to!='') to=to+','+prepareEmail(obj.userid.email,obj.userid.name,obj.name,obj.quantity,obj.unit,obj.morningtime);
                else to+=prepareEmail(obj.userid.email,obj.userid.name,obj.name,obj.quantity,obj.unit,obj.morningtime);
                // batch.push({email:obj.userid.email,username:obj.userid.name,name:obj.name,quantity:obj.quantity,unit:obj.unit,time:obj.morningtime});
            }

            if(obj.noon === 'true' && obj.noontime == time)
            {
                if(to!='') to=to+','+prepareEmail(obj.userid.email,obj.userid.name,obj.name,obj.quantity,obj.unit,obj.noontime);
                else to+=prepareEmail(obj.userid.email,obj.userid.name,obj.name,obj.quantity,obj.unit,obj.noontime);
                // batch.push({email:obj.userid.email,username:obj.userid.name,name:obj.name,quantity:obj.quantity,unit:obj.unit,time:obj.noontime});
            }

            if(obj.evening === 'true' && obj.eveningtime == time)
            {
                if(to!='') to=to+','+prepareEmail(obj.userid.email,obj.userid.name,obj.name,obj.quantity,obj.unit,obj.eveningtime);
                else to+=prepareEmail(obj.userid.email,obj.userid.name,obj.name,obj.quantity,obj.unit,obj.eveningtime);
                // batch.push({email:obj.userid.email,username:obj.userid.name,name:obj.name,quantity:obj.quantity,unit:obj.unit,time:obj.eveningtime});
            }
            if(obj.night === 'true' && obj.nighttime == time)
            {
                if(to!='') to=to+','+prepareEmail(obj.userid.email,obj.userid.name,obj.name,obj.quantity,obj.unit,obj.nighttime);
                else to+=prepareEmail(obj.userid.email,obj.userid.name,obj.name,obj.quantity,obj.unit,obj.nighttime);
                // batch.push({email:obj.userid.email,username:obj.userid.name,name:obj.name,quantity:obj.quantity,unit:obj.unit,time:obj.nighttime});
            }

            // console.log('Everyday');
            // console.log(batch);
        }
    });



if(to!='')
{
    var mailOptions = {
        from: process.env.EMAIL,
        to,
        subject: 'Medicine Reminder',
        html: ''
    }
    bulkMailer.send(mailOptions, true, function (error, result) { // arg1: mailinfo, agr2: parallel mails, arg3: callback
        if (error) {
            console.error(error);
        } else {
            console.info(result);
        }
    });
}
  });
  
  task2.start();