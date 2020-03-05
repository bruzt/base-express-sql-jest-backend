const { factory } = require('factory-girl');
const faker = require('faker');

const autoRequireAll = require('../../src/util/autoRequireAll');

const models = autoRequireAll(__dirname, '../../src/models');

factory.define('User', models.User, {
    name: faker.name.findName(),
    email: faker.internet.email(),
    age: faker.random.number(),
    password: faker.internet.password()
});

factory.define('Address', models.Address, {
    zipcode: faker.address.zipCode(),
    street: faker.address.streetName(),
    number: faker.random.number()
});

factory.define('Tech', models.Tech, {
    name: faker.commerce.productName()
});

module.exports = factory;