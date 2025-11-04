import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import userImg from './../assets/user.jpg';

const Navbar = () => {
  const user = true;

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Dashboard', href: '/dashboard', current: location.pathname === '/dashboard' },
    { name: 'AI Agent', href: '/ai-agent', current: location.pathname === '/ai-agent' },
    { name: 'Analysis', href: '/analysis', current: location.pathname === '/analysis' },
  ];

  const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
  ];

  const handleNavigation = (href) => {
    navigate(href);
    setIsOpen(false);
  };

  const handleSignOut = () => {
    // Add your sign out logic here
    console.log('User signed out');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                AI Agent
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    item.current
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {user ? (
              /* Authenticated State - Desktop */
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                        <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                          <img 
                            className="h-full w-full object-cover" 
                            src={userImg} 
                            alt="User profile" 
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          {/* Fallback if image fails to load */}
                          <div 
                            className="h-full w-full bg-blue-500 flex items-center justify-center hidden"
                            style={{ display: 'none' }}
                          >
                            <span className="text-white text-sm font-medium">U</span>
                          </div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      {userNavigation.map((item) => (
                        <DropdownMenuItem key={item.name} asChild>
                          {item.name === 'Sign out' ? (
                            <button 
                              onClick={handleSignOut}
                              className="w-full text-left cursor-pointer"
                            >
                              {item.name}
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleNavigation(item.href)}
                              className="w-full text-left cursor-pointer"
                            >
                              {item.name}
                            </button>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              /* Unauthenticated State - Desktop */
              <div className="hidden md:flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-2 py-1"
                    onClick={() => setIsOpen(true)}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col h-full">
                    {/* Mobile Navigation */}
                    <div className="flex-1 space-y-4 py-6">
                      <div className="px-2 space-y-1">
                        {navigation.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleNavigation(item.href)}
                            className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              item.current
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>

                      {/* User menu for mobile when authenticated */}
                      {user && (
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex items-center px-3 py-2 mb-2">
                            <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200 mr-3">
                              <img 
                                className="h-full w-full object-cover" 
                                src={userImg} 
                                alt="User profile" 
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              {/* Fallback if image fails to load */}
                              <div 
                                className="h-full w-full bg-blue-500 flex items-center justify-center hidden"
                                style={{ display: 'none' }}
                              >
                                <span className="text-white text-sm font-medium">U</span>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">User Name</span>
                          </div>
                          <div className="px-2 space-y-1">
                            {userNavigation.map((item) => (
                              <button
                                key={item.name}
                                onClick={() => item.name === 'Sign out' ? handleSignOut() : handleNavigation(item.href)}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                              >
                                {item.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Auth section for mobile when unauthenticated */}
                    {!user && (
                      <div className="border-t border-gray-200 p-4 space-y-3">
                        <Button 
                          className="w-full" 
                          onClick={() => handleNavigation('/signup')}
                        >
                          Sign Up
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => handleNavigation('/login')}
                        >
                          Login
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;