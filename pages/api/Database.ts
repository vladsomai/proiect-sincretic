// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

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
    case "getBestBuyer":
      console.log("Client asks for best client");
      sqlCommand = "call BestClient()";
      break;

    case "raportCumparaturi":
      console.log("Client ask for raport");
      sqlCommand = `call RaportCumparaturi("${reqJSON.Client.ID_Client}");`;
      break;

    case "getBestSeller":
      console.log("Client asks for best seller");
      sqlCommand = `call BestSeller();`;
      break;

    case "getPeakVanzari":
      console.log("Client asks peak vanzari");
      sqlCommand = `call PeakVanzari();`;
      break;

    case "buyProdus":
      console.log("Client asks to buy");
      sqlCommand = `call VanzareClient(${reqJSON.Client.Cantitate},${reqJSON.Client.ID_Produs},${reqJSON.Client.ID_Client});`;
      break;

    default:
      console.log("Client asks for an unknown commad");
      sqlCommand = "";
      break;
  }

  return new Promise((resolve) => {
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