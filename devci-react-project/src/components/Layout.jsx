import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      {/* 🔹 Persistent Header */}
      <header className="bg-slate-800 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="font-bold text-3xl text-red-600">DEVCI VERIFIER </h1>
        <nav>
          <ul className="flex space-x-15 justify-between">
            <li><Link to="/" className="hover:underline text-2xl text-white hover:text-red-500 font-bold">Home</Link></li>
            <li><Link to="/about" className="hover:underline text-2xl hover:text-red-500 text-white font-bold">About</Link></li>
            <li><Link to="/contact" className="hover:underline text-2xl hover:text-red-500 text-white font-bold">Contact</Link></li>
          </ul>
        </nav>
      </header>

      {/*This will change based on the route */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

