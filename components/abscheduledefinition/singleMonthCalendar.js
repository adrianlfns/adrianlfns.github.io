import {LitElement, html, map,live} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.3.0/all/lit-all.min.js';
import "./singleDayAnswer.js"
 

export class SingleMonthCalendar extends LitElement{


    constructor() {
        super();          
      }     

      static properties = { 
        singleMonthData:{
          firstDateOfTheMonth:null  
        }
      }

      

      RederMonthNumbers(){
          let rows = [];
          let currentDayPointer =0;
          for (let i =0; i<5; i++)
          {            
            var columns = [];
            for (let c = 0; c<5; c++ )
            {

              if (this.singleMonthData.days.length <= currentDayPointer)
              {
                columns.push(html `<td> <strong>&nbsp;</strong>
                <div>
                &nbsp;
               </div> 
               </td>`);
              }
              else
              {
                let oDayPointer = this.singleMonthData.days[currentDayPointer]
                let oDayData = oDayPointer.day;
                if(c + 1 == oDayData.getDay())
                {                
                  columns.push(html `  
                  <td>
                  <singleday-answer .daydata=${oDayPointer}></singleday-answer>                 
                   </td>`);
                  currentDayPointer++;
                }
                else
                {
                  columns.push(html `<td> <strong>&nbsp;</strong>
                  <div>
                  &nbsp;
                 </div> 
                 </td>`);
                }
              } 
            }
            rows.push(html `<tr>${columns}</tr>`);
          }
          return rows;
      }
      
      render() {
        return html `
        <style>
        table{
          margin:5px;
          width:100%;
        }
        table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
        }
 


        
        </style>        
         <table>
            <tr>
              <th style="background:#ADD8E6" colspan=5>
                 ${this.singleMonthData.firstDateOfTheMonth.toLocaleDateString('en-us',{month:"long",year:"numeric"})}
              </th>              
            </tr>
            <tr>
              <th>
              M
              </th>
              <th>
              T
              </th>
              <th>
              W
              </th>
              <th>
              T
              </th>
              <th>
              F
              </th>
            </tr>
            ${this.RederMonthNumbers()}
         </table>
        `;
      }
}
customElements.define('singlemonth-definition', SingleMonthCalendar);