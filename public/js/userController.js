(function () {

    document.addEventListener("DOMContentLoaded", function(event) { 
        var displayName = document.querySelector('#display-name') || null;
        var url = window.location.origin + '/api';
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
      
      /* why not work???
     window.fetch(url)
        .then( res => res.json() )
        .then( userObject => userObject.displayName !== null ? displayName.innerHTML = userObject['displayName'] : "" );
    });
    */ 
    
})();