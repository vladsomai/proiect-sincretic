import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <div className="flex justify-around items-center bg-slate-900 text-white h-16 rounded">
        <Link href={"/"}>Home</Link>
        <Link href={"/Clienti"}>Clienti</Link>
        <Link href={"/Produse"}>Produse</Link>
        <Link href={"/ListaComanda"}>Lista produse comandate</Link>
      </div>
    </>
  );
};

export default Navbar;
