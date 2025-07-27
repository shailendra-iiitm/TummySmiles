import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-full">
                <span className="text-white text-xl">😊</span>
              </div>
              <h3 className="text-2xl font-bold">Tummy Smiles</h3>
            </div>
            <p className="text-gray-400">
              Spreading joy through food, Generating Smiles. Building stronger, happier communities together.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-gray-400">
              <Link to="/about" className="block hover:text-orange-400 transition-colors">About Us</Link>
              <Link to="/contact" className="block hover:text-orange-400 transition-colors">Contact</Link>
              <Link to="/register" className="block hover:text-orange-400 transition-colors">Get Started</Link>
              <Link to="/login" className="block hover:text-orange-400 transition-colors">Sign In</Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <p>📧 shailendra.iiitsm@gmail.com</p>
              <p>📞 +918604434817</p>
              <p>📍 Everywhere with love</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Tummy Smiles. Made with ❤️ by Shailendra for humanity</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
