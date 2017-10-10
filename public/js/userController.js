(function () {

    var displayName = document.querySelector('#display-name') || null;
    var appUrl = window.location.origin + '/api/:id';
           
    document.addEventListener("DOMContentLoaded", function(event) { 
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                console.log(xmlhttp.response);
                var userObject = JSON.parse(xmlhttp.response);
                if (userObject.displayName !== null) {
                    displayName.innerHTML = userObject['displayName'];
                }
            }
        };
      xmlhttp.open('GET', appUrl, true);
      xmlhttp.send();
    });
    
})();