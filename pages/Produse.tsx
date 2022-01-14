import type { NextPage } from "next";
import Head from "next/head";
import { Produs } from "../pages/api/Produse";
import { useState, useEffect } from "react";

type Vanzare = {
  Cantitate: number;
  ID_Produs: number;
  ID_Client: number;
};

let Buyer: number = 1; //id client logat
let CantitateCumparata: number = 1; //cantitate cumparata

const Produse: NextPage = () => {
  const [ProdusList, setProdusList] = useState<Produs[]>([]);
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);

  const buyProdus = (e: any) => {
    console.log(e.target.id);
    const vanzare: Vanzare = {
      Cantitate: CantitateCumparata,
      ID_Produs: e.target.id,
      ID_Client: Buyer,
    };

    databaseVanzareAction("buyProdus", vanzare)
      .then((resp: any) => JSON.parse(resp).message)
      .then((respObj: any) => {
        if (respObj.affectedRows == 1) alert("Produs cumparat!");

        setTriggerFetch(!triggerFetch);
      })
      .catch((item) => {
        console.log(item);
      });
  };
  const databaseClientAction = (
    actionParam: string,
    ClientParam: Produs | null | Vanzare
  ) => {
    return new Promise((resolve, reject) => {
      fetch("/api/Produse", {
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

  const databaseVanzareAction = (
    actionParam: string,
    VanzareParam: Vanzare
  ) => {
    return new Promise((resolve, reject) => {
      fetch("/api/Database", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        body: JSON.stringify({
          action: actionParam,
          Client: VanzareParam,
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
    databaseClientAction("getProduse", null)
      .then((resp: any) => JSON.parse(resp).message)
      .then((produsListResp: Produs[]) => {
        setProdusList(produsListResp);
      })
      .catch((item) => {
        console.log(item);
      });
  }, [triggerFetch]);

  return (
    <>
      <Head>
        <title>Clienti</title>
      </Head>
      <div className="flex justify-center py-12 ">
        <table className=" table-auto border-collapse border  border-gray-500">
          <caption className="pb-5 font-bold tracking-wider">
            TABELA PRODUSE
          </caption>
          <thead>
            <tr>
              <th className="border border-gray-600 p-3">ID Produs</th>
              <th className="border border-gray-600 p-3">Produs</th>
              <th className="border border-gray-600 p-3">Garantie</th>
              <th className="border border-gray-600 p-3">Stoc</th>
              <th className="border border-gray-600 p-3">Valoare unitara </th>
              <th className="border border-gray-600 p-3">Meniu</th>
            </tr>
          </thead>
          <tbody>
            {ProdusList.map((produs) => {
              return (
                <tr key={produs.ID_Produs}>
                  <td className="border border-gray-600 p-3">
                    {produs.ID_Produs}
                  </td>
                  <td className="border border-gray-600 p-3">
                    {produs.Produs}
                  </td>
                  <td className="border border-gray-600 p-3">
                    {produs.Garantie}
                  </td>
                  <td className="border border-gray-600 p-3">{produs.Stoc}</td>
                  <td className="border border-gray-600 p-3">
                    {produs.ValoareUnitara}
                  </td>
                  <td>
                    <button
                      id={`${produs.ID_Produs}`}
                      className=" bg-blue-800 rounded p-2 text-xs"
                      onClick={buyProdus}
                    >
                      Cumpara!
                    </button>
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

export default Produse;
