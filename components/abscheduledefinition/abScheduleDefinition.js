import {LitElement, html, map,live} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.3.0/all/lit-all.min.js';  
import './singleMonthCalendar.js'

export class ABScheduleDefinition extends LitElement{
 
    constructor() {
        super();
      }

      SetMonthData(md){
        this.monthData = md;
        this.requestUpdate();
      }

      static properties = {
        monthsData:[]
      }

      render() {  

        return html `
        <style>
          * {
          box-sizing: border-box;
        }      
        .row {
          margin-left:-5px;
          margin-right:-5px;
        }  
        .column {
          float: left;
          width: 50%;
          padding: 5px;
        }      

        .row::after {
          content: "";
          clear: both;
          display: table;
        }
        </style>        
               
        ${map(this.monthData, (item,i) => html `
        <div class="${(i%2)==0?"row":""}"></div>
        <singlemonth-definition class="column" style="max-width:500px" .singleMonthData=${item}></singlemonth-definition>

        `)}
  `;
}
} 
customElements.define('abschedule-definition', ABScheduleDefinition);