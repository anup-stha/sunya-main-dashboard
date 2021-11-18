import React from "react";

type ButtonProps = React.HTMLProps<HTMLButtonElement> & {
  loading?: boolean;
  children: React.ReactNode;
  width?: "full";
  type?: any;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  disabled,
  onClick,
  width,
  type,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled ?? loading}
      className={`flex items-center px-12 py-3 ${
        width ? "w-full justify-center py-4" : ""
      }  text-center text-xl font-medium text-white bg-green-500 rounded-sm disabled:opacity-80 gap-x-2 hover:bg-green-600 shadow-E400 disabled:cursor-not-allowed`}
    >
      {loading ? <div className="loading"></div> : null}
      {children}
    </button>
  );
};

export const IconButton: React.FC<ButtonProps> = ({
  children,
  loading,
  disabled,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center px-3 py-3 text-lg font-medium text-white bg-green-500 rounded-sm disabled:opacity-80 gap-x-2 hover:bg-green-600 shadow-E400 disabled:cursor-not-allowed"
      disabled={disabled ?? loading}
    >
      {loading ? <div className="loading_md"></div> : null}
      {children}
    </button>
  );
};