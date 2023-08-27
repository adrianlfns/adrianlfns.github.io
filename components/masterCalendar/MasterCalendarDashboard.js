import { getFirestore,addDoc,collection,getDocs,deleteDoc,doc,query,orderBy,setDoc,getDoc, where , runTransaction,limit } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; 
const db = getFirestore(); 

async function  refreshMasterCalendars(){
    try {   
        document.getElementById('spinner').style.display = "";      
        $('#calendarList').empty();

        const calendarRef = collection(db, "mastercalendar");
        const q = query(calendarRef, orderBy("startYear", "desc"), limit(4));
        const querySnapshot =  await getDocs(q);

        querySnapshot.forEach((doc) => {
            let id = doc.id;
            let oData = doc.data();
            let startYear = oData.startYear;
            let strHeader = startYear + ' - ' + (startYear + 1);

            $('#calendarList').append(`
                                    <div class="col mb-4">
                                        <div class="card">               
                                            <div class="card-body">
                                            <h5 class="card-title">${strHeader}</h5> 
                                            <a href="MasterCalendarDefinition.html?ID=${id}" class="btn btn-sm btn-success">Define Calendar</a>
                                            <a href="#" class="btn btn-sm btn-danger deleteCalendar" data-id="${id}" data-calendarname="${strHeader}">Delete</a>
                                            </div>
                                        </div>
                                    </div>`);  
        });
    } catch (e) {
      alert("Error loading master calendar" );
    } 
    finally{
        document.getElementById('spinner').style.display = "none"; 
    }
}


$('#calendarList').on('click','.deleteCalendar', async function (e) { 
    let calendarname = e.currentTarget.dataset.calendarname;  
    if (confirm(`Do you really want to delete the master calendar "${calendarname}"?`) == true){
    try{
            let id =  e.currentTarget.dataset.id; 
            const schoolDocumentToDelete = doc(db, "mastercalendar", id);
            await deleteDoc(schoolDocumentToDelete)
        } catch (e) {
        alert("Error deleting a master calendar");
        }
        await refreshMasterCalendars();
    }
 });

$('#cboCalendarMonth').change(function() {
    RefreshEndYear();
});

$('#intStartYear').change(function() {
    RefreshEndYear();
});


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

async function ValidateCalendar(){
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

    //check that the calendar allready exists
    const mastercalendarRef = doc(db,"mastercalendar",GetCalendarID(calendarYear));
    const masterCalendarSnapshot = await getDoc(mastercalendarRef);
    if(masterCalendarSnapshot.exists())
    {
        alert("Master calendar for the years " + calendarYear  + " - " + (parseInt(calendarYear) + 1) +  " allready exists.");
        return false;
    }
    return true;
 }

 function GetCalendarID(calendarYear){
   return `calendar_${calendarYear}`
 }


$('#cmdSaveCalendar').on('click', async function (event) {    
    if(!await ValidateCalendar()) return;
    const calendarYear = parseInt(document.getElementById('intStartYear').value);
    const calendarMonth =  parseInt(document.getElementById('cboCalendarMonth').value );  
    const calendarRef = collection(db, "mastercalendar");
    const calendarID = GetCalendarID(calendarYear); // `calendar_${calendarYear}`
    const calendarDocument = doc(calendarRef,calendarID)
    await setDoc(calendarDocument,{startMonth:calendarMonth, 
                                    startYear:calendarYear});
    location.href = 'MasterCalendarDefinition.html?ID=' + calendarID;
    $('#calendarEditor').modal('hide'); 
});


function RefreshEndYear(){
    const calendarYear = parseInt(document.getElementById('intStartYear').value);
    const calendarMonth =  parseInt(document.getElementById('cboCalendarMonth').value); 
    if(calendarYear && calendarYear > 0 && calendarMonth && calendarMonth > 0){
        document.getElementById('intEndYear').value = calendarYear + 1
    }
}

await refreshMasterCalendars();