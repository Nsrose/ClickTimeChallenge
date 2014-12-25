var apibase = 'https://clicktime.herokuapp.com/api/1.0';
var UserID = null;
var CompanyID = null;
var baseURL = null;

// Dictionary of taskIDs to jobs
// Each taskID has a list of valid jobs attached to it.
var jobDict = {};

// Dictionary of client IDs to the clients.
var clientDict = {};

// Initialize IDs and baseURL and jobs and clients.
$.ajax(apibase + '/session', {
    dataType:'jsonp',
    success: function(response) {
        UserID = response.UserID;
        CompanyID = response.CompanyID;
        baseURL = apibase + "/Companies/" + CompanyID + "/Users/" + UserID;
        var url = baseURL + "/Jobs?withChildIDs=true";
        $.ajax(url, {
            dataType:'jsonp',
            success: function(response) {
                for (x in response) {
                    var job = response[x];
                    addToJobDict(job);
                }
            }
        })
        var url = baseURL + "/Clients";
        $.ajax(url, {
            dataType:'jsonp',
            success: function(response) {
                for (x in response) {
                    var client = response[x];
                    addToClientDict(client);
                }
                $("#page_loading").fadeOut(400);
            }
        })
    }
});

// Build up the jobDict diciontary with job JOB.
function addToJobDict(job) {
    var permittedList = job.PermittedTasks.split(",");
    for (x in permittedList) {
        var taskID = permittedList[x];
        if (jobDict[taskID] == null) {
            jobDict[taskID] = [];
        }
        jobDict[taskID].push(job);
    }
}

// Add client CLIENT to the client dictionary, with key ID.
function addToClientDict(client) {
    var id = client.ClientID;
    clientDict[id] = client;
}

// Returns the correct task for the input name, or null
// if there is none.
function processTasks(tasks, input) {
    var task = null;
    for (x in tasks) {
        if (tasks[x].Name.toLowerCase() == input.toLowerCase()) {
            task = tasks[x];
            break;
        }
    }
    return task;
}


$(document).ready(function(){
    // Jobs from the most recent task query
    var jobs = [];
    // Clients from the most recent task query
    var clients = [];
    // A list of all tasks from the first query. If empty, user
    // hasn't clicked "go" yet.
    var allTasks = [];
    // The next numbered div to insert for IDing.
    var nextID = 0;

    // Gets correct task id or raises alert if none. 
    // Filters out clients and jobs accordingly.
    $("#task_submit").click(function() {
        jobs = [];
        clients = [];
        nextID = 0;
        $("#results_container").empty();
        var taskName = $("#task_input").val();
        if (allTasks.length == 0) {
            var url = baseURL + "/Tasks";
            $.ajax(url, {
                dataType:'jsonp',
                success: function(response) {
                    allTasks = response;
                    getResults(taskName);
                }
            })
        } else {
            getResults(taskName);
        }
    })

    // Activate above on enter
    $('#task_input').keypress(function (e) {
        if (e.which == 13) {
            $("#task_submit").click();
            return false;
        }
    });

    // Returns results of a task query.
    function getResults(taskName) {
        var task = processTasks(allTasks, taskName);
        if (task == null) {
            alert("sorry, couldn't find that task");
        } else {
            closeCover();
            var jobs = jobDict[task.TaskID];
            for (x in jobs) {
                var clientID = jobs[x].ClientID;
                clients.push(clientDict[clientID]);
                addResult(jobs[x], clientDict[clientID]);
            }
        }
    }

    // Add result containing a job and a client to the html body
    // in the results container. 
    function addResult(job, client) {
        var $div = $(".result_html .result_box").clone();
        $div.attr('id', "result_box_" + nextID);
        $div.find(".result_job_box .result_item_name").text(job.Name);
        $div.find(".result_client_box .result_item_name").text(client.Name);
        $("#results_container").append($div);
        nextID += 1;
    }

    ///////////////////////////
    ///// Style effects: /////
    /////////////////////////

    // Switch words in search box:
    $(function() {
       var searchs = ["Aerodynamics Design", 'Market Research', "Clay Model",
       "Computer Model Design", "Drafting"];
       var time = setInterval(function() {
           var newSearch = searchs[Math.floor(Math.random()*searchs.length)];
           $('#task_input').attr('placeholder', newSearch);
       },3000);

    });

    // Close the cover and display the results
    function closeCover() {
        $("#cover").css({
            "height":"0px",
        });
        $("#results_container").css({
            "height":"100%",
        })
        $("#search_again").show();
        $("#results_title").fadeIn(400);
    }

    // Reopen the cover and display the search
    $("#search_again").click(function() {
        $("#results_title").fadeOut(400);
        $("#search_again").hide();
        $("#results_container").css({
            "height":"0px",
        })
        $("#cover").css({
            "height":"100%",
        })
    })

    

});