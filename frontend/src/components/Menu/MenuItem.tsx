import { IonIcon } from "@ionic/react";
import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";

interface MenuItemProps {
  label: string;
  active: boolean;
  to: string;
  icon: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ active, to, icon, label }) => {
  return (
    <Link
      to={to}
      className={clsx("flex items-center rounded-lg py-1 hover:bg-sky-300", {
        " bg-sky-200 font-semibold text-indigo-800": active,
        "text-black": !active,
      })}
    >
      <IonIcon src={icon} className="mr-3 h-6 w-6 pl-3" />
      <span className="">{label}</span>
    </Link>
  );
};

export default MenuItem;
