import {LitElement, html, map,live} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.3.0/all/lit-all.min.js'; 
import './singleBellScheduleEdit.js'
export class BellScheduleDefinition extends LitElement{
    constructor() {
        super(); 
        this.bellSchedules=[] 
      }

      static properties = { 
        bellSchedules:[] 
      }


      /*BackToABSchedule()
      {
        let event = new CustomEvent("backToAbSchedule",{
            bubbles: true, composed: true
           });
           this.dispatchEvent(event);
      }*/

     /* CollectDataAndShowMeetingDates()
      {
        let event = new CustomEvent("collectDataAndShowMeetingDates",{
            bubbles: true, composed: true
           });
           this.dispatchEvent(event);
      }*/

      addSchedule()
      {
        this.renderRoot.getElementById('bellScedule').style.display = 'none';        
        this.renderRoot.getElementById('controls').style.display = 'none';

        let bellEdit =  this.renderRoot.getElementById('singleBellSchedule');
        bellEdit.style.display ='block';
        let singleScheduleObject = {Session: 'A', 
                                    StartAM_PM: 'AM', 
                                    StartHour:null, 
                                    StartMinute:null,
                                    EndAM_PM:'AM'};
        bellEdit.data = singleScheduleObject;
        bellEdit.SetFocus();
      }

      saveSingleBellEdit(e){
        let data = e.detail.data;
        if(!data.id || data.id <=0 )
        {
          //add the data
          data.id = this.bellSchedules.length + 1;
          this.bellSchedules.push(data);
        }
        this.requestUpdate();
        this.hideEditor();
        this.NotifyBellScheduleChanged()
      }

      NotifyBellScheduleChanged(){
        let event = new CustomEvent("bellScheduleChanged",{
          bubbles: true, composed: true
         });
         this.dispatchEvent(event);
      }

      hideEditor(){
        this.renderRoot.getElementById('bellScedule').style.display = '';        
        this.renderRoot.getElementById('controls').style.display = '';
        this.renderRoot.getElementById('singleBellSchedule').style.display = 'none';
      }

      EditSchedule(e){
        let key =  e.currentTarget.dataset.key;
        let intElementIndex = this.bellSchedules.findIndex(p => p.id == key);
        this.renderRoot.getElementById('bellScedule').style.display = 'none';        
        this.renderRoot.getElementById('controls').style.display = 'none';
        let bellEdit =  this.renderRoot.getElementById('singleBellSchedule');
        bellEdit.style.display ='block';
        bellEdit.data = this.bellSchedules[intElementIndex];
        bellEdit.SetFocus();
      }

      DeleteSchedule(e){
       let key =  e.currentTarget.dataset.key;
       let intElementIndex = this.bellSchedules.findIndex(p => p.id == key);
       this.bellSchedules.splice(intElementIndex,1);
       this.requestUpdate();
       this.NotifyBellScheduleChanged();
      }

      cancelBellScheduleEdit(){
        this.hideEditor();
      }

    render ()
    {
        
        return html `
    
        <style>
        table{
          margin:5px; 
        }
        table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
        }
        </style>        
        <table id="bellScedule">
         <tr style="background:#ADD8E6">
           <th style="width:180px">
             Meeting Type (A/b)
           </th>
           <th style="width:180px">
             Start Time
           </th>
           <th style="width:180px">
             End Time
           </th>
           <th style="width:40px">
            
           </th>
           <th style="width:40px">
              
           </th>
         </tr>

         ${map(this.bellSchedules, (item) => html `

         <tr>
           <td>
           ${item.Session}
           </td>
           <td>
           ${item.StartHour}:${item.StartMinute.padStart(2,'0')} ${item.StartAM_PM}
           </td>
           <td>
           ${item.EndHour}:${item.EndMinute.padStart(2,'0')} ${item.EndAM_PM}
           </td>
           <td> 
             <button @click=${this.EditSchedule} data-key="${item.id}">Edit</button>             
           </td>
           <td>    
             <button @click=${this.DeleteSchedule} data-key="${item.id}">Delete</button>          
           </td>
         </tr>         
         `)}

        </table>
        <singlebell-scheduleedit id="singleBellSchedule" hidden @saveSingleBellEdit=${this.saveSingleBellEdit} @cancellSingleBellEdit=${this.cancelBellScheduleEdit}   ></singlebell-scheduleedit>
       
        <div id="controls">
          <button @click="${this.addSchedule}">Add</button>
          <br> 
          
          <br>
          <div style="clear: both;"> 
          </div>        
        </div>
        `;
    }
}
customElements.define('bellschedule-definition', BellScheduleDefinition);