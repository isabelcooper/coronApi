import {BasicAuthAuthenticator} from "../../src/auth/Authenticator";
import {Method, ReqOf, ResOf} from "http4js";
import {expect} from "chai";
import {Random} from "../../utils/Random";

describe('BasicAuthenticator', () => {

  const validCredentials = {
    username: Random.string('username'),
    password: Random.string('password')
  };

  it('should pass through to underlying handler if auth success', async () => {
    const authenticatedHandler = new BasicAuthAuthenticator(validCredentials)
      .authFilter(async () => ResOf(200, 'success'));
    const encodedCredentials = Buffer.from(`${validCredentials.username}:${validCredentials.password}`).toString('base64');

    const res = await authenticatedHandler.handle(ReqOf(Method.POST, `/`).withHeader('authorization', `Basic ${encodedCredentials}`));
    expect(res.status).to.eql(200);
    expect(res.bodyString()).to.eql('success');
  });

   it('should correctly error if auth fails', async () => {
    const authenticatedHandler = new BasicAuthAuthenticator(validCredentials)
      .authFilter(async () => ResOf(200, 'success'));

    const res = await authenticatedHandler.handle(ReqOf(Method.POST, `/`));

    expect(res.status).to.eql(401);
    expect(res.bodyString()).to.eql('User not authenticated');
  });
});
