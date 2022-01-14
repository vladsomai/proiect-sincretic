import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Client } from "./api/Client";

type BestBuyer = {
  ID_Client: number;
  Nume: string;
  Prenume: string;
  TotalProduseCumparate: number;
  TotalCheltuit: number;
};

type BestSeller = {
  ID_Produs: number;
  BestSeller: string;
  CantitateTotalaVanduta: number;
};

type PeakVanzari = {
  DataVanzariiDate: string;
  CantitateTotalaVanduta: number;
};

type RaportCumparaturi = {
  Nume: string;
  Prenume: string;
  Produs: string;
  Cantitate: number;
  ValoareTotala: number;
};

const Home: NextPage = () => {
  const [bestBuyer, setBestBuyer] = useState<BestBuyer>();
  const [bestSeller, setBestSeller] = useState<BestSeller>();
  const [peakVanzari, setPeakVanzari] = useState<PeakVanzari>();
  const [raportCumparaturi, setRaportCumparaturi] =
    useState<RaportCumparaturi[]>();

  const databaseAction = (
    actionParam: string,
    BestBuyerParam: BestBuyer | null | Client
  ) => {
    return new Promise((resolve, reject) => {
      fetch("/api/Database", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        body: JSON.stringify({
          action: actionParam,
          Client: BestBuyerParam,
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
    databaseAction("getBestBuyer", null)
      .then((resp: any) => JSON.parse(resp).message)
      .then((bestBuyer: BestBuyer[][]) => {
        setBestBuyer(bestBuyer[0][0]);
      })
      .catch((item) => {
        console.log(item);
      });

    const tempClient: Client = {
      ID_Client: 2,
      NumarCard: "21212121",
      Nume: "TEST",
      Prenume: "TEST",
      DataNasterii: new Date(),
    };

    databaseAction("raportCumparaturi", tempClient)
      .then((resp: any) => JSON.parse(resp).message)
      .then((raport: RaportCumparaturi[][]) => {
        setRaportCumparaturi(raport[0]);
      })
      .catch((item) => {
        console.log(item);
      });

    databaseAction("getBestSeller", null)
      .then((resp: any) => JSON.parse(resp).message)
      .then((raport: BestSeller[][]) => {
        setBestSeller(raport[0][0]);
      })
      .catch((item) => {
        console.log(item);
      });

    databaseAction("getPeakVanzari", null)
      .then((resp: any) => JSON.parse(resp).message)
      .then((raport: PeakVanzari[][]) => {
        setPeakVanzari(raport[0][0]);
      })
      .catch((item) => {
        console.log(item);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col items-center justify-center py-12 border mx-36 my-12 rounded">
        <h1 className="text-lg">Best buyer</h1>
        &nbsp;
        <div>
          <p>ID Client: {bestBuyer?.ID_Client}</p>
          <p>Nume: {bestBuyer?.Nume}</p>
          <p>Prenume: {bestBuyer?.Prenume}</p>
          <p>Total produse cumparate: {bestBuyer?.TotalProduseCumparate}</p>
          <p>Total cheltuit: {bestBuyer?.TotalCheltuit}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-12 mx-36 my-12 rounded">
        <div>
          <table className=" table-auto border-collapse border  border-gray-500">
            <caption className="pb-5 font-bold tracking-wider">
              Raport cumparaturi Georgescu Andreea
            </caption>
            <thead>
              <tr>
                <th className="border border-gray-600 p-3">Nume</th>
                <th className="border border-gray-600 p-3">Prenume</th>
                <th className="border border-gray-600 p-3">Produs</th>
                <th className="border border-gray-600 p-3">Cantitate</th>
                <th className="border border-gray-600 p-3">Valoare totala</th>
              </tr>
            </thead>
            <tbody>
              {raportCumparaturi?.map((raport) => {
                return (
                  <tr key={raportCumparaturi.indexOf(raport)}>
                    <td className="border border-gray-600 p-3">
                      {raport.Nume}
                    </td>
                    <td className="border border-gray-600 p-3">
                      {raport.Prenume}
                    </td>
                    <td className="border border-gray-600 p-3">
                      {raport.Produs}
                    </td>
                    <td className="border border-gray-600 p-3">
                      {raport.Cantitate}
                    </td>
                    <td className="border border-gray-600 p-3">
                      {raport.ValoareTotala}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-12 border mx-36 my-12 rounded">
        <h1 className="text-lg">Best seller</h1>
        &nbsp;
        <div>
          <p>ID Produs: {bestSeller?.ID_Produs}</p>
          <p>Produs: {bestSeller?.BestSeller}</p>
          <p>Cantitate vanduta: {bestSeller?.CantitateTotalaVanduta}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-12 border mx-36 my-12 rounded">
        <h1 className="text-lg">Peak vanzari</h1>
        &nbsp;
        {peakVanzari ? (
          <div>
            <p>
              Data vanzare:{" "}
              {new Date(peakVanzari.DataVanzariiDate).getFullYear()} &nbsp;
              {new Date(peakVanzari.DataVanzariiDate).getMonth()} &nbsp;
              {new Date(peakVanzari.DataVanzariiDate).getDay()}
            </p>
            <p>Cantitate vanduta: {peakVanzari.CantitateTotalaVanduta}</p>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Home;
