import React from "react";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-8 px-8 mt-16 text-center">
    <div className="border-t border-gray-700 mb-4"></div>
    <p className="text-sm tracking-wide">&copy; {new Date().getFullYear()} <span className="font-semibold text-gray-200">AI-Commerce</span>. All rights reserved.</p>
    <p className="text-xs mt-2 text-gray-500">Made with ❤️ for modern commerce</p>
  </footer>
);

export default Footer;
