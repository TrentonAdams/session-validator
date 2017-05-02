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
   * @param {Object} options
   * @param {String} options.validate_url The GET url which returns a proper
   * JSON session object instance
   * @param {String} options.refresh_url The url you'd like to support
   * refreshing the session. null if you do not need this functionality.  See
   * the refresh() method for more information.
   * @param {String} options.timeout_url The url you'd like to redirect to when
   * the session times
   * out. nul if you do not need this functionality.
   * @param {String} options.callback The callback in the form
   * "function(result){}", where
   * result is in the form { sessionValid: true, sessionTime: 600}
   * @param {String} options.check_frequency How often should the session
   * check web service be called, in seconds.
   */
  constructor(options)
  {
    let internalOptions = {check_frequency: 10};
    jQuery.extend(internalOptions, options);
    this.validate_url = internalOptions.validate_url;
    this.refresh_url = internalOptions.refresh_url;
    this.timeout_url = internalOptions.timeout_url;
    this.intervalId = -1;
    this.callback = internalOptions.callback;
    this.check_frequency = internalOptions.check_frequency;
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
      /**
       * Checks if the session is valid by making an ajax call to the session
       * validate url.
       */
      let sessionCheck = function ()
      {
        jQuery.get($this.validate_url, function (data)
        {
          //console.log(data);
          $this.callback(data);
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

      // check once the first time, and set an interval afterwards
      sessionCheck();

      $this.intervalId = setInterval(sessionCheck, $this.check_frequency * 1000);
    });
  }

  /**
   * The refresh url should accept a simple empty post, with no parameters.
   */
  refresh()
  {
    let $this = this;
    if ($this.refresh_url)
    {
      jQuery(function ()
      {
        jQuery.post($this.refresh_url);
      });
    }
  }

  /**
   * Stops the session monitoring by using clearInterval().
   */
  stop()
  {
    clearInterval(this.intervalId);
    console.log('monitoring of session stopped');
  }
}
