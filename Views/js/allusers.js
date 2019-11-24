window.onload=async function(){
    let innerHTML=""
    let response=await fetch('/auth');
    let idObject=await response.json()
    //console.log(idObject._id)
    let id=idObject._id;


       response = await fetch('/api/user/allUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(idObject)
      });
    let users=await response.json()
    users.forEach(u => {
                     innerHTML+=`<div class='row'>
                    <div class="col"><h2>${u.name}</h2></div>
                    <div class="col"><h3>${u.email}</h3></div>
                    <div class="col"><h3>${u.gender}</h3></div>
                    <div class="col"><h3><a id="" class="btn btn-ghost" href='/api/user/viewEvents?_id=${u._id}'>view users</a></h3></div>
                    </div>`
    });
     $('#content').html(innerHTML);

    
    
}