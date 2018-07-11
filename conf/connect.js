require('dotenv').config()
const oracledb = require("oracledb");

const connx = oracledb.getConnection(
    {
        user: process.env.USER,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTION_STRING
    },
    function(err, connection) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log('Connection was successful!');
    
        connection.close(
          function(err) {
            if (err) {
              console.error(err.message);
              return;
            }
          });
      });

module.exports = connx;