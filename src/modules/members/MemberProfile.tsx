/*
 * Created By Anup Shrestha
 * Copyright (c) 2021-2022. All rights reserved.
 * Last Modified 1/23/22, 2:28 PM
 *
 *
 */

import React, { useEffect, useState } from "react";

import Image from "next/image";
import Error from "../../../public/assets/404.svg";
import { useRouter } from "next/router";

import { ProfileAllDetails } from "@/modules/members/profile/ProfileAllDetails";
import { ProfileTestComponent } from "@/modules/members/profile/ProfileTestComponent";
import { useMemberStore } from "@/modules/members/useMemberStore";
import { ProfileSubscription } from "@/modules/members/profile/ProfileSubscription";
import { useMemberDetails } from "@/modules/members/api/hooks/useMemberDetails";
import {
  useMemberSubsDetails,
  useSubscriptionList,
} from "@/services/requests/subscriptionRequests";
import { useRoleDetails, useRoleList } from "@/services/requests/roleRequests";
import { useTestList } from "@/services/requests/testRequests";
import { useMembersList } from "@/modules/members/api/hooks/useMembersList";
import { Loader } from "@/components/Loader";

import { MemberProfileControls } from "@/modules/members/others/MemberProfileControls";
import { usePatientMedHistory } from "@/modules/members/api/hooks/usePatientMedHistory";
import { TableView } from "@/components/Table";
import omit from "lodash/omit";
import { WarningOctagon } from "phosphor-react";
import { ProfileMemberTable } from "@/modules/members/profile/ProfileMemberTable";
import { useRoleListBySlug } from "@/modules/roles/hooks/useRoleListBySlug";

export const MemberProfile: React.FC = () => {
  const router = useRouter();
  const idX = {
    id: router.query.id,
    role: router.query.role,
    profile: router.query.profile,
    parent_page: router.query.p_page,
  };

  const { isFetching: memberDetailsLoading } = useMemberDetails(Number(idX.id));
  const { data: roleDetailsData } = useRoleDetails(Number(idX.role));
  const { isLoading: testLoading } = useTestList();
  const { isFetching: subsLoading } = useSubscriptionList(Number(idX.role));
  const { isLoading: roleListLoading } = useRoleList();
  const { isLoading: memberLoading } = useMembersList(
    Number(idX.role),
    Number(idX.id),
    Number(idX.parent_page)
  );
  const { isFetching: memberSubsFetching } = useMemberSubsDetails(
    Number(router.query.id)
  );
  const { isLoading: roleListBySlugLoading } = useRoleListBySlug(
    !Array.isArray(router.query.profile) &&
      router.query.profile &&
      router.query.profile !== "patient"
      ? router.query.profile
      : ""
  );

  const loading =
    memberSubsFetching ||
    subsLoading ||
    roleListLoading ||
    !roleDetailsData ||
    memberLoading ||
    memberDetailsLoading ||
    testLoading ||
    roleListBySlugLoading;

  const selectedMember = useMemberStore((state) => state.selectedMember);
  const selectedRole = useMemberStore((state) => state.selectedRole);
  const otherDetails = useMemberStore((state) => state.selectedMemberDetails);

  const [active, setActive] = useState(
    selectedMember ? selectedMember.active : false
  );
  const [verified, setVerified] = useState(
    selectedMember ? selectedMember.verified : false
  );

  useEffect(() => {
    if (selectedMember) {
      setActive(selectedMember.active);
      setVerified(selectedMember.verified);
    }
  }, [selectedMember]);

  useEffect(() => {
    selectedMember &&
      useMemberStore.getState().setCurrentMember(selectedMember);
  }, [selectedMember]);

  return loading ? (
    <Loader />
  ) : !selectedMember ? (
    <div className="flex items-center justify-center h-[80vh]">
      <Image src={Error} alt="Error" />
    </div>
  ) : (
    <div className="flex gap-8 p-10 lg:flex-col 3xl:max-w-8xl 3xl:justify-center sm:p-6">
      <div className="w-3/4 space-y-8 lg:w-full">
        <ProfileAllDetails
          active={active}
          verified={verified}
          selectedMember={selectedMember}
          selectedRole={roleDetailsData?.data.data}
        />
        {selectedRole.slug === "patient" ||
        selectedRole.slug === "individual" ? (
          <>
            {selectedMember && (
              <ProfileTestComponent selectedMember={selectedMember} />
            )}
            <ProfileMedicalHistory />
          </>
        ) : (
          <ProfileMemberTable />
        )}
      </div>
      <div className="w-1/4 lg:w-full h-auto lg:grid lg:grid-cols-2  flex flex-col sm:flex sm:flex-col gap-8 ">
        <ProfileSubscription />
        <MemberProfileControls
          active={active}
          verified={verified}
          setActive={setActive}
          setVerified={setVerified}
          selectedMember={selectedMember}
          otherDetails={otherDetails}
          selectedRole={roleDetailsData?.data.data}
        />
      </div>
    </div>
  );
};

export const ProfileMedicalHistory = () => {
  const router = useRouter();
  const { isLoading } = usePatientMedHistory(Number(router.query.id));
  const patientMedicalHistoryList = useMemberStore(
    (state) => state.patientMedicalHistoryList.data
  );
  return (
    <div className="print:hidden w-full bg-white rounded-xl sm:w-full  ring-1 ring-black ring-opacity-10 p-6 space-y-8">
      <div className="print:hidden">
        <h1 className="text-gray-900 font-semibold text-3xl tracking-wider sm:text-2xl">
          Patient Medical History
        </h1>
        <h1 className="text-gray-500 font-medium text-lg print:hidden">
          Medical History of Patient taken from Sunya Health Apps
        </h1>
      </div>

      {!isLoading && patientMedicalHistoryList.length !== 0 ? (
        <TableView
          data={patientMedicalHistoryList.map((element) =>
            omit(element, ["id", "detail_category_id"])
          )}
        />
      ) : (
        <div className="flex  items-center text-xl font-semibold text-red-400 space-x-2 ">
          <WarningOctagon size={24} />{" "}
          <span>No Patient Medical Details Found</span>
        </div>
      )}
    </div>
  );
};
