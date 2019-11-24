window.onload=async function(){
    let innerHTML=""
    let response=await fetch('/auth');
    let idObject=await response.json()
    //console.log(idObject._id)
    let id=idObject._id;


       response = await fetch('/api/event/pendingUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(idObject)
      });
    let eventsWithPendingUsers=await response.json()
    let pendingUsers=[]
    console.log(eventsWithPendingUsers)
    eventsWithPendingUsers.forEach(e => {
        e.users.forEach(u=>{
                     innerHTML+=`<div class='row'>
                    <div class="col"><h2>${u._id.name}</h2></div>
                    <div class="col"><h3>${u._id.email}</h3></div>
                    <div class="col"><h3>${u._id.gender}</h3></div>
                    <div class="col"><span>wants to join ${e.name} event about</span><h3>${e.about}</h3></div>
                    <div class="col"><h3><a id="" class="btn btn-ghost" href='/api/event/assign?event_id=${e._id}&user_id=${u._id._id}'>Accept</a></h3></div>
                    </div>`
        })
    });
    // eventsWithPendingUsers.forEach(e => {
    //     pendingUsers.push(...e.users)
    // });
    // console.log(pendingUsers)
    //  pendingUsers.forEach(p=>{
         
    //      innerHTML+=`<div class='row'>
    //      <div class="col"><h2>${p._id.name}</h2></div>
    //      <div class="col"><h3>${p._id.email}</h3></div>
    //      <div class="col"><h3>${p._id.gender}</h3></div>
    //      <div class="col"><h3><a id="" class="btn btn-ghost" href=''>Accept</a></h3></div>
    //      </div>`

    //    })
     $('#content').html(innerHTML);

    
    
}