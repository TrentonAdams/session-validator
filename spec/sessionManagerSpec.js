describe("SessionManager tests", function ()
{
  let sessionManager = require('../app/session_manager').SessionManager;
  sessionManager.startSession();

  it("SessionTimer running", function (done)
  {
    setTimeout(function()
    {
      expect(sessionManager.session.sessionValid).toBe(true);
      expect(sessionManager.session.sessionTime).toEqual(599);
      done();
    }, 1020);
  });

  it("Expire Session working", function (done)
  {
    sessionManager.expireSession();
    expect(sessionManager.session.sessionTime).toEqual(0);
    expect(sessionManager.session.sessionValid).toBe(false);
    setTimeout(function()
    {
      expect(sessionManager.terminate).toBe(false);
      done();
    }, 1000);
  });
});
