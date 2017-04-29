/**
 * This class defines and implements an HTTP session validator.  It requires a
 * web service which returns a valid JSON session object in the form
 * { sessionValid: true, sessionTime: 600, }.  The given service should not
 * manipulate the session in any way, it should simply return information about
 * the session.
 * <p/>
 * This class also requires jQuery to be present.
 * <p/>
 * A jQuery element will have it's HTML updated to include the number of
 * seconds left in the session.  when sessionValid is false, a redirect will
 * occur to the timeout_url.
 * <p/>
 * It is important to note that any styling or prefix wording should be
 * controlled by the page designer, we do nothing except inject the number
 * of seconds left in the session.
 */
class SessionValidator {
  /**
   *
   * @param validate_url The GET url which returns a proper JSON session object
   * instance
   * @param timeout_url The url you'd like to redirect to when the session times
   * out.
   * @param monitor_element_selector The jQuery css selector for the element
   * who's contents should be replaced.  If some other code should be ran
   * when this happens, you the developer sould monitor it's "change" event.
   */
  constructor(validate_url, timeout_url, monitor_element_selector)
  {
    this.validate_url = validate_url;
    this.timeout_url = timeout_url;
    this.monitor_element_selector = monitor_element_selector;
  }

  /**
   * Starts the session monitoring process by using setTimeout().
   */
  monitor()
  {
  }

  /**
   * Stops the session monitoring by clearing the monitor.
   */
  stop()
  {
  }


}
