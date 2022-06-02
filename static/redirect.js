var record = true;

$("#stopRecord").click(function (e) {
    e.preventDefault();
    if (record) {
        record = false;
        $("#stopRecord").text("Start camera");
        $("#camera_div").fadeOut();
    } else {
        record = true
        $("#stopRecord").text("Stop camera");
        $("#camera_div").fadeIn();
    }

});

const interval = setInterval(function () {
    if(record){
        fetch('http://127.0.0.1:5000/getMood').then(response => {
            response.text().then(responseNew => {
                document.getElementById('emotion-detect').innerHTML = responseNew;
            })
        })
    } else {
        document.getElementById('emotion-detect').innerHTML = "camera_stop";
    }
   
}, 1000);

 //clearInterval(interval); 
