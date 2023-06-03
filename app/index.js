'use strict';

const restify = require('restify');
const testDb = (res, hostId) => {
  const option = {
    host    : 'mysql-service',
    user    : 'root',
    password: '12345678',
    charset : 'utf8mb4',
    connectTimeout: 3000,
    dateStrings   : true
  };
  const mysql = require('mysql');
  const connection = mysql.createConnection(option);
  connection.connect(err => {
    if (err) {
      console.error('error connecting: %s', err.stack);
      return;
    }
    console.log('connected as id %d', connection.threadId);
  });
  let sql = 'SELECT ' + hostId + ' AS host ';
      sql+= ', DATE_FORMAT(now(), "%H:%i:%s") AS dt';
  connection.query(sql, (err, results, fields) => {
    if (err) {
      return res.send(500, {
        err: 10000,
        msg: 'Error: ' + err.code
      });
    }
    // if ok
    return res.send(200, {
      err: 0,
      msg: 'host is: ' + results[0].host,
      data: results
    });
  });
  connection.end(err => {
    if (err) {
      console.error('error connect close: %s', err.stack);
      return;
    }
    console.log('connecte is terminated');
  });
  // connection.destroy();
}

// 统一响应函数
const respond = (req, res, next) => {
  const url = req.path();
  console.log('>>>url %s', url);
  if (true === /^\/host[1-3]\/api\/db$/.test(url)) {
    // 查询数据库
    return testDb(res, url.slice(5, 6));
  }
  return res.send(200, { err: 0, msg: 'hello world ' });
}

// 创建服务
const server = restify.createServer();

// 定义路由
server.get('*', respond);

// 启动服务
server.listen(3000, () => {
  console.log('ready on %s', server.url);
});
