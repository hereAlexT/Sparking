import React from "react";

const NoteDatetimeBlock: React.FC<{ createdAt: Date }> = ({ createdAt }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <p className="font-popins text-sm font-light text-gray-700 dark:text-gray-300">
      {formatDate(createdAt)}
    </p>
  );
};

export default NoteDatetimeBlock;
