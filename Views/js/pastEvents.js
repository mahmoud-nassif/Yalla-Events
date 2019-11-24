window.onload=async function(){
    let innerHTML=""
    let response=await fetch('/auth');
    let idObject=await response.json()
    //console.log(idObject._id)
    let id=idObject._id;


       response = await fetch('/api/event/pastEvents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(idObject)
      });
    let events=await response.json()
    //console.log(events)
     events.forEach(e=>{
         e.date=new Date(this.parseInt(e.date,10)).getFullYear()+'-'+ new Date(this.parseInt(e.date,10)).getMonth()+'-'+ new Date(this.parseInt(e.date,10)).getDate();
         innerHTML+=`<div class='row'>
         <div class="col"><h2>${e.name}</h2></div>
         <div class="col"><h3>${e.about}</h3></div>
         <div class="col"><h3>${e.date}</h3></div>
         </div>`
         //<div class="col"><h3><a id="" class="btn btn-ghost" href='/api/user/leaveEvent?event_id=${e._id}&user_id=${id}'>Edit</a></h3></div>
     
       })
     $('#content').html(innerHTML);

    
    
}