
var tablinks = document.getElementsByClassName("tab-links")
var tabcontents = document.getElementsByClassName("tab-contents")
function opentab(tabname){
    for(tablink of tablinks){
        tablink.classList.remove("active-links");
    }
    for(tabcontent of tabcontents){
        tabcontent.classList.remove("tab-active");
    }
    event.currentTarget.classList.add("active-links");
    document.getElementById(tabname).classList.add("tab-active")
}
var sidemeu = document.getElementById("sidemenu")
function openmenu(){
    sidemeu.style.right ="0";
}
function closemenu(){
    sidemeu.style.right ="-200px";
}
// const scriptURL = 'https://script.google.com/macros/s/AKfycbysepLTVAQnh5dcnywRx8IX5OsNYl_h_pxeq9AEdBUIGrQ6iRf_K95B8K84AC4ZYvie/exec'
// const form = document.forms['submit-to-google-sheet']
// const msg = document.getElementById("msg")
// form.addEventListener('submit', e => {
//   e.preventDefault()
//   fetch(scriptURL, { method: 'POST', body: new FormData(form)})
//     .then(response => {
//         msg.innerHTML = "Message sent successfully !!!!"
//         setTimeout(function(){
//             msg.innerHTML = ""
//         },5000)
//         form.reset()
//     })
//     .catch(error => console.error('Error!', error.message))
// })
