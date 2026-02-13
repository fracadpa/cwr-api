import request from 'supertest';
import { APP_URL } from '../../utils/constants';

describe('Plans Module', () => {
  const app = APP_URL;
  let userApiToken: string;

  beforeAll(async () => {
    const newUserEmail = `user.${Date.now()}@example.com`;
    const newUserPassword = `secret`;
    const newCompanyName = `Company${Date.now()}`;

    await request(app)
      .post('/api/v1/auth/email/register')
      .send({
        email: newUserEmail,
        password: newUserPassword,
        firstName: 'Test',
        lastName: 'User',
        companyName: newCompanyName,
      })
      .expect(204);

    const loginResponse = await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: newUserEmail, password: newUserPassword })
      .expect(200);

    userApiToken = loginResponse.body.token;
  });

  it('should list available plans: /api/v1/plans (GET)', async () => {
    const response = await request(app)
      .get('/api/v1/plans')
      .auth(userApiToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
  });
});
