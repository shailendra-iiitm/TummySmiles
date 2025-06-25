import { Link } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button"; // or just use a <button> if you're not using shadcn/ui


const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">🍱 TummySmiles</h1>
        <p className="text-gray-600">Bringing surplus food to those who need it.</p>

        <div className="flex flex-col gap-4">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Login
          </Link>
          <NavLink to="/register">
            <Button className="bg-green-600 text-white hover:bg-green-700">Register With Us</Button>
            </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Home;