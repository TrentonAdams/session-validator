/**
 * We're only simulating sessions here, so this is just a hack to get the job
 * done.
 */
let express = require('express'),
  router = express.Router();

/**
 * Simulates a session.  There are four primary functions.
 *
 */
class SessionManager
{
  constructor()
  {
    this.randomNumber = Math.random();
    this.instanceRequests = 1;
    this.session = {
      sessionValid: true,
      sessionTime: 600,
    };
    this.terminate = false;
  }

  /**
   * The sessionCounter
    * is used with setTimeout() to repeatedly decrement the session time.  Ideally,
    * we'd look at the start time of the session time.
   */
  sessionCounter()
  {
    //console.log('.');
    if (sessionManager.terminate)
    {
      clearTimeout(sessionManager.intervalVariable);
      sessionManager.intervalVariable = undefined;
      sessionManager.terminate = false;
      sessionManager.session.sessionValid = false;
      sessionManager.session.sessionTime = 0;
      return;
    }

    sessionManager.session.sessionTime--;
    //intervalVariable = setInterval(sessionCounter, 1000);
  };

  /**
   * startSession() starts the 1 second calls of sessionCounter().
   */
  startSession()
  {
    if (this.intervalVariable === undefined)
    {
      console.log("setting up session timer");
      sessionManager.session.sessionValid = true;
      sessionManager.session.sessionTime = 600;
      this.intervalVariable = setInterval(this.sessionCounter, 1000);
    }
  };

  /**
   * expireSession() expires the session and requests termination of
   * sessionCounter().
   */
  expireSession()
  {
    //console.log("expiring session timer");
    this.session = {
      sessionValid: false,
      sessionTime: 0
    };
    this.terminate = true;
  };
}
// singleton not really needed, since require() caches modules.
let sessionManager = undefined;
if (sessionManager === undefined)
{
  //console.log('construct SessionManager');
  sessionManager = new SessionManager();
}
else
{
  sessionManager.instanceRequests++;
  //console.log("Not constructing session manager" + sessionManager);
}

console.log("session manager id: " + sessionManager.randomNumber);
module.exports.SessionManager = sessionManager;

