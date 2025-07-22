import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import foodDonationImage from '../assets/food_donation.png';

const Home = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: '10,000+', label: 'Meals Shared', icon: '🍽️' },
    { number: '500+', label: 'Food Heroes', icon: '🦸' },
    { number: '50+', label: 'Cities', icon: '🌍' },
    { number: '24/7', label: 'Service', icon: '⏰' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-200 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-1/4 -left-8 w-16 h-16 bg-red-200 rounded-full opacity-40 animate-bounce"></div>
          <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-yellow-200 rounded-full opacity-50 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-8 float-animation">
                <span className="text-6xl hover:scale-110 transition-transform duration-300 inline-block">🍲</span>
                <span className="text-6xl hover:scale-110 transition-transform duration-300 inline-block mx-2">❤️</span>
                <span className="text-6xl hover:scale-110 transition-transform duration-300 inline-block">😊</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-6 hover:scale-105 transition-transform duration-300">
                Tummy Smiles
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl leading-relaxed">
                Turn your extra food into someone's happiness. Join our community of food heroes 
                spreading joy, <span className="text-orange-600 font-semibold">one meal at a time</span>.
              </p>

              {!user ? (
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link 
                    to="/register"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg pulse-glow"
                  >
                    Start Sharing Food 🍽️
                  </Link>
                  <Link 
                    to="/login"
                    className="glass-effect border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105"
                  >
                    Sign In
                  </Link>
                </div>
              ) : (
                <div className="mb-12">
                  <Link 
                    to={user.role === 'donor' ? '/donor/dashboard' : user.role === 'agent' ? '/agent/dashboard' : '/admin/dashboard'}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg pulse-glow"
                  >
                    Go to Dashboard 📊
                  </Link>
                </div>
              )}
            </div>

            {/* Hero Image */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative z-10">
                <img 
                  src={foodDonationImage} 
                  alt="Food Donation - Sharing meals with community" 
                  className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl"></div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-red-200 rounded-full opacity-40 animate-bounce"></div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="glass-effect p-6 rounded-xl text-center hover:scale-105 transition-all duration-300">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Tummy Smiles Works</h2>
            <p className="text-xl text-gray-600">Simple steps to spread happiness through food</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* For Donors */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 card-hover group">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl">🍲</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Share Your Food</h3>
              <p className="text-gray-600 mb-6">
                Got extra food? List it on our platform with pickup details. From home-cooked meals to restaurant surplus, every contribution counts!
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-center justify-center"><span className="text-green-500 mr-2">✅</span> Easy listing process</p>
                <p className="flex items-center justify-center"><span className="text-green-500 mr-2">✅</span> Schedule pickup times</p>
                <p className="flex items-center justify-center"><span className="text-green-500 mr-2">✅</span> Track your impact</p>
              </div>
            </div>

            {/* For Agents */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 card-hover group">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl">🚗</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Deliver Happiness</h3>
              <p className="text-gray-600 mb-6">
                Be a food hero! Pick up donations and deliver them to those in need. Make a real difference in your community.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-center justify-center"><span className="text-green-500 mr-2">✅</span> Flexible schedules</p>
                <p className="flex items-center justify-center"><span className="text-green-500 mr-2">✅</span> GPS navigation</p>
                <p className="flex items-center justify-center"><span className="text-green-500 mr-2">✅</span> Earn recognition</p>
              </div>
            </div>

            {/* Impact */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 card-hover group">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl">💚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Impact</h3>
              <p className="text-gray-600 mb-6">
                Together we're reducing food waste and fighting hunger. Join thousands making their communities happier!
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-center justify-center"><span className="text-green-500 mr-2">✅</span> Reduce food waste</p>
                <p className="flex items-center justify-center"><span className="text-green-500 mr-2">✅</span> Help the hungry</p>
                <p className="flex items-center justify-center"><span className="text-green-500 mr-2">✅</span> Build community</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="text-xl text-gray-600">Real stories from real food heroes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-effect p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">👩‍🍳</span>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "I used to feel bad about throwing away extra food. Now I feel amazing knowing it's helping someone in need!"
              </p>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Madhav Thakur</p>
                <p className="text-gray-500">Food Donor</p>
              </div>
            </div>

            <div className="glass-effect p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🚗</span>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Being a delivery agent has been so rewarding. I love seeing the smiles when I deliver meals!"
              </p>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Saurabh Yadav</p>
                <p className="text-gray-500">Delivery Agent</p>
              </div>
            </div>

            <div className="glass-effect p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🏪</span>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Our restaurant partnerships with Tummy Smiles have made such a positive impact on our community."
              </p>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">NBM- Restaurant Partner</p>
                <p className="text-gray-500">Local Business</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Spread Some Tummy Smiles?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join our community of food heroes and make someone's day brighter
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/register"
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Join as Food Donor 🍽️
              </Link>
              <Link 
                to="/register"
                className="glass-effect border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105"
              >
                Become Delivery Agent 🚗
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
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
                Spreading joy through food, one meal at a time. Building stronger, happier communities together.
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
                <p>📧 hello@tummysmiles.com</p>
                <p>📞 +918604434817</p>
                <p>📍 Everywhere with love</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Tummy Smiles. Made with ❤️ by Shailendra for humanity </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;