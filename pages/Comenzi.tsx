import type { NextPage } from "next";
import Head from "next/head";
import { Comanda } from "../pages/api/Comenzi";
import { useState, useEffect } from "react";

const Comenzi: NextPage = () => {
  const [Comenzi, setComenzi] = useState<Comanda[]>([]);

  const databaseComandaAction = (
    actionParam: string,
    ComandaParam: Comanda | null
  ) => {
    return new Promise((resolve, reject) => {
      fetch("/api/Comenzi", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        body: JSON.stringify({
          action: actionParam,
          Comanda: ComandaParam,
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
    databaseComandaAction("getComenzi", null)
      .then((resp: any) => JSON.parse(resp).message)
      .then((ComenziResp: Comanda[]) => {
        setComenzi(ComenziResp);
      })
      .catch((item) => {
        console.log(item);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Comenzi</title>
      </Head>
      <div className="flex justify-center py-12 ">
        <table className=" table-auto border-collapse border  border-gray-500">
          <caption className="pb-5 font-bold tracking-wider">
            TABELA CLIENTI
          </caption>
          <thead>
            <tr>
              <th className="border border-gray-600 p-3">ID Comanda</th>
              <th className="border border-gray-600 p-3">ID Client</th>
              <th className="border border-gray-600 p-3">Data vanzarii</th>
            </tr>
          </thead>
          <tbody>
            {Comenzi.map((comanda) => {
              return (
                <tr key={comanda.ID_Comanda}>
                  <td className="border border-gray-600 p-3">
                    {comanda.ID_Comanda}
                  </td>
                  <td className="border border-gray-600 p-3">
                    {comanda.ID_Client}
                  </td>
                  <td className="border border-gray-600 p-3">
                    {new Date(comanda.DataVanzarii).getFullYear()}-
                    {new Date(comanda.DataVanzarii).getMonth() + 1}-
                    {new Date(comanda.DataVanzarii).getDate()}
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

export default Comenzi;
