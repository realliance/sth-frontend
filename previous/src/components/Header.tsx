import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-700 shadow-md py-4 px-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-slate-100">
            <span className="text-3xl tracking-wide">🤏🐢🏠</span>
          </h1>
        </div>
      </div>
    </header>
  );
};
