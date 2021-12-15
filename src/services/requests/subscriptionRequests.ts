/*
 * Created By Anup Shrestha
 * Copyright (c) 2021. All rights reserved.
 * Last Modified 12/15/21, 9:13 AM
 *
 *
 */

/* eslint-disable camelcase */
import { useSubscriptionStore } from "@/modules/subscriptions/subscriptionStore";
import {
  MemberSubscriptionDetailsResponse,
  SubscriptionAddResponse,
  SubscriptionBody,
  SubscriptionDetails,
  SubscriptionListResponse,
} from "@/types";
import { AxiosResponse } from "axios";
import { privateAgent } from ".";
import { memberStore } from "@/modules/members/memberStore";
import useSWRImmutable from "swr";

export const getSubscription = (
  id: number | string
): Promise<AxiosResponse<SubscriptionListResponse>> => {
  return privateAgent.get(`subscription/${id}`);
};

const listSubscription = (url: string) =>
  privateAgent
    .get<SubscriptionListResponse>(url)
    .then((response) => {
      useSubscriptionStore.getState().setSubscriptionList(response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      return error.response;
    });

export const useSubscriptionList = (roleId: number) => {
  return useSWRImmutable(`subscription/${roleId}`, listSubscription);
};

export const addSubscription = (data: SubscriptionBody) => {
  return new Promise((resolve, reject) =>
    privateAgent
      .post<SubscriptionAddResponse>(`subscription/`, data)
      .then((response) => {
        useSubscriptionStore
          .getState()
          .setSubscriptionList([
            ...useSubscriptionStore.getState().subscriptionList,
            response.data.data,
          ]);
        resolve(response.data.message);
      })
      .catch((error) => reject(error.response))
  );
};

export const assignSubscriptionToMember = (
  member_id: number,
  subscription_id: number
) => {
  return new Promise((resolve, reject) =>
    privateAgent
      .put<any>(`subscription/member/assign`, {
        member_id: member_id,
        subscription_id: subscription_id,
      })
      .then(async (response) => {
        await getMemberSubscriptionDetails(member_id).then(() => {
          resolve(response.data.message);
        });
      })
      .catch((error) => reject(error.response))
  );
};

export const getMemberSubscriptionDetails = (member_id: number) => {
  return new Promise((resolve, reject) =>
    privateAgent
      .get<MemberSubscriptionDetailsResponse>(
        `member/subscription/${member_id}`
      )
      .then((response) => {
        memberStore
          .getState()
          .setSelectedMemberSubscription(response.data.data);
        useSubscriptionStore
          .getState()
          .setSubscription(response.data.data.plan);
        resolve(response.data.message);
      })
      .catch((error) => {
        memberStore
          .getState()
          .setSelectedMemberSubscription({} as SubscriptionDetails);
        reject(error.response);
      })
  );
};

export const listMemberSubscriptionDetails = (url: string) =>
  privateAgent
    .get<MemberSubscriptionDetailsResponse>(url)
    .then((response) => {
      memberStore.getState().setSelectedMemberSubscription(response.data.data);
      useSubscriptionStore.getState().setSubscription(response.data.data.plan);
      return response.data.data;
    })
    .catch((error) => {
      memberStore
        .getState()
        .setSelectedMemberSubscription({} as SubscriptionDetails);
      return error.response;
    });

export const useMemberSubsDetails = (memberId: number) => {
  return useSWRImmutable(
    `member/subscription/${memberId}`,
    listMemberSubscriptionDetails
  );
};
