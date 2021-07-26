


var freqSelector = document.querySelector('.freq');
var editFreqSelector = document.querySelector('.freq-edit');
var onceSelector = document.querySelector('.onceday');
var editOnceSelector = document.querySelector('.onceday-edit');


var morningTime = document.querySelector('#inlineCheckbox1');
var noonTime = document.querySelector('#inlineCheckbox2');
var eveningTime = document.querySelector('#inlineCheckbox3');
var nightTime = document.querySelector('#inlineCheckbox4');

var editMorningTime = document.querySelector('#inlineCheckbox1-edit');
var editNoonTime = document.querySelector('#inlineCheckbox2-edit');
var editEveningTime = document.querySelector('#inlineCheckbox3-edit');
var editNightTime = document.querySelector('#inlineCheckbox4-edit');



var searchButon = document.querySelector('.search-button');
var searchOptions = document.querySelector('.search-options');
var searchInput = document.querySelector('.search-input');


var editMedicine = document.querySelector('.edit-medicine');
var notifySwitch = document.querySelector('.notify-switch');

var addWeekdays = document.querySelector('.add-weekdays');
var editWeekdays = document.querySelector('.edit-weekdays');
function showNotification(){
   alert("hi");
}; 



freqSelector && freqSelector.addEventListener('change',function(e)
    {
    
        if(e.target.value === 'once')
        {
            onceSelector.style.display='block';
        }
        else
        {
            onceSelector.style.display='none';
        }

        if(e.target.value === 'custom')
        {
            
            addWeekdays.style.display='flex';
        }
        else
        {
            addWeekdays.style.display='none';
        }
    });
    
    editFreqSelector && editFreqSelector.addEventListener('change',function(e)
    {
    
        if(e.target.value === 'once')
        {
            editOnceSelector.style.display='block';
        }
        else
        {
            editOnceSelector.style.display='none';
        }

        if(e.target.value === 'custom')
        {
            
            editWeekdays.style.display='flex';
        }
        else
        {
            editWeekdays.style.display='none';
        }
    });




notifySwitch && notifySwitch.addEventListener('change',function(){
        if(notifySwitch.checked == true)
        {
            document.querySelector('.indicator').innerHTML="On";
        }
        else
        {
            document.querySelector('.indicator').innerHTML="Off";
        }
    });
    



searchButon && searchButon.addEventListener('click',function(){
        $.post('/search_medicine',{options:searchOptions.value,search:searchInput.value},function(data,status)
        {
    
            $(".card-grps").empty();
    
            var div;
            data.forEach(med => {
                
                div = `<div class="card med-card" style="width: 18rem;">
                <div class="card-body">
                  <div class="card-title ">
                  <h5 style="color:#009432;font-weight: 900;text-transform:uppercase;">${med.name}</h5>
                  <div>
           
                    <a href="/edit_medicine/${med._id}"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="edit" class="svg-inline--fa fa-edit fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"></path></svg></a>
                  </div>
                  </div>
                  <hr>
                  <div class="card-flex">
                    <div class="med-flex">
                    <div class="med-unit1" style="color:#EA2027">Unit</div>
                      <div>${med.unit}</div>
                    </div>
                    <div class="med-flex">
                    <div class="med-unit2" style="color:#006266">Frequency</div>
                      <div>${med.frequency}</div>
                    </div>
                  </div>
                  <hr>
                  <div class="card-flex-time">
                    <div class="med-flex">
                    <div class="med-unit" style="color:#009432;">Time</div>
                      <div class="med-flex-time">
                    `;
                    
    
                    med.time.forEach(time => {
                        div+=`<div class="med-flex"><div>${time.time}</div> <div>${time.format}</div></div>`;
                    })
                    
                          
                         
                      
                     div+='</div></div></div></div></div>';
                      
                     $(".card-grps").append(div);
                
            });
            
        });
    });


morningTime && morningTime.addEventListener('change',function(){

        if(document.querySelector('.morning-select').style.display === 'none')
        {
            document.querySelector('.morning-select').style.display='block';
        }
        else
        {
            document.querySelector('.morning-select').style.display='none';
        }
    });    



noonTime && noonTime.addEventListener('change',function(){

    if(document.querySelector('.noon-select').style.display === 'none')
    {
        document.querySelector('.noon-select').style.display='block';
    }
    else
    {
        document.querySelector('.noon-select').style.display='none';
    }
});
eveningTime && eveningTime.addEventListener('change',function(){

    if(document.querySelector('.evening-select').style.display === 'none')
    {
        document.querySelector('.evening-select').style.display='block';
    }
    else
    {
        document.querySelector('.evening-select').style.display='none';
    }
});
nightTime && nightTime.addEventListener('change',function(){

    if(document.querySelector('.night-select').style.display === 'none')
    {
        document.querySelector('.night-select').style.display='block';
    }
    else
    {
        document.querySelector('.night-select').style.display='none';
    }
});


editMorningTime && editMorningTime.addEventListener('change',function(){

    if(document.querySelector('.morning-select-edit').style.display === 'none')
    {
        document.querySelector('.morning-select-edit').style.display='block';
    }
    else
    {
        document.querySelector('.morning-select-edit').style.display='none';
    }
});
editNoonTime && editNoonTime.addEventListener('change',function(){

    if(document.querySelector('.noon-select-edit').style.display === 'none')
    {
        document.querySelector('.noon-select-edit').style.display='block';
    }
    else
    {
        document.querySelector('.noon-select-edit').style.display='none';
    }
});
editEveningTime && editEveningTime.addEventListener('change',function(){

    if(document.querySelector('.evening-select-edit').style.display === 'none')
    {
        document.querySelector('.evening-select-edit').style.display='block';
    }
    else
    {
        document.querySelector('.evening-select-edit').style.display='none';
    }
});
editNightTime && editNightTime.addEventListener('change',function(){

    if(document.querySelector('.night-select-edit').style.display === 'none')
    {
        document.querySelector('.night-select-edit').style.display='block';
    }
    else
    {
        document.querySelector('.night-select-edit').style.display='none';
    }
});


window.onload = function()
{
  
    if(addWeekdays) {
        var days = document.querySelectorAll('.weekday');
        days.forEach(el => el.checked=false);

    }
    if(document.querySelector('.add-med-form'))
    {
        document.querySelector('.add-med-form').reset();
    }
    if(document.querySelector('.edit-med-form'))
    {   
        document.querySelector('.edit-med-form').reset();
    }

    if(document.querySelector('.edit-profile'))
    {
        document.querySelector('.edit-profile').reset();
    }
}

