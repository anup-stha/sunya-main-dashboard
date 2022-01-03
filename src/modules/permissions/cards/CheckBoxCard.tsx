/*
 * Created By Anup Shrestha
 * Copyright (c) 2021. All rights reserved.
 * Last Modified 12/29/21, 9:01 AM
 *
 *
 */

import React from "react";
import Image from "next/image";

export type CheckBoxCardProps = {
  title: string;
  subtitle: string;
  checked: boolean;
  onCheckChange: React.ChangeEventHandler<HTMLInputElement>;
};

export const CheckBoxCard: React.FC<CheckBoxCardProps> = ({
  title,
  subtitle,
  checked,
  onCheckChange,
}) => {
  return (
    <div className="flex items-center justify-between h-full space-x-4">
      <div className="flex items-center space-x-4">
        <div>
          <Image
            src="/assets/permission1.png"
            alt={title}
            width={64}
            height={64}
            objectFit="cover"
            layout="fixed"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-2xl text-gray-800 font-semibold line-clamp-1 ">{title}</span>
          <span className="text-lg text-gray-500 font-medium w-3/4 line-clamp-2">{subtitle}</span>
        </div>
      </div>
      <div className="max-w-sm mx-auto">
        <label className="inline-flex items-center">
          <input
            className="text-green-500 w-8 h-8 mr-2 cursor-pointer focus:ring-green-400 focus:ring-opacity-25 border border-gray-300 rounded-lg"
            type="checkbox"
            checked={checked}
            onChange={onCheckChange}
          />
        </label>
      </div>
    </div>
  );
};
