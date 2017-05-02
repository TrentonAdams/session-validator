
function displayTime(result) {
  jQuery('#session-time').text(Math.ceil(result.sessionTime / 60) + 'm or ' +
        result.sessionTime + 's');
};
let sessionValidator = new SessionValidator({validate_url:
  'http://localhost:3000/check-session', refresh_url:
  'http://localhost:3000/refresh-session', check_frequency: 1,
  timeout_url: 'http://localhost:3000/timeout', callback:
  function (result)
  {
    displayTime(result);
    if (result.sessionTime < 60)
    {
      jQuery('#more-time').show();
    }
  }});
sessionValidator.monitor();

/**
 * Below is an example of the use of a session refresh option, if the user's
 * session time drops below 60 seconds.  The "I need more time" button is
 * unhidden if the sessionTime is below 60, as indicated in the callback above.
 */
jQuery(function ()
{
  jQuery('#refresh').unbind('click').bind('click', function(event)
  {
    sessionValidator.refresh();
    jQuery('#more-time').hide();
    displayTime({sessionValid: true, sessionTime: 600});
  });
});
