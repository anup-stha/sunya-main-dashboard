/*
 * Created By Anup Shrestha
 * Copyright (c) 2021. All rights reserved.
 * Last Modified 12/28/21, 7:12 PM
 *
 *
 */

import React from "react";
import { useAuthStore } from "@/modules/auth/useTokenStore";
import { useDashboardQuery } from "@/modules/dashboard/hooks/useDashboardQuery";
import { Loader } from "@/components/Loader";
import {
  StatCardGroup,
  StatCardGroupVariant2,
} from "@/modules/dashboard/cards/StatCardGroup";
import { useRoleList } from "@/services/requests/roleRequests";

export const AdminDashboard: React.FC = () => {
  const user = useAuthStore().user;
  const { data, isLoading, error } = useDashboardQuery();
  const {} = useRoleList();

  if (isLoading || error) return <Loader />;

  return (
    <div className="px-10 pb-8 sm:px-8 sm:py-8 -mt-2 space-y-8 w-full sm:-mt-12 dashboard-bg">
      <div>
        <h1 className="text-[2.5rem] text-gray-800 font-semibold ">
          Hello, {user.name}
        </h1>
        <p className="text-xl text-gray-500 font-medium">
          Welcome Back To Dashboard!
        </p>
      </div>

      <div className="w-full flex items-start gap-6 md:flex-col relative sm:gap-4">
        <div className="w-5/6 h-full flex flex-col gap-6 md:w-full md:gap-4">
          <StatCardGroup data={data} />
          <StatCardGroupVariant2 data={data} />
        </div>
      </div>
    </div>
  );
};
