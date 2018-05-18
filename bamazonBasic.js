var inquirer = require('inquirer');
var mysql = require('mysql')

// connection information for the sql database
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,

  user: 'root',

  password: '',
  database: 'bamazon_DB'
});

// function for purchase
// connect to the mysql server and sql database
connection.query('SELECT * FROM products', function (err, res) {
  if (err) throw err;
  purchase();

  // function for costumer to make the purchase
  function purchase() {
    console.log('Welcome to BAMAZON!')
    // loop through the response and console log them all out for user to pick the item they wish to buy
    for (var i = 0; i < res.length; i++) {
      console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + "Price: " + res[i].price + " | " + "QTY: " + res[i].stock_quantity);
    }
    // inquirer ran to ask the user what they want to buy and how many
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'id',
          message: 'What is the ID of the item you would like to buy?'
        },
        {
          name: 'quantity',
          type: 'input',
          message: 'How many would you like to purchase?'
        }
      ])
      .then(function (answers) { //resolves promise

        // checks if quantity is sufficient
        if (res[answers.id].stock_quantity >= parseInt(answers.quantity)) {
          // after purchase is verified, quantity is updated
          connection.query("UPDATE products SET ? WHERE ?", [
            
            { stock_quantity: (res[answers.id].stock_quantity - parseInt(answers.quantity)) },
            { item_id: answers.id }
          ], function (err, res) {
            if (err) throw err;
            // this isn't working
            console.log("Success! Your total is $" + parseFloat(((res[answers.id].price) * answers.quantity).toFixed(2)).toFixed(2) + ". Your item(s) will be shipped to you in 3-5 business days.");

          })
        }
        // is quantity is not efficient
        else {
          console.log('there is not enough in stock')
        }


      });
  }
})