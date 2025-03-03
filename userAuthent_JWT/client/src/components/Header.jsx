import { useContext } from 'react';
import { assets } from '../assets/assets'; 
import { AppContext } from '../context/AppContext';

const Header = () => {
  const { userData } = useContext(AppContext);


  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <img
        src={assets.header_img}
        alt="header_img"
        className="w-36 h-36 rounded-full mb-6"
      />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey {userData ? userData.firstname : "DevTeam"}!
        <img
          className="w-8 aspect-square"
          src={assets.hand_wave}
          alt=""
        />
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to our page
      </h2>
      <p className="text-black-800 mt-2 mb-8 max-w-md">
        We are a team of developers who are passionate about coding
      </p>
      
    </div>
  );
};

export default Header;
