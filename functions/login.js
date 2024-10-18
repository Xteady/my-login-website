const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function(event, context) {
  try {
    await client.connect();
    const database = client.db('your_database_name');
    const users = database.collection('users');

    const { username, password } = JSON.parse(event.body);

    const user = await users.findOne({ username });

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: '用户名或密码错误' })
      };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: '用户名或密码错误' })
      };
    }

    // 返回用户信息，但不包括密码
    const { password: _, ...userWithoutPassword } = user;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: '登录成功', 
        user: userWithoutPassword 
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '登录失败', error: error.message })
    };
  } finally {
    await client.close();
  }
};
