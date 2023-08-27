export function GetCalendarDisplay(oCalendarData){
 
    const startDate = new Date(oCalendarData.startYear,oCalendarData.startMonth); 
    const endDate = new Date(startDate);
    endDate.setMonth(oCalendarData.startMonth + 11);

    const dateDisplay = startDate.toLocaleString('en-US', { month: 'long' });
    const dateEndDisplay = endDate.toLocaleString('en-US', { month: 'long' });

    return  dateDisplay + ' ' + startDate.getFullYear() + " - " + dateEndDisplay + " " + endDate.getFullYear();


}

export function TransformFirebaseTimeStampsToDate(monthDataCol){
    monthDataCol.forEach(element => {
        element.firstDateOfTheMonth = element.firstDateOfTheMonth.toDate();
        element.days.forEach(d =>{
            d.day = d.day.toDate();
        })
       });
}

export function CompareDate(a,b)
{
  if(a.StartAM_PM == "AM" || b.StartAM_PM == "PM")
  {
     return -1;
  }
  else if(a.StartAM_PM == "PM" || b.StartAM_PM == "AM")
  {
     return -1;     
  }
  else
  {
    //am = pm, check hours and minute
    let hourDif = a.StartHour - b.StartHour;
    if (hourDif != 0){
      return hourDif;
    }
    return a.StartMinute - b.StartMinute;
  }
}

export function DateForDisplay(dte){
    if(!dte) return ""
    return dte.toLocaleDateString('en-US',{
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}