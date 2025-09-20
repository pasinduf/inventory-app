import React from "react";
import logo from "/logo.jpeg"; 

export function LogoOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0">
      <img src={logo} alt="App Logo" className="opacity-20 w-1/2 max-w-md blur-sm" />
    </div>
  );
}
