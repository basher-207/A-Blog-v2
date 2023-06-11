window.addEventListener("wheel", (e)=>{
    if (e.deltaY < -10) {
        $("footer").slideUp();
    }else if(e.deltaY > 10){
        $("footer").slideDown();
    }
});