setTimeout(function(){
    if(document.getElementById('emotion-detect').innerHTML.trim().replace(/&nbsp;/g, '') == 'none'){
        window.location.href = 'http://127.0.0.1:5000/scanned';
    }
    console.log(document.getElementById('emotion-detect').innerHTML.trim().replace(/&nbsp;/g, ''))
 }, 7000);