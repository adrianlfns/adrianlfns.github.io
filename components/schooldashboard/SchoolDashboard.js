//retrieve the schools
import { getFirestore,addDoc,collection,getDocs,deleteDoc,doc,query,orderBy,setDoc, where , runTransaction } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; 
const db = getFirestore(); 
 

async function  refreshSchools(){
    try {   
        document.getElementById('spinner').style.display = "";      
        $('#schoolList').empty();

        const schoolref = collection(db, "school");
        const q = query(schoolref, orderBy("schoolName"));
        const querySnapshot =  await getDocs(q);

        //const querySnapshot = await getDocs(collection(db, "school"));
        querySnapshot.forEach((doc) => {
            let schoolName = doc.data().schoolName;
            $('#schoolList').append(`
                                    <div class="col mb-4">
                                        <div class="card">               
                                            <div class="card-body">
                                            <h5 class="card-title">${schoolName}</h5> 
                                            <a href="SchoolCalendarYears.html?SchoolID=${doc.id}" class="btn btn-sm btn-success">School Calendar</a>
                                            <a href="#" class="btn btn-sm btn-primary editSchool"  data-schoolid="${doc.id}" data-schoolname="${schoolName}">Edit</a>
                                            <a href="#" class="btn btn-sm btn-danger deleteSchool" data-schoolid="${doc.id}" data-schoolname="${schoolName}">Delete</a>
                                            </div>
                                        </div>
                                    </div>`);  
        });
    } catch (e) {
      alert("Error loading schools" );
    } 
    finally{
        document.getElementById('spinner').style.display = "none"; 
    }
}

$('#schoolList').on('click','.editSchool', async function (e) { 
    let schoolID =  e.currentTarget.dataset.schoolid;  
    let schoolName = e.currentTarget.dataset.schoolname;  
    document.getElementById('shoolName').value =  schoolName;
    document.getElementById('schoolID').value = schoolID;
    $('#schoolEditor').modal('show');
 });

$('#schoolList').on('click','.deleteSchool', async function (e) { 
    let schoolName = e.currentTarget.dataset.schoolname;    
    if (confirm(`Do you really want to delete the school "${schoolName}"?`) == true){

        let schoolID =  e.currentTarget.dataset.schoolid; 
        const schoolDocumentToDelete = doc(db, "school", schoolID);
        const calendarSubCol = collection(schoolDocumentToDelete,"calendars"); 
        const q = query(calendarSubCol);
        const querySnapshot = await getDocs(q);
        try{
            await runTransaction(db, async (transaction) => {
                querySnapshot.forEach(async (subDocument) => {
                    await transaction.delete(doc(calendarSubCol,subDocument.id));
                });             
                await transaction.delete(schoolDocumentToDelete);
            })
        } catch (e) {
        alert("Error deleting a shchool");
        }
         await refreshSchools();
    }
 });

$('#cmdSaveSchool').on('click', async function (event) {     
    try {
        let strShoolName  =  document.getElementById('shoolName').value;
        if (!strShoolName){
            strShoolName = "";
        }
        strShoolName = strShoolName.trim();
        let strShoolID = document.getElementById('schoolID').value;
        if(!strShoolID){
            strShoolID = "";
        }
 
        if (strShoolName == ''){
            alert('Please enter the school name');
            return;
        }

        const schoolref = collection(db, "school");
        const q = query(schoolref, where("schoolName", "==", strShoolName));
        const querySnapshot = await getDocs(q);
        if(!querySnapshot.empty){
            const foundDoc = querySnapshot.docs[0];
            if(strShoolID == ''  || foundDoc.id != strShoolID){
                alert('School name allready exist');
                return;
            } 
        }


        const schoolData = {
            schoolName: strShoolName 
          };

        //perform validation here
        if (strShoolID && strShoolID != "")
        {
            await setDoc(doc(db, "school", strShoolID), schoolData);
        }
        else
        {
            const docRef = await addDoc(collection(db, "school"), schoolData);  
        }
        
        await refreshSchools();
        $('#schoolEditor').modal('hide'); 
      } catch (e) {
        alert("Error adding/editing school" );
      }    
});

$('#schoolEditor').on('shown.bs.modal', function (event) {
    document.getElementById('shoolName').focus();
});

$('#schoolEditor').on('hidden.bs.modal', function (event) {
     document.getElementById('shoolName').value = '';
     document.getElementById('schoolID').value = '';
});
await refreshSchools();


