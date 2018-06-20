let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});
if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      //registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  }else {
    console.log('No service-worker on this browser');
  }
if(!window.indexedDB){
                window.alert('your browser does not support this app please update');
            }else{
                var db;
 var connection = window.indexedDB.open("Library", 1);
 connection.onerror = function(obj){
   console.log("Error opening DB", obj);
 }
 connection.onupgradeneeded   = function(obj){
   db = obj.target.result;
   var objectStore = db.createObjectStore("tasks", { keyPath : "id",autoIncrement:true});
    objectStore.createIndex("name","name",{unique:true});
 };
 connection.onsuccess  = function(obj){
   db = obj.target.result;
     showRecords();
 }
 
 function addData(){
     var box = document.getElementById("data").value;
   var transaction = db.transaction(["tasks"],"readwrite");
   var objectStore = transaction.objectStore("tasks");
     var obj = {
         name:box
     }
     objectStore.add(obj);
   transaction.oncomplete = function(obj) {
     console.log("Transaction Successful.");
       window.location.href = "index.html";
   };
 
   transaction.onerror = function(obj) {
     console.log("Error In Transaction.");
   };  
 }
}
    function showRecords(){
        var transaction = db.transaction(["tasks"],"readwrite");
   var objectStore = transaction.objectStore("tasks");
        var index = objectStore.index('name');
        var output=  '';
        index.openCursor().onsuccess = function(e){
            var cursor = e.target.result;
            if(cursor){
                // output+=cursor.value.id;
                output+="<h1 class='name'>"
                output+=cursor.value.name;
                output+="<spam class='right'>";
                output+="<a href='' onclick= 'removeTask("+cursor.value.id+")'>Delete</a>";
                output+="</spam></h1>";
                cursor.continue();
            }
          var p = document.getElementById("paste");
            p.innerHTML = output;
        }
    }
    function clearRec(){
        indexedDB.deleteDatabase('Library');
        console.log('clearing everything');
        window.location.href= "index.html";
    }
     function makeVisible(){
         var box1 = document.getElementsByClassName("container");
         box1[0].style.visibility = "visible";
         var box2 = document.getElementById("data");
         box2.focus();
         console.log('making visible');
     }
function changeNothing(){
    var box1 = document.getElementsByClassName("container");
         box1[0].style.visibility = "hidden";
}
function removeTask(id){
    var transaction = db.transaction(["tasks"],"readwrite");
   var objectStore = transaction.objectStore("tasks");
    var request = objectStore.delete(id);
    request.onsuccess = function(){
        console.log('customer'+id+'deleted');
        window.location.href = "index.html";
    }
}