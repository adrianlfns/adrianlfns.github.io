import { getFirestore,addDoc,collection,getDoc,getDocs,deleteDoc,doc,query,orderBy,setDoc, where } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; 
import {GetCalendarDisplay,TransformFirebaseTimeStampsToDate,CompareDate, DateForDisplay} from '../calendarYears/calendarUtiles.js'

const db = getFirestore(); 
const urlSearchParams = new URLSearchParams(window.location.search);
let strSchoolID = urlSearchParams.get('SchoolID')
if (!strSchoolID) {
    strSchoolID = '';
}
strSchoolID = strSchoolID.trim();
if(strSchoolID == ''){
    alert("Invalid school id parameter expected a value different than empty");    
} 
let strCalendarID = urlSearchParams.get('CalendarID');
if (!strCalendarID) {
    strCalendarID = '';
}
strCalendarID = strCalendarID.trim();
if(strCalendarID == ""){
    alert("Invalid calendar id parameter expected a value different than empty");    
}

const shoolRef = doc(db,"school",strSchoolID);
const calendarSubCol = collection(shoolRef,"calendars");
const calendarDocument = doc(calendarSubCol,strCalendarID);
let firstDayOfCalendar;
let lastDayOfCalendar;
let calendarData;

async function RefreshValues(){
    calendarData = null;
    firstDayOfCalendar = null;
    const schoolSnapshot = await getDoc(shoolRef);
    if(!schoolSnapshot.exists())
    {
        alert("School with ID " + strSchoolID  + " does not exists.");
    } 
    const schoolData = schoolSnapshot.data();
    document.getElementById('headerSchoolName').innerText = schoolData.schoolName;
    const docSnap = await getDoc(calendarDocument);
    if(!docSnap.exists()){
        alert("unable to retrieve calendar with ID " + strCalendarID);
    }
    calendarData = docSnap.data();
    document.getElementById('calendarDisplay').innerText = "School Calendar " + GetCalendarDisplay(calendarData);
    const goBackToCalendarYears = document.getElementById('goBackToCalendarYears');
    goBackToCalendarYears.innerText = "Go Back to school calendar years";
    goBackToCalendarYears.href = `SchoolCalendarYears.html?SchoolID=${strSchoolID}`;
    configureAbScheduleAndBellScheduleForThisCalendar.href = `ConfigureCalendar.html?SchoolID=${strSchoolID}&CalendarID=${strCalendarID}`;


    
    
    if (calendarData.monthsData){
        TransformFirebaseTimeStampsToDate(calendarData.monthsData);
        if(calendarData.monthsData.length > 0){
            if(calendarData.monthsData[0].days.length > 0){
                firstDayOfCalendar = calendarData.monthsData[0].days[0].day;
                const lastMonth = calendarData.monthsData[calendarData.monthsData.length-1];
                lastDayOfCalendar = lastMonth.days[lastMonth.days.length-1].day;
                lastDayOfCalendar.setHours(23,59,59,999);
            }
        }      
    } 
    document.getElementById('dteStartDate').value = (firstDayOfCalendar)?firstDayOfCalendar.toISOString().slice(0,10):null;   


    RebuildPeriods(calendarData);

} 

function RebuildPeriods(calendarData){
    $('#periodBody').empty();
    if (!calendarData.bellSchedules) return;
    calendarData.bellSchedules.forEach(item => {
        $('#periodBody').append(`
             <tr>
                <td> 
                 <input type="checkbox" data-period="${encodeURIComponent(JSON.stringify(item))}" class="form-control form-control-sm period" checked>
                </td>
                <td>${item.Session}</td>
                <td>${item.StartHour}:${item.StartMinute.padStart(2,'0')} ${item.StartAM_PM}</td>
                <td>${item.EndHour}:${item.EndMinute.padStart(2,'0')} ${item.EndAM_PM}</td>
              </tr> 
        `);
    });
}

await RefreshValues();

var dteStartDate = null;
var intContactHours = null;
var intContactHoursInMilliSeconds = null;
var dteEndDate = null;
var periodsSelectedCol = null;

$('#cmdRunClass').click(function(){
 
    if(!ValidateParameters()) return;
    if(!RenderRunClass()) return;
    document.getElementById('parameters').hidden = true;
    document.getElementById('cmdChangeParameters').hidden = false;

});

$('#cmdChangeParameters').click(function(){
    document.getElementById('cmdChangeParameters').hidden = true;
    document.getElementById('parameters').hidden = false;
});

function ValidateParameters(){

    dteStartDate = null;
    intContactHours = null;
    dteEndDate = null;
    periodsSelectedCol = null;
    intContactHoursInMilliSeconds = null;

    const strStartDate = document.getElementById('dteStartDate').value;
    if (!strStartDate || strStartDate == ''){
        alert(" \"Run from Date\" is required.");
        document.getElementById('dteStartDate').focus();
        return false;
    }

   
    try{
        dteStartDate = new Date(strStartDate + 'T12:00');
    }catch (e){
      alert("Expected a not empty, valid date for \"Run from Date\"");
      document.getElementById('dteStartDate').focus().setHours(0, 0, 0, 0);
      return false;
    }
    
    const strContactHours = document.getElementById("txtContactHours").value;
    const strRunToDate = document.getElementById("dteEndDate").value;
    if (!strContactHours && strContactHours != "" && !strRunToDate && strRunToDate != ""){
        alert("\"Contact hours\" or \"Run to date\" is required, but not both.");
        return false;
    }

    if((!strContactHours || strContactHours == "") && (!strRunToDate || strRunToDate =="")){
        alert("Either \"Contact hours\" or \"Run to date\" is required.");
        return false;
    }

    if (strContactHours && strContactHours != ""){
        intContactHours = parseInt(strContactHours);
        if (isNaN(intContactHours) || intContactHours <=0){
            alert("Invalid \"Contact hours\" Expected a numeric value greather than zero.");
            document.getElementById('txtContactHours').focus();
            return false;
        }

        intContactHoursInMilliSeconds = intContactHours * 60 * 60 * 1000
    }

    if(strRunToDate && strRunToDate != ""){
        try{
            dteEndDate = new Date(strRunToDate + 'T12:00');
        }catch (e){
          alert("Expected a not empty, valid date for \"Run to Date\"");
          document.getElementById('dteEndDate').focus();
          return false;
        }
    }

    if (dteStartDate < firstDayOfCalendar || dteStartDate > lastDayOfCalendar){
        alert(`"Run from Date" is invalid. Expected a value between ${DateForDisplay(firstDayOfCalendar)} and ${DateForDisplay(lastDayOfCalendar)}`);
        document.getElementById('dteStartDate').focus();
        return false;
    }

    if(dteEndDate != null && (dteEndDate < firstDayOfCalendar  || dteEndDate > lastDayOfCalendar)){
        alert(`"Run to Date" is invalid. Expected a value between ${DateForDisplay(firstDayOfCalendar)} and ${DateForDisplay(lastDayOfCalendar)}`);
        document.getElementById('dteEndDate').focus();
        return false;
    }

    const oCheckedPeriods =  $('#periodBody').find('.period:checked');
    if (oCheckedPeriods.length <= 0){
        alert(`You must select at least one period.`);
        return false;
    }

    periodsSelectedCol = [];
    oCheckedPeriods.each(function( index, element ){    
        periodsSelectedCol.push(JSON.parse(decodeURIComponent(element.dataset.period)));
    });

    return true;
}

function RenderRunClass(){

    $('#runResults').empty();

    let strHeaderMessage = 'Run from: ' + dteStartDate.toLocaleDateString('en-US',{
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    if(intContactHours){
        strHeaderMessage = strHeaderMessage + ', meet ' + intContactHours + ' contact hours.';
    }else{
        strHeaderMessage = strHeaderMessage + ', meet until ' + (new Date(dteEndDate)).toLocaleDateString('en-US',{
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    }
    

    document.getElementById('runFrom').innerHTML = strHeaderMessage; 

     //divide the session
     let oASessions = periodsSelectedCol.filter(p => p.Session == 'A').sort(CompareDate);
     let oBSessions = periodsSelectedCol.filter(p => p.Session == 'B').sort(CompareDate);

    //flatout all the days in the calendar
    let oCalendarDays = calendarData.monthsData.flatMap(p => p.days);
    oCalendarDays = oCalendarDays.filter(p => p.day >= dteStartDate);
    if (dteEndDate){
      oCalendarDays = oCalendarDays.filter(p => p.day <= dteEndDate);
    }
    let oADays = oCalendarDays.filter(p => p.dayAnswer && p.dayAnswer == 'A').sort((a,b)=> a.day - b.day); //sorted by day
    let oBDays = oCalendarDays.filter(p => p.dayAnswer && p.dayAnswer == 'B').sort((a,b)=> a.day - b.day);

    let totalSessions = oASessions.length;
    if (oBSessions.length > totalSessions){
      totalSessions = oBSessions.length;
    } 

 
    let blnMasterStop = false;
    let totalMilliseconds = 0;

    for(let i=0; i<totalSessions && !blnMasterStop; i++){

        let oASession = null;
        let oBSession = null;

        if (oASessions.length > i && oASessions.length > 0)
        {
          oASession = oASessions[i];
        }

        if (oBSessions.length > i && oBSessions.length > 0)
        {
          oBSession = oBSessions[i];
        }

        let runningAMilliseconds = 0;
        let runningBMilliseconds = 0;


        //header
        $('#runResults').append(` <tr> 
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>              
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td> 
                                </tr>`);

        $('#runResults').append(` <tr> 
                                <td></td>
                                <td>A Sequence</td>
                                <td></td>
                                <td></td>
                                <td></td>              
                                <td></td>
                                <td></td> 
                                <td>B Sequence</td>
                                <td></td>
                                <td></td>
                                <td></td> 
                            </tr>`);

        $('#runResults').append(` <tr> 
                                    <td style="background:#ADD8E6; border: 1px solid black;">Date</td>
                                    <td style="background:#ADD8E6; border: 1px solid black;">Day</td>
                                    <td style="background:#ADD8E6; border: 1px solid black;">Start Time</td>
                                    <td style="background:#ADD8E6; border: 1px solid black;">End Time</td>
                                    <td style="background:#ADD8E6; border: 1px solid black;">Total Time</td>              
                                    <td></td>
                                    <td style="background:#008000; border: 1px solid black;">Date</td>
                                    <td style="background:#008000; border: 1px solid black;">Day</td>
                                    <td style="background:#008000; border: 1px solid black;">Start Time</td>
                                    <td style="background:#008000; border: 1px solid black;">End Time</td>
                                    <td style="background:#008000; border: 1px solid black;">Total Time</td> 
                                </tr>`);

         //items
         if(oASession != null || oBSession != null){

            let intTotalDays = oADays.length;
            if(oBDays.length > intTotalDays){
                intTotalDays = oBDays.length;
            }

            for (let intDayIndex = 0; intDayIndex < intTotalDays && !blnMasterStop; intDayIndex++){
               
               let currentADay = null;
               let currentBDay = null;

               if (oADays.length  > intDayIndex){
                currentADay = oADays[intDayIndex];
               }

               if (oBDays.length > intDayIndex){
                currentBDay = oBDays[intDayIndex];
               } 

               let oCurrentADate = FormatDate(currentADay);
               let oCurrentAStartTime = BuildStarTime(oASession);
               let oCurrentAEndTime = BuildEndTime(oASession);
               let oATimeDif = null; 
               if (oCurrentADate != ''){
                  let oStartADate = new Date(oCurrentADate + ' ' + oCurrentAStartTime);
                  let oEndADate =  new Date(oCurrentADate + ' ' + oCurrentAEndTime); 
                  oATimeDif = oEndADate.getTime() - oStartADate.getTime();
                  runningAMilliseconds = runningAMilliseconds + oATimeDif;
                  totalMilliseconds = totalMilliseconds + oATimeDif
               }

               let oCurrentBDate = FormatDate(currentBDay);
               let oCurrentBStartTime = BuildStarTime(oBSession);
               let oCurrentBEndTime = BuildEndTime(oBSession);
               let oBTimeDif = null;
               if(oCurrentBDate != ''){
                let oStartBDate = new Date(oCurrentBDate + ' ' + oCurrentBStartTime);
                let oEndBDate = new Date(oCurrentBDate + ' ' + oCurrentBEndTime);
                oBTimeDif = oEndBDate.getTime() - oStartBDate.getTime();
                runningBMilliseconds = runningBMilliseconds + oBTimeDif;
                totalMilliseconds = totalMilliseconds + oBTimeDif
               }


               $('#runResults').append(` <tr> 
                                    <td style="border: 1px solid black;">${oCurrentADate}</td>
                                    <td style="border: 1px solid black;">${FormatDayOfWeeek(currentADay)}</td>
                                    <td style="border: 1px solid black;">${oCurrentAStartTime}</td>
                                    <td style="border: 1px solid black;">${oCurrentAEndTime}</td>
                                    <td style="border: 1px solid black;">${FormatMilliseconds(oATimeDif)}</td>              
                                    <td></td>
                                    <td style="border: 1px solid black;">${oCurrentBDate}</td>
                                    <td style="border: 1px solid black;">${FormatDayOfWeeek(currentBDay)}</td>
                                    <td style="border: 1px solid black;">${BuildStarTime(oBSession)}</td>
                                    <td style="border: 1px solid black;">${BuildEndTime(oBSession)}</td>
                                    <td style="border: 1px solid black;">${FormatMilliseconds(oBTimeDif)}</td> 
                                </tr>`);

                if(intContactHoursInMilliSeconds &&  totalMilliseconds  >= intContactHoursInMilliSeconds){
                    blnMasterStop = true;
                }

            }


            $('#runResults').append(` <tr> 
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style="border: 1px solid black;  font-weight: bold;"> ${FormatMilliseconds(runningAMilliseconds)}</td>              
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td style="border: 1px solid black; font-weight: bold;">${FormatMilliseconds(runningBMilliseconds)}</td> 
            </tr>`);

            $('#runResults').append(` <tr> 
                <td></br></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>              
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td> 
            </tr>`);

         }

    }

    return true;
}


function FormatDate(oDay){
    if(oDay && oDay.day){
      return oDay.day.toLocaleDateString('en-US',{
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    }
    return "";
}

function FormatDayOfWeeek(oDay){
    if(oDay && oDay.day){
        return oDay.day.toLocaleDateString('en-US',{
            weekday:'long'
        })
    }
    return "";
}

function BuildStarTime(session){

    let strSesssionTime = '';
    if (session)
    {
      strSesssionTime = session.StartHour + ":" + session.StartMinute.padStart(2,'0') + " " + session.StartAM_PM ;
    }  
    return strSesssionTime;
 }

 function BuildEndTime(session){

    let strSesssionTime = '';
    if (session)
    {
      strSesssionTime =  session.EndHour + ":" + session.EndMinute.padStart(2,'0') + " " + session.EndAM_PM ;
    }  
    return strSesssionTime;
 }

 function FormatMilliseconds(intTimeInMillisecods){
    if(intTimeInMillisecods){
        let hours = Math.floor(intTimeInMillisecods / (1000 * 60 * 60));  
        let minutes = Math.floor(intTimeInMillisecods / (1000 * 60))
        minutes = minutes % 60;
        return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
    }
    return "";
 }

 function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

document.getElementById('spinner').style.display = "none"; 