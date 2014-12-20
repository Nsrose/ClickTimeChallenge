var apibase = 'https://clicktime.herokuapp.com/api/1.0';
var UserID = null;
var CompanyID = null;
var baseURL = null;

var allJobs = null;
var allClients = null;

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
                allJobs = response;
            }
        })
        var url = baseURL + "/Clients";
        $.ajax(url, {
            dataType:'jsonp',
            success: function(response) {
                allClients = response;
            }
        })
    }
});

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

// Returns true iff a job JOB has a given taskID in its
// permitted tasks lists. 
function containsTask(job, taskID) {
    var permittedList = job.PermittedTasks.split(",");
    for (x in permittedList) {
        if (permittedList[x] == taskID) {
            return true;
        }
    }
    return false;
}


$(document).ready(function(){
    // Jobs from the most recent task query
    var jobs = [];
    // Clients from the most recent task query
    var clients = [];

    // Gets all tasks
    $("#task_submit").click(function() {
        jobs = [];
        clients = [];
        var taskName = $("#task_input").val();
        var url = baseURL + "/Tasks";
        $.ajax(url, {
            dataType:'jsonp',
            success: function(response) {
                var task = processTasks(response, taskName);
                if (task == null) {
                    alert("sorry, couldn't find that task");
                } else {
                    taskID = task.TaskID;
                    for (x in allJobs) {
                        if (containsTask(allJobs[x], taskID)) {
                            jobs.push(allJobs[x]);
                        }
                    }
                    console.log(jobs);
                }
            }
        })
    })

    

});