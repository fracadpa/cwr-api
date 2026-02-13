import request from 'supertest';
import {
  APP_URL,
  TESTER_EMAIL,
  TESTER_PASSWORD,
  MAIL_HOST,
  MAIL_PORT,
} from '../utils/constants';

describe('Auth Module', () => {
  const app = APP_URL;
  const mail = `http://${MAIL_HOST}:${MAIL_PORT}`;
  const newUserFirstName = `Tester${Date.now()}`;
  const newUserLastName = `E2E`;
  const newUserEmail = `User.${Date.now()}@example.com`;
  const newUserPassword = `secret`;
  const newCompanyName = `Company${Date.now()}`;

  describe('Registration', () => {
    it('should fail with exists email: /api/v1/auth/email/register (POST)', () => {
      return request(app)
        .post('/api/v1/auth/email/register')
        .send({
          email: TESTER_EMAIL,
          password: TESTER_PASSWORD,
          firstName: 'Tester',
          lastName: 'E2E',
          companyName: newCompanyName,
        })
        .expect(422)
        .expect(({ body }) => {
          expect(body.errors.email).toBeDefined();
        });
    });

    it('should successfully: /api/v1/auth/email/register (POST)', async () => {
      return request(app)
        .post('/api/v1/auth/email/register')
        .send({
          email: newUserEmail,
          password: newUserPassword,
          firstName: newUserFirstName,
          lastName: newUserLastName,
          companyName: newCompanyName,
        })
        .expect(204);
    });

    describe('Login', () => {
      it('should successfully with unconfirmed email: /api/v1/auth/email/login (POST)', () => {
        return request(app)
          .post('/api/v1/auth/email/login')
          .send({ email: newUserEmail, password: newUserPassword })
          .expect(200)
          .expect(({ body }) => {
            expect(body.token).toBeDefined();
            expect(body.refreshToken).toBeDefined();
            expect(body.tokenExpires).toBeDefined();
            expect(body.user.email).toBeDefined();
            expect(body.user.hash).not.toBeDefined();
            expect(body.user.password).not.toBeDefined();
            expect(body.user.tenant?.id).toBeDefined();
            expect(body.user.activeSubscription?.id).toBeDefined();
          });
      });
    });

    describe('Confirm email', () => {
      it('should successfully: /api/v1/auth/email/confirm (POST)', async () => {
        const hash = await request(mail)
          .get('/email')
          .then(({ body }) =>
            body
              .find(
                (letter) =>
                  letter.to[0].address.toLowerCase() ===
                    newUserEmail.toLowerCase() &&
                  /.*confirm\-email\?hash\=(\S+).*/g.test(letter.text),
              )
              ?.text.replace(/.*confirm\-email\?hash\=(\S+).*/g, '$1'),
          );

        return request(app)
          .post('/api/v1/auth/email/confirm')
          .send({
            hash,
          })
          .expect(204);
      });

      it('should fail for already confirmed email: /api/v1/auth/email/confirm (POST)', async () => {
        const hash = await request(mail)
          .get('/email')
          .then(({ body }) =>
            body
              .find(
                (letter) =>
                  letter.to[0].address.toLowerCase() ===
                    newUserEmail.toLowerCase() &&
                  /.*confirm\-email\?hash\=(\S+).*/g.test(letter.text),
              )
              ?.text.replace(/.*confirm\-email\?hash\=(\S+).*/g, '$1'),
          );

        return request(app)
          .post('/api/v1/auth/email/confirm')
          .send({
            hash,
          })
          .expect(404);
      });
    });
  });

  describe('Login', () => {
    it('should successfully for user with confirmed email: /api/v1/auth/email/login (POST)', () => {
      return request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .expect(200)
        .expect(({ body }) => {
          expect(body.token).toBeDefined();
          expect(body.refreshToken).toBeDefined();
          expect(body.tokenExpires).toBeDefined();
          expect(body.user.email).toBeDefined();
          expect(body.user.hash).not.toBeDefined();
          expect(body.user.password).not.toBeDefined();
          expect(body.user.tenant?.id).toBeDefined();
          expect(body.user.activeSubscription?.id).toBeDefined();
        });
    });
  });

  describe('Logged in user', () => {
    let newUserApiToken: string;
    let newUserRefreshToken: string;

    beforeAll(async () => {
      await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then(({ body }) => {
          newUserApiToken = body.token;
          newUserRefreshToken = body.refreshToken;
        });
    });

    it('should retrieve your own profile: /api/v1/auth/me (GET)', async () => {
      await request(app)
        .get('/api/v1/auth/me')
        .auth(newUserApiToken, {
          type: 'bearer',
        })
        .send()
        .expect(200)
        .expect(({ body }) => {
          expect(body.provider).toBeDefined();
          expect(body.email).toBeDefined();
          expect(body.hash).not.toBeDefined();
          expect(body.password).not.toBeDefined();
          expect(body.tenant?.id).toBeDefined();
          expect(body.activeSubscription?.id).toBeDefined();
        });
    });

    it('should get new refresh token: /api/v1/auth/refresh (POST)', async () => {
      const { token, refreshToken, tokenExpires } = await request(app)
        .post('/api/v1/auth/refresh')
        .auth(newUserRefreshToken, {
          type: 'bearer',
        })
        .send()
        .expect(200)
        .expect(({ body }) => {
          expect(body.token).toBeDefined();
          expect(body.refreshToken).toBeDefined();
          expect(body.tokenExpires).toBeDefined();
        })
        .then(({ body }) => body);

      expect(token).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(tokenExpires).toBeDefined();
    });

    it('should fail on the second attempt to refresh token with the same token: /api/v1/auth/refresh (POST)', async () => {
      const oldRefreshToken = newUserRefreshToken;

      await request(app)
        .post('/api/v1/auth/refresh')
        .auth(oldRefreshToken, {
          type: 'bearer',
        })
        .send();

      await request(app)
        .post('/api/v1/auth/refresh')
        .auth(oldRefreshToken, {
          type: 'bearer',
        })
        .send()
        .expect(401);
    });

    it('should update profile successfully: /api/v1/auth/me (PATCH)', async () => {
      const newUserNewName = Date.now();
      const newUserNewPassword = 'new-secret';

      await request(app)
        .patch('/api/v1/auth/me')
        .auth(newUserApiToken, {
          type: 'bearer',
        })
        .send({
          firstName: newUserNewName,
          password: newUserNewPassword,
        })
        .expect(422);

      await request(app)
        .patch('/api/v1/auth/me')
        .auth(newUserApiToken, {
          type: 'bearer',
        })
        .send({
          firstName: newUserNewName,
          password: newUserNewPassword,
          oldPassword: newUserPassword,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.firstName).toBe(String(newUserNewName));
        });

      await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserNewPassword })
        .expect(200)
        .expect(({ body }) => {
          expect(body.token).toBeDefined();
        });

      await request(app)
        .patch('/api/v1/auth/me')
        .auth(newUserApiToken, {
          type: 'bearer',
        })
        .send({ password: newUserPassword, oldPassword: newUserNewPassword })
        .expect(200);
    });

    it('should update profile email successfully: /api/v1/auth/me (PATCH)', async () => {
      const newUserFirstNameForEmailUpdate = `Tester${Date.now()}`;
      const newUserLastNameForEmailUpdate = `E2E`;
      const newUserEmailForEmailUpdate = `user.${Date.now()}@example.com`;
      const newUserPasswordForEmailUpdate = `secret`;
      const newUserNewEmail = `new.${newUserEmailForEmailUpdate}`;

      await request(app)
        .post('/api/v1/auth/email/register')
        .send({
          email: newUserEmailForEmailUpdate,
          password: newUserPasswordForEmailUpdate,
          firstName: newUserFirstNameForEmailUpdate,
          lastName: newUserLastNameForEmailUpdate,
          companyName: `Company${Date.now()}`,
        })
        .expect(204);

      const newUserApiTokenForEmailUpdate = await request(app)
        .post('/api/v1/auth/email/login')
        .send({
          email: newUserEmailForEmailUpdate,
          password: newUserPasswordForEmailUpdate,
        })
        .then(({ body }) => body.token);

      await request(app)
        .patch('/api/v1/auth/me')
        .auth(newUserApiTokenForEmailUpdate, {
          type: 'bearer',
        })
        .send({
          email: newUserNewEmail,
        })
        .expect(200);

      const hash = await request(mail)
        .get('/email')
        .then(({ body }) =>
          body
            .find((letter) => {
              return (
                letter.to[0].address.toLowerCase() ===
                  newUserNewEmail.toLowerCase() &&
                /.*confirm\-new\-email\?hash\=(\S+).*/g.test(letter.text)
              );
            })
            ?.text.replace(/.*confirm\-new\-email\?hash\=(\S+).*/g, '$1'),
        );

      await request(app)
        .get('/api/v1/auth/me')
        .auth(newUserApiTokenForEmailUpdate, {
          type: 'bearer',
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.email).not.toBe(newUserNewEmail);
        });

      await request(app)
        .post('/api/v1/auth/email/login')
        .send({
          email: newUserNewEmail,
          password: newUserPasswordForEmailUpdate,
        })
        .expect(422);

      await request(app)
        .post('/api/v1/auth/email/confirm/new')
        .send({
          hash,
        })
        .expect(204);

      await request(app)
        .get('/api/v1/auth/me')
        .auth(newUserApiTokenForEmailUpdate, {
          type: 'bearer',
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.email).toBe(newUserNewEmail);
        });

      await request(app)
        .post('/api/v1/auth/email/login')
        .send({
          email: newUserNewEmail,
          password: newUserPasswordForEmailUpdate,
        })
        .expect(200);
    });

    it('should delete profile successfully: /api/v1/auth/me (DELETE)', async () => {
      const newUserEmailForDelete = `user.delete.${Date.now()}@example.com`;
      const newUserPasswordForDelete = `secret`;

      await request(app)
        .post('/api/v1/auth/email/register')
        .send({
          email: newUserEmailForDelete,
          password: newUserPasswordForDelete,
          firstName: 'Delete',
          lastName: 'User',
          companyName: `CompanyDelete${Date.now()}`,
        })
        .expect(204);

      const newUserApiTokenForDelete = await request(app)
        .post('/api/v1/auth/email/login')
        .send({
          email: newUserEmailForDelete,
          password: newUserPasswordForDelete,
        })
        .then(({ body }) => body.token);

      await request(app)
        .delete('/api/v1/auth/me')
        .auth(newUserApiTokenForDelete, {
          type: 'bearer',
        })
        .expect(204);

      return request(app)
        .post('/api/v1/auth/email/login')
        .send({
          email: newUserEmailForDelete,
          password: newUserPasswordForDelete,
        })
        .expect(422);
    });
  });
});
