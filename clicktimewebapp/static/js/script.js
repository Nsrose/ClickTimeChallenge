var apibase = 'https://clicktime.herokuapp.com/api/1.0';
var UserID = null;
var CompanyID = null;
var baseURL = null;

// These won't be available until user has requested them.
var jobs = null;
var clients = null;

// Initialize IDs and baseURL.
$.ajax(apibase + '/session', {
    dataType:'jsonp',
    success: function(response) {
        UserID = response.UserID;
        CompanyID = response.CompanyID;
        baseURL = apibase + "/Companies/" + CompanyID + "/Users/" + UserID;
    }
});

$(document).ready(function(){

    // Function for getting clients and jobs
    $("#task_submit").click(function() {
        var url = baseURL + "/Jobs";
        $.ajax(url, {
            dataType:'jsonp',
            success: function(response) {
                jobs = response;
            }
        })
        var url = baseURL + "/Clients";
        $.ajax(url, {
            dataType:'jsonp',
            success: function(response) {
                clients = response;
            }
        })
    })


});