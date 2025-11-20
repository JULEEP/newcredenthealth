import React, { useEffect, useState } from 'react';

const WelcomePage = () => {
  const [greeting, setGreeting] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const staffName = localStorage.getItem('name') || 'User';
    // Capitalize first letter of the name
    const capitalizedName = staffName.charAt(0).toUpperCase() + staffName.slice(1);
    setName(capitalizedName);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon'); 
    else if (hour < 21) setGreeting('Good Evening');
    else setGreeting('Good Night');
  }, []);

  return (
    <div className="w-full mx-auto mt-4 px-4">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-xl p-4 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          
          {/* Greeting - Left Side */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-xl md:text-3xl font-bold drop-shadow-lg">
              {greeting}!
            </h1>
            <p className="text-indigo-200 mt-1 text-xs">Have a wonderful day!</p>
          </div>

          {/* Vertical Separator for Desktop */}
          <div className="hidden md:block w-px h-8 bg-white opacity-30 mx-2"></div>

          {/* Horizontal Separator for Mobile */}
          <div className="md:hidden w-12 h-px bg-white opacity-30"></div>

          {/* Name - Right Side */}
          <div className="text-center md:text-right flex-1">
            <h2 className="text-lg md:text-2xl font-semibold drop-shadow-md">
              {name}
            </h2>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WelcomePage;