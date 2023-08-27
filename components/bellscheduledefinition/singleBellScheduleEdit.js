import {LitElement, html, map,live} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.3.0/all/lit-all.min.js'; 
export class SingleBellScheduleEdit extends LitElement{


    constructor() {
        super(); 
        this.data ={Session: '', 
        StartAM_PM: '', 
        StartHour:null, 
        StartMinute:null,
        EndAM_PM:''};
      }

      static properties = { 
        data: {Session: '', 
               AM_PM: '', 
               StartHour:null, 
               StartMinute:null,
               EndAM_PM:null}
      }

      Cancel(){
        let event = new CustomEvent("cancellSingleBellEdit",{
            bubbles: true, composed: true 
           });
           this.dispatchEvent(event);
      }

      SetFocus(){
        let DropDown = this.renderRoot.getElementById('sessionAorB');
        if (DropDown){
          DropDown.focus();
        }
      }

      Save(){
        //validation first
        if (!this.ValidateAndCollectData()) return false; 
        let event = new CustomEvent("saveSingleBellEdit",{
            bubbles: true, composed: true,
            detail:{
                data:this.data 
            }
           });
           this.dispatchEvent(event);
      }

      ValidateAndCollectData()
      {
         let comtrol = this.renderRoot.getElementById('sessionAorB');
         let strAOrB = comtrol.value;      
         if(strAOrB != "A" && strAOrB != "B")
         {
           alert('Please select the session A or B');
           comtrol.focus();
           return false;
         }

         comtrol =  this.renderRoot.getElementById('startAmOrPM')
         let strStatAMOrPM = comtrol.value;
         if(strStatAMOrPM != "AM" && strStatAMOrPM != "PM")
         {
           alert('Please select Start AM/PM');
           comtrol.focus();
           return false;
         } 

         comtrol = this.renderRoot.getElementById("startHourInput");
         let strStartHour = comtrol.value;
         if(isNaN(strStartHour) || (strStartHour < 1 || strStartHour > 12) )
         {
           alert('Start Hour is a required numeric value between 1 and 12');
           comtrol.focus();
           return false;
         }

         
         comtrol = this.renderRoot.getElementById("startMinuteInput");
         let startMinuteInput = comtrol.value;
         if(startMinuteInput == "" || isNaN(startMinuteInput) || startMinuteInput < 0 || startMinuteInput > 59 )
         {
           alert('Start Minute is a required numeric value between 0 and 59');
           comtrol.focus();
           return false;
         }

         comtrol = this.renderRoot.getElementById('endAmOrPM')
         let strEndAMOrPM = comtrol.value;
         if(strEndAMOrPM != "AM" && strEndAMOrPM != "PM")
         {
           alert('Please select End AM/PM');
           strEndAMOrPM.focus();
           return false;
         } 

         comtrol =  this.renderRoot.getElementById('EndHourInput')
         let strEndHour = comtrol.value;
         if(isNaN(strEndHour) || (strEndHour < 1 || strEndHour > 12) )
         {
           alert('End Hour is a required numeric value between 1 and 12');
           comtrol.focus();
           return false;
         }

         comtrol = this.renderRoot.getElementById("EndMinuteInput");
         let strEndMinuteInput = comtrol.value;
         if(strEndMinuteInput == "" || isNaN(strEndMinuteInput) || strEndMinuteInput < 0 || strEndMinuteInput > 59 )
         {
           alert('End Minute is a required numeric value between 0 and 59');
           comtrol.focus();
           return false;
         }

         this.data.Session = strAOrB;
         this.data.StartAM_PM = strStatAMOrPM;
         this.data.StartHour = strStartHour;
         this.data.StartMinute = startMinuteInput;
         this.data.EndAM_PM = strEndAMOrPM;
         this.data.EndHour = strEndHour;
         this.data.EndMinute = strEndMinuteInput;

         return true;
      }


      render(){
   return html `

      
    <table
     <tr>
        <td>
         <strong>Session:</strong>
        </td> 
        <td>
          <select id='sessionAorB'>
              <option value=''> </option>
              <option value="A" ?selected=${this.data.Session == 'A'}>A</option>
              <option value="B" ?selected=${this.data.Session == 'B'}>B</option> 
          </select>
        </td> 
     </tr> 
     <tr>
       <td>
        <strong>Start AM/PM:</strong>
       </td>
       <td>
       <select id='startAmOrPM'>
          <option value=''></option>
          <option value="AM" ?selected=${this.data.StartAM_PM == 'AM'}>AM</option>
          <option value="PM" ?selected=${this.data.StartAM_PM == 'PM'}>PM</option> 
        </select>
       </td>
     </tr>
        <tr>        
        <td>  
          <strong>Start Hour:</strong>
        </td>          
        <td>
          <input id="startHourInput" class="form-control" name="hour" type="number" .value=${live(this.data.StartHour)}> 
        </td>
      </tr>
          <tr>
          <td>
              <strong>Start Minute:</strong>
          </td>
          <td>
             <input id="startMinuteInput" class="form-control" name="minute" type="number" .value=${live(this.data.StartMinute)}>
          </td>
       </tr>

       <tr>
       <td>
        <strong>End AM/PM:</strong>
       </td>
       <td>
        <select id='endAmOrPM'>
        <option value=''></option>
        <option value="AM" ?selected=${this.data.EndAM_PM == 'AM'}>AM</option>
        <option value="PM" ?selected=${this.data.EndAM_PM == 'PM'}>PM</option> 
        </select>
       </td>
     </tr>
     <tr>
       <td>
         <strong>End Hour:</strong>
       </td>
       <td>
         <input id="EndHourInput" class="form-control" name="hour" type="number" .value=${live(this.data.EndHour)}> 
       </td>
     </tr>
     <tr>
     <td>
       <strong>End Minute:</strong>
     </td>
     <td>
       <input id="EndMinuteInput" class="form-control" name="minute" type="number" .value=${live(this.data.EndMinute)}>
     </td> 
   </tr>
     
    </table>  
 <br>
 <button @click=${this.Save}>Save</button>
 <button @click=${this.Cancel}>Cancel</button>
   `;
      }
}

customElements.define('singlebell-scheduleedit', SingleBellScheduleEdit);