import { getFirestore,addDoc,collection,getDoc,getDocs,deleteDoc,doc,query,orderBy,setDoc, where } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; 
import './noschooSingleDayDefinition.js'


const db = getFirestore(); 

const urlSearchParams = new URLSearchParams(window.location.search);
let strMasterCalendarID = urlSearchParams.get('ID')
if (!strMasterCalendarID) {
    strMasterCalendarID = '';
}
strMasterCalendarID = strMasterCalendarID.trim();
if(strMasterCalendarID == ''){
    alert("Invalid master calendar id parameter. Expected a value different than empty");        
} 


const mastercalendarRef = doc(db,"mastercalendar",strMasterCalendarID);

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

async function RefreshValues(){
  try
  {
     const masterCalendarSnapshot = await getDoc(mastercalendarRef);
     if(!masterCalendarSnapshot.exists())
     {
         alert("Master calendar with ID " + strMasterCalendarID  + " does not exists.");
     }

     const oCalendarData = masterCalendarSnapshot.data();
     const intCalendarStartYear =  oCalendarData.startYear;
     const monthData = ReadOrBuildMonthRoster(oCalendarData);     
     
     document.getElementById('noSchoolDaysDefinition').SetMonthData(monthData);
     document.getElementById('calendarDisplay').innerText = "Master calendar " +  intCalendarStartYear + " " + (intCalendarStartYear + 1 );


  }catch(ex)
  {
    alert("Error loading master calendar with ID " + strMasterCalendarID)
  }
}

await RefreshValues()


$('.saveMasterDefinition').click(async function(p){
  try
  {

      document.getElementById('spinner').style.display = ""; 

      const oNoSchooDaysDefinition = document.getElementById('noSchoolDaysDefinition'); 
      await setDoc(mastercalendarRef,{
          monthsData:oNoSchooDaysDefinition.monthData
      },
      { merge: true });  

  }catch (e) {
      alert("Error saving configuration");
  }finally{
      document.getElementById('spinner').style.display = "none";   
  }
}) 


document.getElementById('spinner').style.display = "none"; 