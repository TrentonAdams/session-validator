/**
 * We're only simulating sessions here, so this is just a hack to get the job
 * done.
 */
let express = require('express'),
  router = express.Router();

class SessionManager
{
  constructor()
  {
    this.randomNumber = Math.random();
    this.session = {
      sessionValid: true,
      sessionTime: 600
    };
    this.terminate = false;
  }

  sessionCounter()
  {
    //console.log('.');
    if (sessionManager.terminate)
    {
      clearTimeout(sessionManager.intervalVariable);
      sessionManager.intervalVariable = undefined;
      sessionManager.terminate = false;
      sessionManager.session.sessionValid = true;
      sessionManager.session.sessionTime = 600;
      return;
    }

    sessionManager.session.sessionTime--;
    //intervalVariable = setInterval(sessionCounter, 1000);
  };

  startSession()
  {
    if (this.intervalVariable === undefined)
    {
      console.log("setting up session timer");
      this.intervalVariable = setInterval(this.sessionCounter, 1000);
    }
  };

  expireSession()
  {
    console.log("expiring session timer");
    this.session = {
      sessionValid: false,
      sessionTime: 0
    };
    this.terminate = true;
  };
}
// singleton
let sessionManager = undefined;
if (sessionManager === undefined)
{

  console.log('construct SessionManager');
  sessionManager = new SessionManager();
}
else
{
  console.log("Not constructing session manager" + sessionManager);
}

console.log("session manager id: " + sessionManager.randomNumber);
module.exports.SessionManager = sessionManager;

