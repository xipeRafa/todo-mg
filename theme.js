

let lsDarkMode=localStorage.getItem('dark-mode')
const $dark_mode = document.getElementById("dark-mode-container"),
      darkModeActive=_=>{
        $dark_mode.innerHTML=`<button id="dark-mode-active" class="dark-mode-btn">☀</button>`
        document.documentElement.style.setProperty('--first-color','#1a1a2d')
        document.documentElement.style.setProperty('--second-color','#fff')
        document.documentElement.style.setProperty('--b-B-Color','#616061')
        localStorage.setItem('dark-mode',true)
      },
      darkModeDesActive=_=>{
        $dark_mode.innerHTML=`<button id="dark-mode" class="dark-mode-btn">☾</button>`
        document.documentElement.style.setProperty('--first-color','#fff')
        document.documentElement.style.setProperty('--second-color','#fff')
        document.documentElement.style.setProperty('--b-B-Color','white')
        localStorage.removeItem('dark-mode')
      },
      inLocalStorageDarkMode=_=>{
        if(lsDarkMode) darkModeActive()
      }
window.onload=inLocalStorageDarkMode()
document.addEventListener("click",(e)=>{
  if(e.target.matches("#dark-mode")){
    darkModeActive()
  }
  if(e.target.matches("#dark-mode-active")){
    darkModeDesActive()
  }
})



































