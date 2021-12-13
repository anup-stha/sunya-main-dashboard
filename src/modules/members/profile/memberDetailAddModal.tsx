/*
 * Created By Anup Shrestha
 * Copyright (c) 2021. All rights reserved.
 * Last Modified 12/13/21, 7:38 AM
 *
 *
 */

import { useRoleStore } from "@/modules/roles/useRoleStore";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/Modal/useModal";
import { MemberDetailCategory } from "@/types";
import React, { Fragment } from "react";
import { HookInput } from "@/components/Input";
import { alert } from "@/components/Alert";
import { addDetailsToMember } from "@/services/requests/memberRequests";

export const MemberDetailAddModal = ({ memberData }: any) => {
  const selectedRole = useRoleStore.getState().selectedRole;
  const { register, handleSubmit } = useForm();

  return (
    <Modal>
      <Modal.Button type={"open"}>
        <div className="p-6  text-gray-500 text-xl font-semibold cursor-pointer hover:text-gray-850 hover:text-gray-800">
          Update Public Profile Info
        </div>
      </Modal.Button>
      <Modal.Content>
        <Modal.Title>
          Update {memberData.name}
          {"'s"} Details
        </Modal.Title>
        <form className="space-y-8">
          <Modal.Scrollable>
            <div className="space-y-4">
              {selectedRole.member_detail_categories &&
                selectedRole.member_detail_categories.map(
                  (category: MemberDetailCategory) => (
                    <Fragment key={category.id}>
                      <HookInput
                        label={category.name}
                        type={category.value_type}
                        required={category.required ? true : false}
                        placeholder={`Enter ${category.name}`}
                        {...register(`${category.id}-${category.slug}`)}
                      />
                    </Fragment>
                  )
                )}
            </div>
          </Modal.Scrollable>{" "}
          <Modal.Button
            type={"open"}
            variant={"button"}
            onClick={handleSubmit(
              async (values) =>
                await alert({
                  type: "promise",
                  promise: addDetailsToMember(
                    Number(selectedRole.id),
                    memberData.id,
                    values
                  ),
                  msgs: {
                    loading: "Adding Member Details",
                  },
                  id: "member-detail-add",
                })
            )}
          >
            Update Details
          </Modal.Button>
        </form>
      </Modal.Content>
    </Modal>
  );
};
