import {LitElement, html, map,live} from 'https://cdn.jsdelivr.net/gh/lit/dist@2.3.0/all/lit-all.min.js';
import { buttonStyles } from './buttonStyles.js'; 

export class singleDayAnswer extends LitElement{

    constructor() {
        super();          
      }

      static styles = [buttonStyles];


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
      }
      
      naChange(e){
        this.answerChange(e,"N/A"); 
      }

      aChange(e){
        this.answerChange(e,"A"); 
      } 

      bChange(e){
        this.answerChange(e,"B");
      } 

      render() {
        let dayDate = this.daydata.day;
        let dayAnswer = this.daydata.dayAnswer;      

        return html `
        <strong>${dayDate.getDate()}</strong>
        <div>
        <input ?checked=${(dayAnswer=='N/A')} @change="${this.naChange}" type="radio" class="btn-check" name="options${dayDate.getDate()}" id="${dayDate.getDate()}na" autocomplete="off"> 
        <label class="btn btn-outline-success" for="${dayDate.getDate()}na">N/A</label>

        <input ?checked=${(dayAnswer=='A')} @change="${this.aChange}" type="radio" class="btn-check" name="options${dayDate.getDate()}" id="${dayDate.getDate()}A" autocomplete="off">
        <label class="btn btn-outline-success" for="${dayDate.getDate()}A">A</label>

        <input ?checked=${(dayAnswer=='B')} @change="${this.bChange}" type="radio" class="btn-check" name="options${dayDate.getDate()}" id="${dayDate.getDate()}B" autocomplete="off">
        <label class="btn btn-outline-success" for="${dayDate.getDate()}B">B</label>        
        </div> 
        `;
      }

}
customElements.define('singleday-answer', singleDayAnswer);