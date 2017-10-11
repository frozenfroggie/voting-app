(function () {

    document.addEventListener("DOMContentLoaded", function(event) { 
        var displayName = document.querySelector('#display-name') || null;
        var url = window.location.origin + '/api';
        /*
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("user controller response: " + xhr.response);
                var userObject = JSON.parse(xhr.response);
                if (userObject.displayName !== null) {
                    displayName.innerHTML = userObject['displayName'];
                }
            } else {
                console.error(xhr.response);
            }
        }
      xhr.send();
      */
      window.fetch(url)
            .then( res => {
                console.log(res);
               return res.json(); })
            .then( userObject => {
                console.log(userObject);
                userObject.displayName !== null ? displayName.innerHTML = userObject['displayName'] : "";
                });
    });
    
})();