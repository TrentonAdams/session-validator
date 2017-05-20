/**
 *
 * Copyright 2017 Trenton D. Adams
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */


/**
 * This class defines and implements an HTTP session validator.  It requires a
 * web service which returns a valid JSON session object in the form indicated
 * below  The given service should not manipulate the session in any way, it
 * should simply return information about the session in the specified format.
 * <p/>
 * This class also requires jQuery to be present.
 * <p/>
 * Once a result from the server is obtained, the callback will be called.
 * The jQuery document ready has already been fired at this point, and there
 * is no need to wrap your code in a jQuery(function(){}) block
 *
 * @example
 * // The web service should simply return a json object like this...
 * curl -H 'Accept: application/json' http://localhost:3000/check-session
 * { sessionValid: true, sessionTime: 600 }
 *
 * // The following code will work with the example html snippet at the bottom.
 *   function displayTime(result) {
 *     jQuery('#session-time').text(Math.ceil(result.sessionTime / 60) + 'm or ' +
 *           result.sessionTime + 's');
 *   };
 *   let sessionValidator = new SessionValidator({validate_url:
 *     'http://localhost:3000/check-session', refresh_url:
 *     'http://localhost:3000/refresh-session', check_frequency: 1,
 *     timeout_url: 'http://localhost:3000/timeout', callback:
 *     function (result)
 *     {
 *       displayTime(result);
 *       if (result.sessionTime < 60)
 *       {
 *         jQuery('#more-time').show();
 *       }
 *     }});
 *   sessionValidator.monitor();
 *
 *   jQuery(function ()
 *   {
 *     jQuery('#refresh').unbind('click').bind('click', function(event)
 *     {
 *       sessionValidator.refresh();
 *       jQuery('#more-time').hide();
 *       displayTime({sessionValid: true, sessionTime: 600});
 *     });
 *   });
 *
 * // With the above code, the following will occur...
 * // The "more-time" div will be displayed when less than 1 minute is left in
 * // the session
 *
 * // The "refresh" button can be clicked to refresh the time
 *
 * // The "session-time" will have it's contents replaced with the time left.
 * <div>
 *   <span id="session-message">Your session will expire in:</span>
 *   <span id="session-time"></span>
 * </div>
 * <div id="more-time" style="display:none;">
 *   <button id="refresh" name="I need more time">I need more time</button>
 * </div>
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
   *
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
   * Starts the session monitoring process by using setTimeout().  We get
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
        if ($this.terminate === true)
        {
          return;
        }

        jQuery.get($this.validate_url, function (data)
        {
          //console.log(data);
          $this.callback(data);
          if (!data.sessionValid && $this.timeout_url)
          {
            window.location.href = $this.timeout_url;
          }
        }).fail(function ()
        { // utter failure, let's just try it all again in another minute.
          console.log('an error occurred monitoring the session, stopping, ' +
            'trying again in 60 seconds');
          $this.stop();
          setTimeout(function ()
          { // attempt to start again in 60 seconds
            $this.monitor()
          }, 60000);
        }).done(function ()
        { // success, check again in x seconds.
          $this.intervalId =
            setTimeout(sessionCheck, $this.check_frequency * 1000);
        });
      };

      // check once the first time, and set an interval afterwards
      sessionCheck();
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
    this.terminate = true;
    console.log('monitoring of session stopped');
  }
}

exports.SessionValidator = SessionValidator;
