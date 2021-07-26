const Medicine = require('../models/medicine');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');

function convertTime24to12(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    
    if (time.length > 1) { // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }

    if(time[0].toString().length == 1){
        time[0]= '0' +time[0];
    } 
 
    return time.join(''); // return adjusted time or original string
  }

function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
  
    let [hours, minutes] = time.split(':');
  
    if (hours === '12') {
      hours = '00';
    }
  
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
  
    return `${hours}:${minutes}`;
  }

function processSingleMedicine(medicine)
{
    let med = {
          
        time:[]
    };

    med._id=medicine._id.toString();
    med.name= medicine.name;
    med.quantity= medicine.quantity;
    med.unit=medicine.unit;
    med.frequency = medicine.frequency;
    med.onceday = medicine.onceday;
    med.notification=medicine.notification;   
    med.morning=medicine.morning;
    med.morningtime=convertTime12to24(medicine.morningtime);
    med.noon=medicine.noon;
    med.noontime=convertTime12to24(medicine.noontime);
    med.evening=medicine.evening;
    med.eveningtime=convertTime12to24(medicine.eveningtime);    
    med.night=medicine.night;
    med.nighttime=convertTime12to24(medicine.nighttime);

    // medicine.weekdays.forEach( el => med[Object.keys(el)[0]]=true);
    medicine.weekdays.forEach( el => med[el]=true);
     
    
    
    return med;
}
function processMedicine(meds)
{

    let medicines = [];
    meds.forEach(obj => {

        let med = {
          
            time:[]
        };

        med._id=obj._id;
        med.name= obj.name;
        med.unit= obj.quantity +' '+ obj.unit;
        med.frequency = obj.frequency;
        med.notification=obj.notification;
       
        if(obj.morning === 'true') med.time.push({time:obj.morningtime.substring(0,5),format:obj.morningtime.substring(5)});
        if(obj.noon === 'true') med.time.push({time:obj.noontime.substring(0,5),format:obj.noontime.substring(5)});
        if(obj.evening === 'true') med.time.push({time:obj.eveningtime.substring(0,5),format:obj.eveningtime.substring(5)});
        if(obj.night === 'true') med.time.push({time:obj.nighttime.substring(0,5),format:obj.nighttime.substring(5)});
        
        medicines.push(med);
    });
    return medicines;
}
function medController()
{


    return {

        async showMedicine(req,res)
        {

            
            let meds = await Medicine.find({userid:req.user._id});

            

            
            
            // console.log(meds);
            res.render('home',{data:processMedicine(meds)});
        },
        async searchMedicine(req,res,next){


            let meds;

            let {options,search} = req.body;


            if(options!=null || options!=undefined || options!='' || search!=undefined || search!=null || search!="")
            {
                search=search.toLowerCase();
              
                let userPattern = new RegExp("^"+req.body.search.toLowerCase());

                if(options==='name'){
                
                    meds = await Medicine.find({
                        $and:[
                            {userid:req.user._id},
                            {name:{$regex:userPattern}}
                        ]
                    });
                }
                    
                else if(options==='frequency')
                meds = await Medicine.find({
                    $and:[
                        {userid:req.user._id},
                        {frequency:{$regex:userPattern}}
                    ]
                });

     
                res.send(processMedicine(meds));
                
            }


          
        },
        async addMedicine(req,res)
        {

        
            const {name,quantity,unit,other_unit,frequency,onceday,morning,evening,noon,night,morningtime,noontime,eveningtime,nighttime,notification,week_mon,week_tue,week_wed,week_thu,week_fri,week_sat,week_sun} = req.body;
         
            if(!name || !quantity)
            {
                req.flash('error','All fields are required');
               
                return res.redirect('/');      
            }

           
            if(!morning && !noon && !evening && !night)
            {
                req.flash('error','Please select timings of medicine');
               
                return res.redirect('/');  
            }


           
             
                const medSchema = new Medicine({
                    name:name.toLowerCase(),
                    quantity,
                    userid:req.user._id,
                    unit: unit==='other'?other_unit:unit,
                    frequency,
                    onceday,
                    morning:morning,
                    morningtime:convertTime24to12(morningtime),
                    noon:noon,
                    noontime:convertTime24to12(noontime),
                    evening:evening,
                    eveningtime:convertTime24to12(eveningtime),
                    night:night,
                    nighttime:convertTime24to12(nighttime),
                    notification:notification ==='on'?'true':'false',
                    weekdays:[]
                });
    
                if(week_mon)    medSchema.weekdays.push("mon");
    
                if(week_tue)    medSchema.weekdays.push("tue");
    
                if(week_wed)    medSchema.weekdays.push("wed");
    
                if(week_thu)    medSchema.weekdays.push("thu");
    
                if(week_fri)    medSchema.weekdays.push("fri");
    
                if(week_sat)    medSchema.weekdays.push("sat");
    
                if(week_sun)    medSchema.weekdays.push("sun");
               
    
            
    
            
                const data = await medSchema.save();
                
    
               
            

            
            return res.redirect('/');
            
        },
        async updateMedicine(req,res)
        {
            const {name,quantity,unit,frequency,onceday,morning,evening,noon,night,morningtime,noontime,eveningtime,nighttime,notification,week_mon,week_tue,week_wed,week_thu,week_fri,week_sat,week_sun} = req.body;
         

            let med = await Medicine.findById({_id:req.body.med_id});

        

                med.name=name;
                med.quantity=quantity;
                
                med.unit=unit;
                med.frequency=frequency;
                med.onceday=onceday;
                med.morning=morning;
                med.morningtime=convertTime24to12(morningtime);
                med.noon=noon;
                med.noontime=convertTime24to12(noontime);
                med.evening=evening;
                med.eveningtime=convertTime24to12(eveningtime);
                med.night=night;
                med.nighttime=convertTime24to12(nighttime);
                med.notification=notification==='on'?'true':'false';
                med.weekdays=[];
          



                if(frequency==='custom' && week_mon)    med.weekdays.push("mon");

                if(frequency==='custom' && week_tue)    med.weekdays.push("tue");
    
                if(frequency==='custom' && week_wed)    med.weekdays.push("wed");
    
                if(frequency==='custom' && week_thu)    med.weekdays.push("thu");
    
                if(frequency==='custom' && week_fri)    med.weekdays.push("fri");
    
                if(frequency==='custom' && week_sat)    med.weekdays.push("sat");
    
                if(frequency==='custom' && week_sun)    med.weekdays.push("sun");
           

        

       
            const data = await med.save();
            

            req.flash('success','Medicine Updated');
            return res.redirect('/');
            
        },
        async editMedicine(req,res,next)
        {

         
            let med = await Medicine.findById({_id:req.params.med});

            res.render('editMedicine',{med:processSingleMedicine(med)});
            
        },
        async postEditMedicine(req,res)
        {
            const {name,quantity,unit,other_unit,frequency,once_day,morning,evening,noon,night,morningtime,noontime,eveningtime,nighttime,notification,week_mon,week_tue,week_wed,week_thu,week_fri,week_sat,week_sun} = req.body;
            const medSchema = new Medicine({
                name,
                quantity,
                userid:req.user._id,
                unit: unit==='other'?other_unit:unit,
                frequency: frequency=='once'?once_day:frequency,
                morning,
                morningtime,
                noon,
                noontime,
                evening,
                eveningtime,
                night,
                nighttime,
                notification:notification==='on'?'true':'false',
                weekdays:[]
            });

            if(week_mon)    medSchema.weekdays.push({monday:week_mon});

            if(week_tue)    medSchema.weekdays.push({tuesday:week_tue});

            if(week_wed)    medSchema.weekdays.push({wednesday:week_wed});

            if(week_thu)    medSchema.weekdays.push({thursday:week_thu});

            if(week_fri)    medSchema.weekdays.push({friday:week_fri});

            if(week_sat)    medSchema.weekdays.push({saturday:week_sat});

            if(week_sun)    medSchema.weekdays.push({sunday:week_sun});
        },
        async deleteMedicine(req,res,next)
        {
        
            let med = await Medicine.deleteOne({_id:req.params.med},function(err){
                if(!err)
                {
                    req.flash('success','Medicine Deleted');
                    res.redirect('/');
                }
                    
            });
            
        },
        async allowEditMedicine(req,res,next)
        {

            let med = await Medicine.findById({_id:res.app.get('med')}).lean();
       
            res.render('editMedicine');
        }
    }
}


module.exports = medController;