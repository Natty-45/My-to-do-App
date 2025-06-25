
import Logo from "../assets/logo.png"; // Replace with the path to your logo PNG

const Navbar = ()=> {
  const userName = import.meta.env.VITE_CLIENT_NAME || " ";// Replace with dynamic name if needed

  return (
    <nav className="w-screen stick bg-black/40 backdrop-blur-md border-b border-yellow-200/20 p-4 flex items-center justify-between">
      {/* Left: User Name */}
      <div className="text-gold-300 text-xl font-semibold font-sans text-white">{userName}</div>

      {/* Center: Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img src={Logo} alt="To-Do App Logo" className="h-12 w-auto" />
      </div>

      {/* Right: Logout and Theme Changer */}
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white font-medium transition-colors duration-300">
          Logout
        </button>
        <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white font-medium transition-colors duration-300">
          Theme
        </button>
      </div>
    </nav>
  );
};

export default Navbar;