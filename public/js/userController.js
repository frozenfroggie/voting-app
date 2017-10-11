(function () {

    document.addEventListener("DOMContentLoaded", function(event) { 
        var displayName = document.querySelector('#display-name') || null;
        var url = window.location.origin + '/api';
        console.log(url);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.response);
                var userObject = JSON.parse(xhr.response);
                if (userObject.displayName !== null) {
                    displayName.innerHTML = userObject['displayName'];
                }
            } else {
                console.error(xhr.response);
            }
        }
      xhr.send();
    });
    
})();