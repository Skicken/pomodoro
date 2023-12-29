import axios from 'axios';

const getTokenData = async (
  login,
  password
) => {
  return (
   await axios.post(`/api/auth/login`, {
      username: login,
      password: password,
    },
    )
  );
};


describe('Login user', () => {
  it('login johnny', async () => {
    const res = await axios.post(`/api/auth/login`, {
      username: 'johnny@gmail.com',
      password: 'johnny',
    });
    expect(res.status).toBe(201);
    expect(res.data.access_token).toBeDefined();
  });
  it('invalid johnny login', async () => {
    await axios
      .post(`/api/auth/login`, {
        username: 'johnny123@gmail.com',
        password: 'johnny',
      })
      .catch(function (error) {
        if (error.response) {
          expect(error.response.status).toBe(401);
        } else {
          fail();
        }
      });
  });

  it('get account info', async () => {
    const tokenData = (await getTokenData('johnny@gmail.com', 'johnny')).data;
    expect(tokenData.access_token).toBeDefined();

    const user = (
      await axios.get('/api/user/2', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })
    ).data;
    expect(user).toBeDefined();
  });


  it('refresh token', async () => {
    const tokenData = await getTokenData('johnny@gmail.com', 'johnny');
    expect(tokenData.data.access_token).toBeDefined();
    const newTokenData = (
      await axios.post('/api/auth/refresh')
    ).data;
    expect(newTokenData).toBeDefined();
  });


});
