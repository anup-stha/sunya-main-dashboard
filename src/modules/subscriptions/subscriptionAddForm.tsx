/*
 * Created By Anup Shrestha
 * Copyright (c) 2021-2022. All rights reserved.
 * Last Modified 1/25/22, 9:27 PM
 *
 *
 */
import { PrimaryInput } from "@/components/Input";

import { useForm } from "react-hook-form";
import { Modal } from "@/components/Modal/useModal";
import { alert } from "@/components/Alert";
import {
  addSubscription,
  updateSubscription,
} from "@/services/requests/subscriptionRequests";
import { Button } from "@/components/Button";
import React from "react";
import { DropdownController } from "@/modules/roles/form/roleMemberCategoryForm";
import { useGlobalState } from "@/modules/useGlobalState";
import { useSubscriptionStore } from "@/modules/subscriptions/subscriptionStore";
import { useCurrentMemberStore } from "@/modules/member/utils/useCurrentMemberStore";

type memberCategoryFormProps = {
  type: "add" | "edit";
  id?: number;
};

type SubscriptionFormData = {
  name: string | undefined;
  price: number | undefined;
  test_limit: number | undefined;
  interval_type: string | undefined;
  interval_value: number | undefined;
  grace_period: number | undefined;
  sync_limit: number | undefined;
};

export const SubscriptionForm: React.FC<memberCategoryFormProps> = ({
  type,
  id,
}) => {
  const selectedRole = useCurrentMemberStore((state) => state.role);

  const { subscriptionList } = useSubscriptionStore();
  const data: any = subscriptionList.list.filter(
    (element) => element.id === id
  )[0];

  const { register, handleSubmit, control } = useForm<SubscriptionFormData>({
    defaultValues:
      type === "add"
        ? {
            name: undefined,
            price: undefined,
            test_limit: undefined,
            interval_type: undefined,
            interval_value: undefined,
            grace_period: undefined,
            sync_limit: undefined,
          }
        : {
            name: data.name,
            price: data.price.replace(/[^\d\.]*/g, ""),
            test_limit: Number(data.test_limit),
            interval_type: data.interval_type,
            interval_value: Number(data.interval_value),
            grace_period: Number(data.grace_period),
            sync_limit: Number(data.sync_limit),
          },
  });

  const options = useGlobalState
    .getState()
    .base.subscription_intervals.map((element) => ({
      value: element,
      label: element,
    }));

  return (
    <Modal.Form
      onSubmit={handleSubmit(async (data) => {
        type === "add"
          ? await alert({
              promise: addSubscription({
                role_id: Number(selectedRole.id),
                name: String(data.name),
                price: Number(data.price),
                test_limit: Number(data.test_limit),
                interval_type: String(data.interval_type),
                interval_value: Number(data.interval_value),
                grace_period: Number(data.grace_period),
                sync_limit: Number(data.sync_limit),
              }),
              msgs: {
                loading: "Adding Subscription",
              },
              id: "subscription-add",
            })
          : await alert({
              promise: updateSubscription(
                {
                  name: String(data.name),
                  price: Number(data.price),
                  test_limit: Number(data.test_limit),
                  interval_type: String(data.interval_type),
                  interval_value: Number(data.interval_value),
                  grace_period: Number(data.grace_period),
                  sync_limit: Number(data.sync_limit),
                },
                Number(id)
              ),
              msgs: {
                loading: "Updating Subscription",
              },
              id: "subscription-add",
            });
      })}
    >
      <div className="space-y-4">
        <PrimaryInput
          label="Name"
          type="text"
          placeholder="Enter Name"
          required={true}
          {...register("name")}
        />
        <PrimaryInput
          label="Price"
          placeholder="Enter Price"
          {...register("price")}
        />

        <div className="flex space-x-4">
          <div className="w-1/2">
            <DropdownController
              options={options}
              name={"interval_type"}
              label={"Interval Type"}
              control={control}
            />
          </div>
          <div className="w-1/2">
            <PrimaryInput
              label="Interval Value"
              type="number"
              min="0"
              placeholder="Enter Interval Value"
              {...register("interval_value")}
            />
          </div>
        </div>

        <PrimaryInput
          label="Grace Period"
          type="number"
          min="0"
          placeholder="Enter Grace Period"
          {...register("grace_period")}
        />
        <div className="flex space-x-4">
          <div className="w-1/2">
            <PrimaryInput
              label="Sync Limit"
              type="number"
              placeholder="Enter Sync Limit"
              min="0"
              {...register("sync_limit")}
            />
          </div>
          <div className="w-1/2">
            <PrimaryInput
              label="Test Limit"
              type="number"
              placeholder="Enter Test Limit"
              min="0"
              {...register("test_limit")}
            />
          </div>
        </div>
      </div>

      <Button>{type === "add" ? "Add" : "Edit"} Subscription</Button>
    </Modal.Form>
  );
};
