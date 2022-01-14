// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export type Produs = {
  ID_Produs: number,
  Produs: string,
  Garantie: number,
  Stoc: number,
  ValoareUnitara: number,
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
    case "getProduse":
      console.log("Client asks for data");
      sqlCommand = "select * from produse";
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