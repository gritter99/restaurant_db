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
//------------------------------------------CRUD Tabela customers----------------//
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
app.delete('/del_customers/:id?', (req, res) =>{
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

//---------------------------------------------- CRUD tabela items-----------------------------------------//
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
app.delete('/del_items/:id?', (req, res) =>{
  execSQLQuery('DELETE FROM items WHERE id=' + parseInt(req.params.id), res);
})

//------------------------------CRUD Tabela menus-------------------//

//mostrar cardapio
app.get('/menus', (req, res) => {
  execSQLQuery('SELECT * FROM menus', res);
})

//adicionar item cardapio
app.post('/menus', (req, res) => {
  const users_id = req.body.users_id;
  const title = req.body.title.substring(0, 255);
  const description = req.body.description.substring(0, 1000);
  execSQLQuery(`insert into menus(title, description, users_id) values ('${title}', '${description}', ${users_id});`, res);
});

//update titulo de item no cardapio
app.patch('/menus_title/:id?', (req, res) => {
  const id = parseInt(req.params.id);
  const title = req.body.title;
  execSQLQuery(`UPDATE menus SET menus.title = '${title}' WHERE menus.id=${id}`, res);
})

//update descricao de item no cardapio
app.patch('/menus_description/:id?', (req, res) => {
  const id = parseInt(req.params.id);
  const description = req.body.description;
  execSQLQuery(`UPDATE menus SET menus.description = '${description}' WHERE menus.id=${id}`, res);
})

//deletar um item do cardapio
app.delete('/del_menus/:id?', (req, res) =>{
  execSQLQuery('DELETE FROM menus WHERE id=' + parseInt(req.params.id), res);
})

//------------------------------CRUD Tabela orders-------------------//

//mostrar pedidos
app.get('/orders', (req, res) => {
  execSQLQuery('SELECT * FROM hamburgueria.orders', res);
})

//adicionar pedido
app.post('/orders', (req, res) => {
  const users_id = req.body.users_id;
  const status = req.body.status;
  const customers_id = req.body.customers_id;
  execSQLQuery(`insert into hamburgueria.orders(status, customers_id, users_id) values (${status}, ${customers_id}, ${users_id});`, res);
});

//update status do pedido
app.patch('/status/:id?', (req, res) => {
  const id = parseInt(req.params.id);
  const status = req.body.status;
  execSQLQuery(`UPDATE hamburgueria.orders SET hamburgueria.orders.status = ${status} WHERE hamburgueria.orders.id=${id}`, res);
})

//deletar um item da tabela pedidos
app.delete('/del_orders/:id?', (req, res) =>{
  execSQLQuery('DELETE FROM hamburgueria.orders WHERE id=' + parseInt(req.params.id), res);
})

//------------------------------CRUD Tabela orders_has_items-------------------//

app.get('/orders_list', (req, res) => {
  execSQLQuery('SELECT * FROM hamburgueria.orders_has_items', res);
})

//adicionar item na lista de pedidos
app.post('/orders', (req, res) => {
  const items_id = req.body.customers_id;
  const orders_id = req.body.orders_id;
  execSQLQuery(`insert into hamburgueria.orders_has_items(orders_id, items_id) values (${orders_id}, ${items_id});`, res);
});

//update item do pedido
app.patch('/update_item_pedido/:id?', (req, res) => {
  const id = parseInt(req.params.id);
  const items_id = req.body.items_id;
  execSQLQuery(`UPDATE hamburgueria.orders_has_items SET hamburgueria.orders_has_items.items_id = ${items_id} WHERE hamburgueria.orders_has_items.orders_id=${id}`, res);
})

app.delete('/del_orders_has_item/:id?', (req, res) =>{
  execSQLQuery('DELETE FROM hamburgueria.orders_has_items WHERE id=' + parseInt(req.params.id), res);
})

//------------------------------CRUD Tabela users-------------------//

//select users (garcom ou admin)
app.get('/users', (req, res) => {
  execSQLQuery('SELECT * FROM hamburgueria.users', res);
})

//adicionar user
app.post('/add_user', (req, res) => {
  const role = req.body.role.substring(0, 20);
  const name = req.body.name.substring(0, 200);
  const password = req.body.password.substring(0, 255);
  const email = req.body.email.substring(0, 200);
  execSQLQuery(`insert into users(name, email, password, role) values ('${name}', '${email}', '${password}', '${role}');`, res);
});

//update user
app.patch('/update_user/:id?', (req, res) => {
  const id = parseInt(req.params.id);
  const role = req.body.role.substring(0, 20);
  const name = req.body.name.substring(0, 200);
  const password = req.body.password.substring(0, 255);
  const email = req.body.email.substring(0, 200);
  execSQLQuery(`UPDATE hamburgueria.users SET hamburgueria.users.name = '${name}', hamburgueria.users.email = '${email}', hamburgueria.users.password = '${password}', hamburgueria.users.role = '${role}' WHERE hamburgueria.users.id=${id};`, res);
});

app.delete('/del_user/:id?', (req, res) =>{
  execSQLQuery('DELETE FROM hamburgueria.users WHERE id=' + parseInt(req.params.id), res);
})

//----------------- dados da mesa -------------//

//pegar a conta total da mesa
app.get('/table_total_payment', (req, res) => {
  execSQLQuery(`SELECT hamburgueria.customers.table as mesa, sum(hamburgueria.items.price) as total_a_pagar
  FROM hamburgueria.orders
  INNER JOIN hamburgueria.customers
  ON hamburgueria.orders.customers_id = hamburgueria.customers.id
  inner join hamburgueria.orders_has_items
  on hamburgueria.orders.id = hamburgueria.orders_has_items.orders_id
  inner join hamburgueria.items
  on hamburgueria.items.id = hamburgueria.orders_has_items.items_id
  group by mesa;`, res);
})

//o que cada pessoa pediu
app.get('/individual_orders', (req, res) => {
  execSQLQuery(`SELECT hamburgueria.customers.id as pessoa, hamburgueria.customers.table as mesa, hamburgueria.items.title as pedido, hamburgueria.orders.id as order_id
  FROM hamburgueria.orders
  INNER JOIN hamburgueria.customers
  ON hamburgueria.orders.customers_id = hamburgueria.customers.id
  inner join hamburgueria.orders_has_items
  on hamburgueria.orders.id = hamburgueria.orders_has_items.orders_id
  inner join hamburgueria.items
  on hamburgueria.items.id = hamburgueria.orders_has_items.items_id
  order by mesa;`, res);
})