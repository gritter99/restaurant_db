//crud para tabela customers 

//definicao de constantes locais
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const port = 3000; //porta padrão
const mysql = require('mysql2');

//configurar aplicacao para receber posts no formato json
app.use(bodyparser.json());

//inicia o servidor
app.listen(port, ()=>console.log('api funcionando!'));

//criar listagem de clientes
function execSQLQuery(sqlQry, res){
    const connection = mysql.createConnection({
      host     : 'localhost',
      port     : 3306,
      user     : 'root',
      password : '03051999',
      database : 'hamburgueria'
    });
   
    connection.query(sqlQry, (error, results, fields) => {
        if(error) 
          res.json(error);
        else
          res.json(results);
        connection.end();
        console.log('query executada!');
    });
}

//mostrar clientes
app.get('/customers', (req, res) => {
    execSQLQuery('SELECT * FROM customers', res);
})

//mostrar um determinado cliente
app.get('/customer/:id?', (req, res) => {
  let filter = '';
  if(req.params.id) filter = ' WHERE customers.id=' + parseInt(req.params.id);
  execSQLQuery('SELECT * FROM customers' + filter, res);
})

//mostrar uma determinada mesa
app.get('/table/:table?', (req, res) => {
    let filter = '';
    if(req.params.table) filter = ' WHERE customers.table=' + parseInt(req.params.table);
    execSQLQuery('SELECT * FROM customers' + filter, res);
})

//deletar um cliente
app.delete('/customers/:id?', (req, res) =>{
    execSQLQuery('DELETE FROM customers WHERE id=' + parseInt(req.params.id), res);
})

//adicionar cliente
app.post('/customers', (req, res) => {
    const table = req.body.table;
    execSQLQuery("insert into customers(customers.table) values("+table+");", res);
});

//update cliente
app.patch('/customers/:id?', (req, res) => {
    const id = parseInt(req.params.id);
    const table = req.body.table;
    execSQLQuery(`UPDATE customers SET customers.table = ${table} WHERE customers.ID=${id}`, res);
})

//mostrar itens
app.get('/items', (req, res) => {
  execSQLQuery('SELECT * FROM items', res);
})

//adicionar itens
app.post('/items', (req, res) => {
  const menus_id = req.body.menus_id;
  const users_id = req.body.users_id;
  const title = req.body.title.substring(0, 255);
  const price = req.body.price;
  const description = req.body.description.substring(0, 1000);
  execSQLQuery(`insert into items(title, description, price, menus_id, users_id) values ('${title}', '${description}', ${price}, ${menus_id}, ${users_id});`, res);
});

//update itens
app.patch('/price/:id?', (req, res) => {
  const id = parseInt(req.params.id);
  const price = req.body.price;
  execSQLQuery(`UPDATE items SET items.price = ${price} WHERE items.id=${id}`, res);
})

//deletar um item
app.delete('/items/:id?', (req, res) =>{
  execSQLQuery('DELETE FROM items WHERE id=' + parseInt(req.params.id), res);
})