// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export type Comanda = {
  ID_Comanda: number,
  ID_Client: number,
  DataVanzarii: Date
}

const queryDB = (sqlCommand: string) => {
  const mysql = require("mysql");

  return new Promise((resolve, reject) => {
    const con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    con.connect(function (connectionErr: any) {
      if (connectionErr) reject(connectionErr);

      con.query(
        { sql: sqlCommand, timeout: 2000 },
        function (queryErr: any, result: any) {
          if (queryErr) {
            console.log("Throwing query err: ", queryErr?.sqlMessage);
            reject(queryErr?.sqlMessage);
          }
          if (result) {
            con.end();
            resolve(result);
          }
        }
      );
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const reqJSON = JSON.parse(req.body);
  let sqlCommand: string = "";

  switch (reqJSON.action) {
    case "getComenzi":
      console.log("Client asks for data");
      sqlCommand = "select * from comenzi";
      break;

    case "insertProject":
      console.log("Client asks to insert a project");
      sqlCommand = `call insertProject("${reqJSON.project_name}", ${reqJSON.adapter_code}, "${reqJSON.fixture_type}", "${reqJSON.owner_email}", ${reqJSON.contacts_limit}, ${reqJSON.warning_at}, "${reqJSON.modified_by}");`;
      break;

    case "resetCounter":
      console.log("Client asks to reset counter of a project");
      sqlCommand = `call resetCounter(${reqJSON.adapter_code}, "${reqJSON.fixture_type}", "${reqJSON.modified_by}");`;
      break;

    case "deleteProject":
      console.log("Client asks to delete a project");
      sqlCommand = `call deleteProject(${reqJSON.adapter_code}, "${reqJSON.fixture_type}");`;
      break;

    case "updateOwner":
      console.log("Client asks to update owner email");
      sqlCommand = `call updateEmail(${reqJSON.adapter_code}, "${reqJSON.fixture_type}", "${reqJSON.owner_email}", "${reqJSON.modified_by}");`;
      break;

    case "updateContactsLimitAndWarning":
      console.log("Client asks to update contacts limit and warning");
      sqlCommand = `call updateLimitWarning(${reqJSON.adapter_code}, "${reqJSON.fixture_type}", ${reqJSON.contacts_limit},${reqJSON.warning_at} ,"${reqJSON.modified_by}");`;
      break;

    default:
      console.log("Client asks for an unknown commad");
      sqlCommand = "";
      break;
  }

  return new Promise((resolve, reject) => {
    queryDB(sqlCommand)
      .then((responseFromDB) => {
        resolve(res.status(200).json({ message: responseFromDB, status: 200 }));
      })
      .catch((err: any) => {
        console.log(err);
        resolve(res.status(500).json({ message: err, status: 500 }));
      });
  });
}