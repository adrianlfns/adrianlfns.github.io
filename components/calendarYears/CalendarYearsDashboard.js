import { getFirestore,addDoc,collection,getDoc,getDocs,deleteDoc,doc,query,orderBy,setDoc, where } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; 
import {GetCalendarDisplay} from './calendarUtiles.js'

const db = getFirestore(); 
const urlSearchParams = new URLSearchParams(window.location.search);
let strSchoolID = urlSearchParams.get('SchoolID')
if (!strSchoolID) {
    strSchoolID = '';
}
strSchoolID = strSchoolID.trim();
if(strSchoolID == '') 
{
    alert("Invalid school id parameter expected a value different than empty");    
} 
 
const shoolRef = doc(db,"school",strSchoolID);
const schoolSnapshot = await getDoc(shoolRef);
if(!schoolSnapshot.exists())
{
    alert("School with ID " + strSchoolID  + " does not exists.");
} 
const schoolData = schoolSnapshot.data();

function renderSchoolData(){
  const title = `Calendars - ${schoolData.schoolName}`;
  document.getElementById('title').textContent = title;
  document.getElementById('pageHeader').textContent =title; 
}

async function renderCalendars(){
  try{
    $('#calendarList').empty();
    document.getElementById('spinner').style.display = ""; 
    const calendarSubCol = collection(shoolRef,"calendars"); 
    const q = query(calendarSubCol, orderBy("startYear"));
    const querySnapshot =  await getDocs(q);
    querySnapshot.forEach((doc) => {

        let data = doc.data(); 

        let header = GetCalendarDisplay(data);        
   
        $('#calendarList').prepend(`
        <div class="col mb-4">
            <div class="card">               
                <div class="card-body">
                 <h5 class="card-title">${header}</h5>
                 <a href="RunClass.html?SchoolID=${strSchoolID}&CalendarID=${doc.id}" class="btn btn-sm btn-success runclass">Run Class</a>
                 <a href="ConfigureCalendar.html?SchoolID=${strSchoolID}&CalendarID=${doc.id}" class="btn btn-sm btn-info configurecalendar">Configure</a> 
                 <a href="#" class="btn btn-sm btn-primary editCalendar"  data-calendarid="${doc.id}">Edit</a> 
                 <a href="#" class="btn btn-sm btn-danger deleteCalendar" data-calendarname="${header}"  data-calendarid="${doc.id}">Delete</a> 
                </div>
            </div>
        </div>`);
    });

  } catch (e) {
      alert("Error loading calendars" );
  } 
  finally{
        document.getElementById('spinner').style.display = "none"; 
   }
}



$('#cboCalendarMonth').change(function() {
    RefreshEndYear();
});

$('#intStartYear').change(function() {
    RefreshEndYear();
});


 

$('#calendarEditor').on('shown.bs.modal', function (event) {     
    const calendarID = document.getElementById('calendarID').value;
    if (!calendarID || calendarID == '')
    {
        document.getElementById('cboCalendarMonth').focus();
        
    }
    else
    {
        document.getElementById('intStartYear').focus();
    }   
});

$('#calendarEditor').on('hidden.bs.modal', function (event) {
     document.getElementById('intStartYear').value = '';
     document.getElementById('intEndYear').value = '';
     document.getElementById('calendarID').value = '';
});

function RefreshEndYear(){
    const calendarYear = parseInt(document.getElementById('intStartYear').value);
    const calendarMonth =  parseInt(document.getElementById('cboCalendarMonth').value); 
    if(calendarYear && calendarYear > 0 && calendarMonth && calendarMonth > 0){
        document.getElementById('intEndYear').value = calendarYear + 1
    }
}

$('#cmdSaveCalendar').on('click', async function (event) {    
    if(!ValidateCalendar()) return;
    const calendarYear = parseInt(document.getElementById('intStartYear').value);
    const calendarMonth =  parseInt(document.getElementById('cboCalendarMonth').value ); 
    const calendarSubCol = collection(shoolRef,"calendars");
    const calendarDocument = doc(collection(shoolRef,"calendars"),`calendar_${calendarYear}`)
    await setDoc( calendarDocument,{startMonth:calendarMonth, 
                                    startYear:calendarYear});
    await renderCalendars();
    $('#calendarEditor').modal('hide'); 
});

function ValidateCalendar(){
   const calendarMonth =  document.getElementById('cboCalendarMonth').value ;
   const calendarYear = document.getElementById('intStartYear').value;

   if(!calendarMonth || calendarMonth =='') {
     alert("Please select a calendar month");
     document.getElementById('cboCalendarMonth').focus();
     return false;
   }
   if(!calendarYear || calendarYear == ''||  calendarYear < 999 || calendarYear > 9999){
    alert("Calendar year start is a required number between 999 and 9999.");
    document.getElementById('intStartYear').focus();
    return false;
   }
   return true;
}

function ShowCalendarEditor(calendarID, intStartMonth, intStartYear){
    let monthPointer = new Date((new Date()).getFullYear(),0);
    document.getElementById('intStartYear').value =intStartYear;
    document.getElementById('intStartYear').readOnly = calendarID && calendarID != '';

  
    const options = { month: "long" };
    $('#cboCalendarMonth').empty();
    for (let i=0; i< 12; i++)
    {
        $('#cboCalendarMonth').append(`<option value="${monthPointer.getMonth()}" ${(monthPointer.getMonth() === intStartMonth)?'selected':''}>${new Intl.DateTimeFormat("en-US", options).format(monthPointer)}</option>`);
        monthPointer = new Date(monthPointer);
        monthPointer.setMonth(monthPointer.getMonth() + 1)  
    }
    RefreshEndYear();
    $('#calendarEditor').modal('show');
}

$('#cmdAddCalendar').click(function(){
    let monthPointer = new Date((new Date()).getFullYear(),0);
    ShowCalendarEditor('',6,monthPointer.getFullYear()); 
})

$('#calendarList').on('click','.editCalendar', async function (e) { 
    let calendarID =  e.currentTarget.dataset.calendarid;    
    const calendarSubCol = collection(shoolRef,"calendars"); 
    const calendarDocument = doc(calendarSubCol,calendarID);
    const docSnap = await getDoc(calendarDocument);
    if(!docSnap.exists()){
        alert("unable to retrieve calendar with ID " + calendarID);
        return;
    }
    const data = docSnap.data();
    ShowCalendarEditor(calendarID,data.startMonth,data.startYear);
 });

 
$('#calendarList').on('click','.deleteCalendar', async function (e) { 
    let calendarname = e.currentTarget.dataset.calendarname;   
    if (confirm(`Do you really want to delete the calendar "${calendarname}"?`) == true){
    let calendarID =  e.currentTarget.dataset.calendarid;    
    const calendarSubCol = collection(shoolRef,"calendars"); 
    const calendarDocument = doc(calendarSubCol,calendarID);
    await deleteDoc(calendarDocument);
    await renderCalendars(); 
    }
 });

 




renderSchoolData();
await renderCalendars();
document.getElementById('spinner').style.display = "none"; 
 
