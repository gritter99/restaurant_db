//db.js
async function connect(){
  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection("mysql://root:03051999@localhost:3306/restaurant_db");
  console.log("Conectou no MySQL!");
  global.connection = connection;
  return connection;
}

async function select_customers(){
  const conn = await connect();
  const [rows] = await conn.query('select* from customer;');
  return rows;
}

async function insert_customer(customer){
  const conn = await connect();
  const sql = 'insert into customer(customer_id, customer_table) values (?, ?)';
  const values = [customer.customer_id, customer.customer_table];
  return await conn.query(sql, values);
}

async function delete_customer(id){
  const conn = await connect();
  const sql = 'delete from customer where customer_id = ?;';
  return await conn.query(sql, [id]);
}

connect();

module.exports= {select_customers, insert_customer, delete_customer};

