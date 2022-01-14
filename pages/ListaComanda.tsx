import type { NextPage } from "next";
import Head from "next/head";
import { ListaComanda } from "../pages/api/ListaComanda";
import { useState, useEffect } from "react";

const Clienti: NextPage = () => {
  const [listaComandaList, setListaComandaList] = useState<ListaComanda[]>([]);

  const databaseListaProduseComandaAction = (
    actionParam: string,
    ListaComandaParam: ListaComanda | null
  ) => {
    return new Promise((resolve, reject) => {
      fetch("/api/ListaComanda", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        body: JSON.stringify({
          action: actionParam,
          Client: ListaComandaParam,
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
    databaseListaProduseComandaAction("getListaComanda", null)
      .then((resp: any) => JSON.parse(resp).message)
      .then((produseComandaListResp: ListaComanda[]) => {
        setListaComandaList(produseComandaListResp);
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
            TABELA LISTA PRODUSE COMANDA
          </caption>
          <thead>
            <tr>
              <th className="border border-gray-600 p-3">ID Produs</th>
              <th className="border border-gray-600 p-3">Cantitate</th>
              <th className="border border-gray-600 p-3">ID_Comanda</th>
            </tr>
          </thead>
          <tbody>
            {listaComandaList.map((lista) => {
              return (
                <tr key={lista.EntryID}>
                  <td className="border border-gray-600 p-3">
                    {lista.ID_Produs}
                  </td>
                  <td className="border border-gray-600 p-3">
                    {lista.Cantitate}
                  </td>
                  <td className="border border-gray-600 p-3">
                    {lista.ID_Comanda}
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
