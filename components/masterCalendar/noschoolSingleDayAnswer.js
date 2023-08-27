import {LitElement, html, map,live} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.3.0/all/lit-all.min.js';

export class noschoolSingleDayAnswer extends LitElement{
    constructor() {
        super();          
      }

      static properties = { 
        daydata:{
            day:null,
            dayAnswer:"" 
        }
      }

      answerChange(e, answer){
        if(e.currentTarget.checked)
        {
            this.daydata.dayAnswer = answer;
        }
        else
        {
          this.daydata.dayAnswer = "";
        }
      }

      naChange(e){
        this.answerChange(e,"N/A"); 
      }

      render(){
        let dayDate = this.daydata.day;
        let dayAnswer = this.daydata.dayAnswer;      

        return html `
        <strong>${dayDate.getDate()}</strong>
        <div>
        <input ?checked=${(dayAnswer=='N/A')} @change="${this.naChange}" type="checkbox" name="options${dayDate.getDate()}" id="${dayDate.getDate()}na" autocomplete="off"> 
        <label class="btn btn-outline-success" for="${dayDate.getDate()}na">N/A</label>       
        </div> 
        `;
      }
}
customElements.define('noshcolsingle-day-answer', noschoolSingleDayAnswer);