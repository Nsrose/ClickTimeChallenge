var apibase = 'https://clicktime.herokuapp.com/api/1.0';
$.ajax(apibase + '/session', {
    dataType:'jsonp',
    success: function(response) { 
        $('#email').html(response.UserEmail);
        $('#name').html(response.UserName);
    }
});