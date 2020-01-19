// automated tests for creating users etc.
const app = require('../src/app');
const User = require('../src/models/user');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

// clean up DB before each test
beforeEach(setupDatabase);

test('Should create a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Danielle',
        email: 'Danielle@example.com',
        password: 'MyPass777!',
        age: 14,
        region: 0,
        tier: 0,
        rank: 0,
        rocketid: 'hi',
    }).expect(201);

    // assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Danielle',
            email: 'danielle@example.com'
        },
        token: user.tokens[0].token
    });
    
    // assert that the password was hashed
    expect(user.password).not.toBe('MyPass777!');
    
    // assert that the password was hashed correctly
    const passMatch = await bcrypt.compare('MyPass777!', user.password);
    expect(passMatch).toBe(true);
});

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login non-existent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'thisisnotmypass'
    }).expect(400);
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user.name).toEqual('Jess');
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Philadelphia'
        })
        .expect(400);
});