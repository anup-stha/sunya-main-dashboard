/*
 * Created By Anup Shrestha
 * Copyright (c) 2022. All rights reserved.
 * Last Modified 2/24/22, 2:52 PM
 *
 *
 */

import { useRouter } from "next/router";
import { WarningOctagon } from "phosphor-react";
import React from "react";

import { ProfileListLoadingState } from "@/components/state/ProfileSubsLoadingState";
import { TableView } from "@/components/Table";

import { MemberRoleDropdown } from "@/modules/members/components/dropdown/MemberRoleDropdown";
import { MemberModal } from "@/modules/members/components/modal/MemberModal";
import { UserTableRow } from "@/modules/members/components/table/UserTableRow";
import { useNestedMemberList } from "@/modules/members/hooks/query/useNestedMemberList";
import { useCurrentMemberStore } from "@/modules/members/hooks/zustand/useCurrentMemberStore";
import { useRoleDetails } from "@/services/requests/roleRequests";

interface IMembersTable {
  parent_member_id?: number;
}

/**
 * @param {number} parent_member_id - id of the member to show list related to that member
 * @return {JSX.Element}
 */
function Tab({ parent_member_id }: IMembersTable) {
  const router = useRouter();
  const selectedRole = useCurrentMemberStore((state) => state.role);
  const currentMember = useCurrentMemberStore((state) => state.member);

  const userRole = useCurrentMemberStore((state) => state.userRole);
  const setUserRole = useCurrentMemberStore(
    (state) => state.setCurrentUserRole
  );

  const { data: roleList } = useRoleDetails(Number(selectedRole.id));
  const { data, isLoading } = useRoleDetails(Number(userRole.id));

  const { data: usersList } = useNestedMemberList(
    Number(userRole.id) ?? Number(roleList?.data.data.role_access[0].id),
    currentMember.id,
    undefined,
    Number(router.query.page ?? 1)
  );

  if (roleList?.data.data.role_access.length === 0) {
    return (
      <div className="flex items-center text-xl font-semibold text-red-400 space-x-2 ">
        <WarningOctagon size={24} /> <span>No Role Found</span>
      </div>
    );
  }

  return (
    <div className="bg-white w-full rounded-2xl shadow-sm p-8 flex flex-col relative">
      {roleList?.data.data.role_access && !isLoading ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between sm:flex-col sm:items-start sm:justify-start sm:gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                Members List
              </h1>
              <p className="text-gray-500 font-medium text-lg print:hidden">
                List of All Organization Members
              </p>
            </div>

            <div className="flex gap-4">
              <MemberRoleDropdown
                roleList={roleList?.data.data.role_access}
                selectedRole={userRole}
                setSelectedRole={setUserRole}
              />
              {data && (
                <MemberModal
                  type="add"
                  selectedRole={data?.data.data}
                  parent_member_id={parent_member_id}
                />
              )}
            </div>
          </div>

          <div>
            {usersList ? (
              usersList.list.length === 0 ? (
                <div className="flex items-center text-xl font-semibold text-red-400 space-x-2 ">
                  <WarningOctagon size={24} /> <span>No Details Found</span>
                </div>
              ) : (
                <TableView
                  data={usersList?.list.map((element) => ({
                    ...element,
                    role_id: selectedRole.id,
                    role_slug: selectedRole.slug,
                  }))}
                  tableHeadings={[
                    "Member Name",
                    "Code",
                    "Phone Number",
                    "Address",
                    "",
                  ]}
                  searchTerms={["name", "member_code"]}
                  tableRowComponent={<UserTableRow />}
                  loading={!roleList}
                  paginate={true}
                  paginateObject={usersList.pagination}
                />
              )
            ) : (
              <ProfileListLoadingState />
            )}
          </div>
        </div>
      ) : (
        <ProfileListLoadingState />
      )}{" "}
    </div>
  );
}

export const MembersListTab = React.memo(Tab);