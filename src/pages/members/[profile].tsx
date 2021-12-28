/*
 * Created By Anup Shrestha
 * Copyright (c) 2021. All rights reserved.
 * Last Modified 12/28/21, 8:57 PM
 *
 *
 */

import withAuth from "@/shared/hoc/withAuth";
import { withRole } from "@/shared/hoc/withRole";
import { MainLayout } from "@/layout/MainLayout";
import { GetServerSidePropsContext, NextPage } from "next";
import React, { useEffect, useState } from "react";
import {
  assignSubscriptionToMember,
  useMemberSubsDetails,
  useSubscriptionList,
} from "@/services/requests/subscriptionRequests";
import { useSubscriptionStore } from "@/modules/subscriptions/subscriptionStore";
import { useRouter } from "next/router";
import { useRoleDetails, useRoleList } from "@/services/requests/roleRequests";
import { getMemberTestList } from "@/services/requests/memberRequests";
import { memberStore } from "@/modules/members/memberStore";
import { ProfileSubscription } from "@/modules/members/profile/profileSubscription";
import { MemberDetailAddModal } from "@/modules/members/profile/memberDetailAddModal";
import { MemberProfileData } from "@/modules/members/profile/memberProfile";
import { MemberToggle } from "@/modules/members/profile/memberToggle";
import { WarningOctagon } from "phosphor-react";
import { SubscriptionDropdown } from "@/modules/members/modal/memberSubscriptionModal";
import { GrayButton } from "@/components/Button";
import { alert } from "@/components/Alert";
import { ProfileTest } from "@/modules/members/profile/ProfileTest";
import { useTestList } from "@/services/requests/testRequests";
import { MemberModal } from "@/modules/members/modal/memberModal";
import _ from "lodash";
import { useMemberList } from "@/modules/members/hooks/useMemberList";
import { useMemberDetails } from "@/modules/members/hooks/useMemberDetails";
import { Loader } from "@/components/Loader";

const MemberProfile: NextPage<any> = ({ idX }) => {
  const router = useRouter();

  const { isFetching: memberDetailsLoading, error } = useMemberDetails(
    Number(idX.id)
  );
  const { isFetching: memberSubsDetailsData } = useMemberSubsDetails(
    Number(idX.id)
  );
  const { data: roleDetailsData } = useRoleDetails(Number(idX.role));
  const { isLoading: testLoading } = useTestList();
  const { isLoading: subsLoading } = useSubscriptionList(Number(idX.role));
  const { isLoading: roleListLoading } = useRoleList();
  const { isLoading: memberLoading, data } = useMemberList(
    Number(idX.role),
    Number(idX.id)
  );

  const {
    selectedMemberSubscription,
    selectedTestInProfile,
    selectedRole,
    selectedMember,
  } = memberStore();

  const [active, setActive] = useState(selectedMember.active);
  const [verified, setVerified] = useState(selectedMember.verified);
  const { selectedSubscription, subscriptionList } = useSubscriptionStore();

  useEffect(() => {
    const listMemberTest = async () => {
      await getMemberTestList(Number(idX.id), Number(selectedTestInProfile.id));
    };

    Object.keys(selectedTestInProfile).length !== 0 && listMemberTest();
  }, [selectedTestInProfile.id]);

  useEffect(() => {
    data?.details && setActive(data?.details.active);
    data?.details && setVerified(data?.details.verified);
  }, [data]);

  console.log(error);

  return (
    <MainLayout>
      {subsLoading ||
      roleListLoading ||
      !roleDetailsData ||
      memberLoading ||
      memberSubsDetailsData ||
      memberDetailsLoading ||
      testLoading ? (
        <Loader />
      ) : (
        <>
          <div className="  flex gap-8 p-10 lg:flex-col 3xl:max-w-8xl 3xl:justify-center sm:p-8">
            <div className="w-3/4 space-y-8 lg:w-full">
              <MemberProfileData
                selectedMemberDetails={selectedMember}
                role={selectedRole}
                active={active}
                verified={verified}
              />

              <ProfileTest />
            </div>
            <div className=" w-1/4 lg:w-full h-auto lg:grid lg:grid-cols-2  flex flex-col sm:flex sm:flex-col gap-8 ">
              <ProfileSubscription memberId={Number(idX.id)} />
              {Object.keys(selectedMemberSubscription).length === 0 && (
                <div className=" print:hidden self-start flex flex-col w-full  bg-white rounded-xl ring-1 ring-black ring-opacity-10 py-6 px-6 space-y-4">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-800">
                      Subscriptions
                    </h1>
                    <p className="text-lg font-semibold text-gray-500">
                      Please choose a subscription to{" "}
                      {Object.keys(selectedMemberSubscription).length !== 0
                        ? "unlink"
                        : "link"}
                    </p>
                  </div>

                  {subscriptionList.list.length === 0 ? (
                    <div className="print:hidden flex items-center text-red-500 space-x-4">
                      <WarningOctagon size={40} />{" "}
                      <span className={"font-semibold"}>
                        No Subscription Found. Please add a subscription to this
                        role{" "}
                        <span
                          onClick={() => router.push("/subscriptions")}
                          className="cursor-pointer"
                        >
                          here
                        </span>
                      </span>
                    </div>
                  ) : (
                    Object.keys(selectedMemberSubscription).length === 0 && (
                      <>
                        <div className="flex items-center  space-x-4 w-full">
                          <div className={"w-[58%]"}>
                            <SubscriptionDropdown />
                          </div>
                          <div className={"w-1/2"}>
                            <GrayButton
                              onClick={async () => {
                                await alert({
                                  promise: assignSubscriptionToMember(
                                    Number(idX.id),
                                    Number(selectedSubscription.id)
                                  ),
                                  msgs: {
                                    loading: "Assigning Subscription",
                                  },
                                  id: "assign-subscription",
                                });
                              }}
                            >
                              Link
                            </GrayButton>
                          </div>
                        </div>
                      </>
                    )
                  )}
                </div>
              )}
              <div className="flex flex-col gap-8 print:hidden">
                <div className="w-full bg-white rounded-xl ring-1 ring-black ring-opacity-10 self-start py-2 px-4 flex flex-col divide-y-[1px] divide-gray-500/40">
                  <MemberModal
                    type={"edit"}
                    initialData={{
                      member_id: Number(idX.id),
                      ..._.omit(selectedMember, ["ref_key"]),
                    }}
                  />
                  <MemberDetailAddModal
                    memberData={selectedMember}
                    selectedRole={selectedRole}
                  />
                </div>
                <div className="flex flex-col  bg-white rounded-xl ring-1 ring-black ring-opacity-10 py-6 px-6 space-y-4">
                  <MemberToggle
                    toggle={"active"}
                    memberId={Number(idX.id)}
                    currentState={active}
                    setCurrentState={setActive}
                    selectedMemberDetails={selectedMember}
                  />
                  <MemberToggle
                    toggle={"verified"}
                    memberId={Number(idX.id)}
                    currentState={verified}
                    setCurrentState={setVerified}
                    selectedMemberDetails={selectedMember}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default withAuth(withRole(MemberProfile));

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {
      idX: context.query,
    },
  };
};
