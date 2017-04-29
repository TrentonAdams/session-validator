/**
 * This class defines and implements an HTTP session validator.  It requires a
 * web service which returns a valid JSON session object in the form
 * { sessionValid: true, sessionTime: 600 }.  The given service should not
 * manipulate the session in any way, it should simply return information about
 * the session in the specified format.
 * <p/>
 * This class also requires jQuery to be present.
 * <p/>
 * Once a result from the server is obtained, the callback will be called.
 * The jQuery document ready has already been fired at this point, and there
 * is no need to wrap your code in a jQuery(function(){}) block
 */
class SessionValidator {
  /**
   * Setup the SessionValidator.
   *
   * @param validate_url The GET url which returns a proper JSON session object
   * instance
   * @param timeout_url The url you'd like to redirect to when the session times
   * out.
   * @param callback The callback in the form "function(result){}", where
   * result is in the form { sessionValid: true, sessionTime: 600}
   */
  constructor(validate_url, timeout_url, callback)
  {
    this.validate_url = validate_url;
    this.timeout_url = timeout_url;
    this.intervalId = -1;
    this.callback = callback;
  }

  /**
   * Starts the session monitoring process by using setInterval().  We get
   * the session time left every 10 seconds, subsequently calling the callback.
   */
  monitor()
  {
    console.log('monitoring session');
    let $this = this;
    jQuery(function ()
    {
      //console.log(selector);
      let sessionCheck = function ()
      {
        jQuery.get('http://localhost:3000/check-session', function (data)
        {
          // display minutes for now.
          // if it's less than a minute, we should display seconds?
          //console.log(data);
          $this.callback(data)
          if (!data.sessionValid && $this.timeout_url)
          {
            window.location.href = $this.timeout_url;
          }
        }).fail(function ()
        {
          console.log('an error occurred monitoring the session, stopping, ' +
            'trying again in 60 seconds');
          $this.stop();
          setTimeout(function ()
          { // attempt to start again in 60 seconds
            $this.monitor()
          }, 60000);
        });
      };
      sessionCheck();

      $this.intervalId = setInterval(sessionCheck, 10000);
    });
  }

  /**
   * Stops the session monitoring by clearing the monitor.
   */
  stop()
  {
    clearInterval(this.intervalId);
    console.log('monitoring of session stopped');
  }
}
