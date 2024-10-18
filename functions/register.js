const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function(event, context) {
  try {
    await client.connect();
    const database = client.db('your_database_name');
    const users = database.collection('users');

    const { username, email, password } = JSON.parse(event.body);

    const existingUser = await users.findOne({ username });
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: '用户名已存在' })
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      username,
      email,
      password: hashedPassword
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ message: '注册成功', userId: result.insertedId })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '注册失败', error: error.message })
    };
  } finally {
    await client.close();
  }
};
