var moment = require('moment');
module.exports = function(router, request, async, config) {

  router.get('/issues', function(req, res) {

      var issuesObject = {};
      var countOfIssues = 0; //Total number of open issues
      var countOfIssuesInLastDay = 0; //Number of open issues that were opened in the last 24 hours
      var countOfIssuesInBetween = 0; //Number of open issues that were opened more than 24 hours ago but less than 7 days ago
      var countOfIssuesOld = 0; //Number of open issues that were opened more than 7 days ago

      var getIssues = function(pageCounter) {

        var now = moment();
        var timePast24Hours = moment(now).subtract(24, 'hours');
        var timePast7days = moment(now).subtract(7, 'days');

        //Making the api call to github API
        request({
            url: 'https://api.github.com/repos/' + req.query.username + '/' + req.query.reponame + '/issues?state=open' + '&page=' + pageCounter + '&client_id=' + config.CLIENT_ID + '&' + 'client_secret=' + config.CLIENT_SECRET,
            headers: { 'user-agent': 'issueTracker' },
            json: true
        }, function(error, response, body) {
              if(!error && response.statusCode === 200) {
                  for(var issueIndex = 0; issueIndex < body.length; issueIndex++) {
                    if(!body[issueIndex].pull_request) {
                      countOfIssues = countOfIssues + 1;
                      var issueDate = body[issueIndex].created_at;
                      if(moment(issueDate).isAfter(timePast24Hours)){
                        countOfIssuesInLastDay = countOfIssuesInLastDay + 1;
                      }else if(moment(issueDate).isBetween(timePast7days, timePast24Hours)){
                        countOfIssuesInBetween = countOfIssuesInBetween + 1;
                      }else if(moment(issueDate).isBefore(timePast7days)){
                        countOfIssuesOld = countOfIssuesOld + 1;
                      }
                      issuesObject['countOfIssues'] = countOfIssues;
                      issuesObject['countOfIssuesInLastDay'] = countOfIssuesInLastDay;
                      issuesObject['countOfIssuesInBetween'] = countOfIssuesInBetween;
                      issuesObject['countOfIssuesOld'] = countOfIssuesOld;
                    }
                  }
                  if(body.length < 30) {
                      res.send(issuesObject);
                  } else {
                      getIssues(pageCounter + 1);
                  }
              }
        });
      };
      getIssues(1);
  });
};
