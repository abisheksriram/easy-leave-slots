
import React, { ReactNode } from "react";

interface AppWrapperProps {
  children: ReactNode;
  customStyle?: string;
  logo?: string;
  headerTitle?: string;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({
  children,
  customStyle = "",
  logo,
  headerTitle = "HR Portal",
}) => {
  return (
    <div className={`app-wrapper ${customStyle}`}>
      <header className="bg-slate-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {logo && (
              <img src={logo} alt="Company Logo" className="h-8 w-auto" />
            )}
            <h1 className="text-xl font-semibold">{headerTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Custom controls can go here</span>
          </div>
        </div>
      </header>
      <div className="wrapper-content">
        {children}
      </div>
      <footer className="bg-slate-100 p-4 mt-8 border-t">
        <div className="container mx-auto text-center text-sm text-slate-500">
          Custom Footer Content © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};
