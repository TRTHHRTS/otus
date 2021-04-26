const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { Client } = require('pg');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.render('index', { title: process.env.APP_TITLE });
});

app.get('/health', (req, res, next) => {
  res.json({"status": "OK"});
});

app.get('/env', async (req, res, next) => {
  res.json(process.env);
});

app.post('/user', async (req, res, next) => {
  const client = new Client();
  await client.connect();
  const query = {
    text: 'INSERT INTO users(name) VALUES ($1)',
    values: [req.body.name],
  }
  const result = await client.query(query);
  await client.end();
  res.json({"result": result});
});

app.get('/user', async (req, res, next) => {
  const client = new Client();
  await client.connect();
  const result = await client.query("SELECT * from users");
  await client.end();
  res.json(result.rows);
});

app.get('/user/:userId', async (req, res, next) => {
  const client = new Client();
  await client.connect();
  const result = await client.query("SELECT * from users WHERE id = $1", [req.params.userId]);
  await client.end();
  res.json(result.rows);
});

app.delete('/user/:userId', async (req, res, next) => {
  const client = new Client();
  await client.connect();
  const query = {
    text: 'DELETE FROM users WHERE id =$1',
    values: [req.params.userId],
  }
  const result = await client.query(query);
  await client.end();
  res.json({"result": result});
});

app.put('/user/:userId', async (req, res, next) => {
  const client = new Client();
  await client.connect();
  const query = {
    text: 'UPDATE users SET name = $1 WHERE id = $2',
    values: [req.body.name, req.params.userId],
  }
  const result = await client.query(query);
  await client.end();
  res.json({"result": result});
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
