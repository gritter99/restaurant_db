//index.js
(async()=>{
    const db = require("./db");
    console.log('começou!');

    //console.log('insert into customer table');
    //const insert_test = await db.insert_customer({customer_table: 7});
    
    //console.log('delete from customer;');
    //const delete_test = await db.delete_customer(1);


    console.log('select* from customer;');
    const clientes = await db.select_customers();
    console.log(clientes);
})();