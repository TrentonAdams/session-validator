
let sessionValidator = new SessionValidator(
  'http://localhost:3000/check-session',
  'http://localhost:3000/timeout',
  function (result)
  {
    jQuery('#session-time').text(Math.ceil(result.sessionTime / 60) + 'm or ' +
      result.sessionTime + 's');
  });
sessionValidator.monitor();
