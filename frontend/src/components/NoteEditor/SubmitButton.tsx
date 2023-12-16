import clsx from "clsx";
import React, { ReactNode, FC } from "react";

interface SubmitButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
  className?: string;
}

const SubmitButton: FC<SubmitButtonProps> = ({
  children,
  onClick,
  disabled,
  className,
}) => {
  return (
    <button
      disabled={disabled}
      className={`h-25 w-25 
      flex items-center justify-center rounded-full bg-sky-500
      p-1  hover:bg-sky-500
      disabled:bg-sky-300 dark:bg-white dark:disabled:bg-gray-300
        ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SubmitButton;
