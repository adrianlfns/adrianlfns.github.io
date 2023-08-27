import { getFirestore,addDoc,collection,getDoc,getDocs,deleteDoc,doc,query,orderBy,setDoc, where } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; 
import {GetCalendarDisplay} from '../calendarYears/calendarUtiles.js'

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


async function RefreshValues(){
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
    const calendarData = docSnap.data();
    document.getElementById('calendarDisplay').innerText = GetCalendarDisplay(calendarData);
    const goBackToCalendarYears = document.getElementById('goBackToCalendarYears');
    goBackToCalendarYears.innerText = "Go Back to school calendar years";
    goBackToCalendarYears.href = `SchoolCalendarYears.html?SchoolID=${strSchoolID}`;
    let monthData = ReadOrBuildMonthRoster(calendarData);

    //fill the from the master calendar for new calendars
    await FillAnsweresFromMasterCalendar(monthData,calendarData);
    

    document.getElementById('abScheduleDefinition').SetMonthData(monthData);   
    let bellSchedules = calendarData.bellSchedules;
    if(!bellSchedules){
        bellSchedules = [];
    }
    document.getElementById('bellScheduleDefinition').bellSchedules = bellSchedules;
} 

await RefreshValues();

async function FillAnsweresFromMasterCalendar(monthData,calendarData){
    if (calendarData.monthsData) return;      
    const startYear = calendarData.startYear;
    const mastercalendarRef = doc(db,"mastercalendar",`calendar_${startYear}`);
    const masterCalendarSnapshot = await getDoc(mastercalendarRef);  
    if (!masterCalendarSnapshot.exists()) return;
    const oCalendarData = masterCalendarSnapshot.data();
    const masterCalendarMonthData = oCalendarData.monthsData;
    if (!masterCalendarMonthData) return; 
    //firestore saves the dates in Timestamp we have to convert back to date
    masterCalendarMonthData.forEach(element => {
        element.firstDateOfTheMonth = element.firstDateOfTheMonth.toDate();
        element.days.forEach(d =>{
            d.day = d.day.toDate();
        })
       });  
    
    //copy answer for the day from the master to month data
    monthData.forEach(element =>  {
        let FirstDayOfMonth = element.firstDateOfTheMonth.toDateString();
        let MasterMonth = masterCalendarMonthData.find(c => c.firstDateOfTheMonth.toDateString() === FirstDayOfMonth);
        if(MasterMonth){
             element.days.forEach(day =>{
                const currentDay = day.day.getDate();
                const MasterDay =  MasterMonth.days.find(t => t.day.getDate() == currentDay);
                if(MasterDay && MasterDay.dayAnswer && MasterDay.dayAnswer!=""){
                    day.dayAnswer = MasterDay.dayAnswer;
                }
             });
        }
    });

}


function ReadOrBuildMonthRoster(calendarData){

    let monthDataCol = calendarData.monthsData;
    if (!monthDataCol){
        monthDataCol = [];
    }
    else
    {
       //firestore saves the dates in Timestamp we have to convert back to date
       monthDataCol.forEach(element => {
        element.firstDateOfTheMonth = element.firstDateOfTheMonth.toDate();
        element.days.forEach(d =>{
            d.day = d.day.toDate();
        })
       });
    }

    if (monthDataCol.length <=0){       

        let monthPointer = new Date(calendarData.startYear,calendarData.startMonth);
        let intMonthNumber = monthPointer.getMonth(); 
        let intWeekID = 1

        for (let i =0; i<12; i++)
        {         
            let oSingleMonth = {
                firstDateOfTheMonth:monthPointer,
                days:[]
            }
            while (intMonthNumber == monthPointer.getMonth())
            {
                if(monthPointer.getDay() ==0) //first day of the week bumps up the weekID
                {
                 intWeekID++;
                }
        
                //exclude saturdays and sundays
                if (monthPointer.getDay() !=0 && monthPointer.getDay() != 6)
                {
                    oSingleMonth.days.push({
                        day: monthPointer,
                        weekID:intWeekID
                    });
                }
                monthPointer = new Date(monthPointer);
                monthPointer.setDate(monthPointer.getDate() + 1)
            }
            monthDataCol.push(oSingleMonth);
            intMonthNumber = monthPointer.getMonth(); 
        }
    }
   return monthDataCol;
} 

$('.saveCalendarAndBellSchedule').click(async function(p){
    try
    {

        document.getElementById('spinner').style.display = ""; 
        const oABSchedule = document.getElementById('abScheduleDefinition');
        const obellSchedule = document.getElementById('bellScheduleDefinition');
        await setDoc(calendarDocument,{
            monthsData:oABSchedule.monthData,
            bellSchedules:obellSchedule.bellSchedules
        },
        { merge: true });  

    }catch (e) {
        alert("Error saving configuration");
    }finally{
        document.getElementById('spinner').style.display = "none";   
    }
})



document.getElementById("bellScheduleDefinition").addEventListener("bellScheduleChanged", async() =>  {
    try
    {
        document.getElementById('spinner').style.display = "";  
        const obellSchedule = document.getElementById('bellScheduleDefinition');
        await setDoc(calendarDocument,{
            bellSchedules:obellSchedule.bellSchedules
        },
        { merge: true });
    }catch (e) {
        alert("Error saving configuration");
    }finally{
        document.getElementById('spinner').style.display = "none";   
    }
  });






document.getElementById('spinner').style.display = "none"; 

 
 