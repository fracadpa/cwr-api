import request from 'supertest';
import { APP_URL } from '../../utils/constants';

describe('Subscriptions Module', () => {
  const app = APP_URL;
  let userApiToken: string;
  let companyId: number;

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
    companyId = loginResponse.body.user.tenant.company.id;
  });

  it('should retrieve my subscription history: /api/v1/subscriptions/my-history (GET)', async () => {
    const response = await request(app)
      .get('/api/v1/subscriptions/my-history')
      .auth(userApiToken, { type: 'bearer' })
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data[0].id).toBeDefined();
    expect(response.body.data[0].status).toBeDefined();
    expect(response.body.data[0].company.id).toBe(companyId);
  });
});
