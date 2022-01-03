/*
 * Created By Anup Shrestha
 * Copyright (c) 2021. All rights reserved.
 * Last Modified 12/29/21, 9:01 AM
 *
 *
 */

import PermissionSaveModal from "./modal/permissionSaveModal";
import { useRoleStore } from "../roles/useRoleStore";
import React from "react";
import { permissionSelectHandler } from "./utils/permissionSelectHandler";
import { CheckBoxCard } from "@/modules/permissions/cards/CheckBoxCard";

export const Permissions = () => {
  const { selectedPermission, setSelectedPermission } = useRoleStore();

  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Permissions</h1>
        <p className="text-lg font-semibold text-gray-500">
          Click on any permission to add, update or remove permissions for super user
        </p>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 grid-cols-3 3xl:flex 3xl:flex-wrap gap-8">
        {selectedPermission.all.map((permission: any) => {
          const isItemSelected = selectedPermission.current.some(
            (element: any) => element.id === permission.id
          );

          return (
            <div
              className={isItemSelected ? "permission_card_active" : "permission_card_inactive"}
              key={permission.id}
            >
              <CheckBoxCard
                title={permission.name}
                subtitle={permission.slug}
                checked={isItemSelected}
                onCheckChange={() =>
                  permissionSelectHandler({
                    permissionId: permission.id,
                    selectedPermission,
                    setSelectedPermission,
                  })
                }
              />
            </div>
          );
        })}
      </div>
      <div className="self-start">
        <PermissionSaveModal />
      </div>
    </div>
  );
};
