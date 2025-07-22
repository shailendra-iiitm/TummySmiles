import { useState, useEffect } from 'react';
import foodDonationImage from '../assets/food_donation.png';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const impactStats = [
    { 
      number: '1.3B', 
      label: 'Tons of Food Wasted Globally', 
      icon: '🗑️',
      description: 'Every year worldwide' 
    },
    { 
      number: '795M', 
      label: 'People Face Hunger', 
      icon: '😢',
      description: 'Undernourished globally' 
    },
    { 
      number: '40%', 
      label: 'Food Waste Reduction Goal', 
      icon: '🎯',
      description: 'Our mission target' 
    },
    { 
      number: '10K+', 
      label: 'Meals Delivered', 
      icon: '🍽️',
      description: 'Through TummySmiles' 
    }
  ];

  const teamMembers = [
    {
      name: 'Shailendra Kumar',
      role: 'Founder & CEO',
      image: '👨‍💻',
      description: 'Computer Science student passionate about using technology to solve social problems and reduce food waste.'
    },
    {
      name: 'Development Team',
      role: 'Tech & Operations',
      image: '👥',
      description: 'Dedicated team of developers and volunteers working to make food sharing accessible to everyone.'
    },
    {
      name: 'Community Partners',
      role: 'Local Network',
      image: '🤝',
      description: 'Restaurants, NGOs, and community organizations helping us reach every corner of the country.'
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Platform Launch',
      description: 'TummySmiles officially launched with basic food donation features',
      icon: '🚀'
    },
    {
      year: '2024',
      title: 'Agent Network',
      description: 'Introduced delivery agent system for efficient food distribution',
      icon: '🚗'
    },
    {
      year: '2024',
      title: 'Admin Dashboard',
      description: 'Built comprehensive admin panel for platform management',
      icon: '📊'
    },
    {
      year: '2025',
      title: 'Market Ready',
      description: 'Enhanced platform with professional features and support system',
      icon: '🎯'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 overflow-hidden py-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
                About TummySmiles
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We're on a mission to create a world where no food goes to waste and no one goes hungry. 
                Through technology and community spirit, we're building bridges between food abundance and food need.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span className="text-gray-700">Reducing food waste through smart redistribution</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-gray-700">Fighting hunger in local communities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span className="text-gray-700">Building stronger, more caring societies</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={foodDonationImage} 
                  alt="Food Donation" 
                  className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-red-200 rounded-full opacity-40 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Statistics */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Global Food Crisis</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding the magnitude of food waste and hunger helps us appreciate why every small action matters.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-800 mb-2">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-600">
                <p className="text-lg leading-relaxed">
                  TummySmiles was born from a simple observation: while millions of people go to bed hungry, 
                  tons of perfectly good food get thrown away every single day. This paradox inspired us to 
                  create a platform that could bridge this gap effectively.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Started as a college project, TummySmiles has evolved into a comprehensive food redistribution 
                  platform that connects food donors with those in need through our network of dedicated delivery agents.
                </p>
                
                <p className="text-lg leading-relaxed">
                  We believe that technology can be a powerful force for social good. Every feature we build, 
                  every line of code we write, is aimed at making food sharing as simple as ordering food online.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h4 className="font-semibold mb-1">Zero Food Waste</h4>
                      <p className="text-orange-100">Ensure every edible food item finds someone who needs it</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🤝</span>
                    <div>
                      <h4 className="font-semibold mb-1">Community Building</h4>
                      <p className="text-orange-100">Foster connections between neighbors and local businesses</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🌱</span>
                    <div>
                      <h4 className="font-semibold mb-1">Sustainable Future</h4>
                      <p className="text-orange-100">Promote environmentally conscious food consumption</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">Passionate individuals working to make a difference</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">{member.image}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-orange-600 font-semibold mb-4">{member.role}</div>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Key milestones in our mission to end food waste</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-500 to-red-500 opacity-20"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-full max-w-md ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{milestone.icon}</span>
                        <div className="text-lg font-bold text-orange-600">{milestone.year}</div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gradient-to-br from-orange-500 to-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Our Core Values</h2>
          <p className="text-xl text-orange-100 mb-12 max-w-3xl mx-auto">
            These principles guide everything we do and every decision we make
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '💝', title: 'Compassion', desc: 'Every action driven by empathy for those in need' },
              { icon: '🔄', title: 'Sustainability', desc: 'Creating long-term solutions for food waste' },
              { icon: '🚀', title: 'Innovation', desc: 'Using technology to solve social challenges' },
              { icon: '🌟', title: 'Excellence', desc: 'Delivering the highest quality service always' }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-orange-100">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Join Us in Creating Change
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Every meal shared, every act of kindness, every small step makes a difference. 
            Be part of the solution and help us build a world with zero food waste and zero hunger.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/register" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
              Start Donating Today 🍽️
            </a>
            <a href="/contact" className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105">
              Get in Touch 📞
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
