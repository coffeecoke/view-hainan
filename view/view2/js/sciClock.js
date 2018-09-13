function sciClockInit(){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1aa8ff';
    
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    /* ctx.shadowBlur = 5;
    ctx.shadowColor = '#1aa8ff'; */

    function degToRad(degree) {
        var factor = Math.PI/180;
        return degree*factor;
    }
    
    function renderTime() {
        var now = new Date();
        var today = now.toDateString();
        var time = now.toLocaleTimeString();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var milliseconds = now.getMilliseconds();
        var newSeconds = seconds+ (milliseconds/1000);
    
        // Background
        gradient = ctx.createRadialGradient(200,200,5,200,200,300);
        gradient.addColorStop(0,'#09303a');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0,400,400);
    
        // Hours
        ctx.beginPath();
        ctx.arc(100, 80, 60, degToRad(270), degToRad((hours*30)-90));
        ctx.stroke();
    
        // Minutes
        ctx.beginPath();
        ctx.arc(100, 80, 40, degToRad(270), degToRad((minutes*6)-90));
        ctx.stroke();
        // Seconds
        ctx.beginPath();
        ctx.arc(100, 80, 20, degToRad(270), degToRad((newSeconds*6)-90));
        ctx.stroke();
        // Date 
        ctx.font = "20px Helvetica";
        ctx.fillStyle = '#1aa8ff';
        ctx.fillText(today, 180, 60);
    
        // Time
        ctx.font = "15px Helvetica";
        ctx.fillStyle = '#1aa8ff';
        ctx.fillText(time, 200, 90);
    }
    
    setInterval(renderTime, 40);


}

