import type { NextPage } from "next";
import Head from "next/head";
import { Client } from "../pages/api/Client";
import { useState, useEffect } from "react";

const Clienti: NextPage = () => {
  const [clientList, setClientList] = useState<Client[]>([]);

  const databaseClientAction = (
    actionParam: string,
    ClientParam: Client | null
  ) => {
    return new Promise((resolve, reject) => {
      fetch("/api/Client", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        body: JSON.stringify({
          action: actionParam,
          Client: ClientParam,
        }),
      })
        .then((result) => result.json())
        .then((resultJson) => {
          resolve(JSON.stringify(resultJson));
        })
        .catch((err) => {
          console.log(err.message);
          reject(err.message);
        });
    });
  };

  useEffect(() => {
    databaseClientAction("getClients", null)
      .then((resp: any) => JSON.parse(resp).message)
      .then((clientListResp: Client[]) => {
        console.log(typeof clientListResp[0].DataNasterii);
        setClientList(clientListResp);
      })
      .catch((item) => {
        console.log(item);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Clienti</title>
      </Head>
      <div className="flex justify-center py-12 ">
        <table className=" table-auto border-collapse border  border-gray-500">
          <caption className="pb-5 font-bold tracking-wider">
            TABELA CLIENTI
          </caption>
          <thead>
            <tr>
              <th className="border border-gray-600 p-3">ID Client</th>
              <th className="border border-gray-600 p-3">Nume</th>
              <th className="border border-gray-600 p-3">Prenume</th>
              <th className="border border-gray-600 p-3">Numar card </th>
              <th className="border border-gray-600 p-3">Data nasterii</th>
            </tr>
          </thead>
          <tbody>
            {clientList.map((client) => {
              return (
                <tr key={client.ID_Client}>
                  <td className="border border-gray-600 p-3">
                    {client.ID_Client}
                  </td>
                  <td className="border border-gray-600 p-3">{client.Nume}</td>
                  <td className="border border-gray-600 p-3">
                    {client.Prenume}
                  </td>
                  <td className="border border-gray-600 p-3">
                    {client.NumarCard}
                  </td>
                  <td className="border border-gray-600 p-3">
                    {new Date(client.DataNasterii).getFullYear()}-
                    {new Date(client.DataNasterii).getMonth()+1}-
                    {new Date(client.DataNasterii).getDate()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Clienti;
