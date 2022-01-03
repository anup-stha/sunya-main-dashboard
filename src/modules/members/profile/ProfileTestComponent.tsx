/*
 * Created By Anup Shrestha
 * Copyright (c) 2021-2022. All rights reserved.
 * Last Modified 1/3/22, 6:29 PM
 *
 *
 */

import React, { useEffect } from "react";
import { TestDropdown } from "@/modules/members/profile/TestDropdown";
import { useMemberStore } from "@/modules/members/useMemberStore";
import { utcToZonedTime } from "date-fns-tz";
import { TableView } from "@/components/Table";
import moment from "moment";
import { WarningOctagon } from "phosphor-react";
import { Tab } from "@headlessui/react";
import { getMemberTestList } from "@/services/requests/memberRequests";
import { useRouter } from "next/router";
import { Loader } from "@/components/Loader";
import {
  ProfileTestGridView,
  ProfileTestTableRow,
} from "@/modules/members/table/MemberProfileTestTable";
import { TestLineChart } from "@/components/charts/LineChart";
import Image from "next/image";

const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

type ProfileTestProps = {
  loading?: boolean;
};

export const ProfileTestComponent: React.FC<ProfileTestProps> = ({ loading }) => {
  const router = useRouter();

  const {
    selectedTestDetailsInProfile: testDetails,
    selectedMember,
    selectedTestInProfile,
  } = useMemberStore();

  useEffect(() => {
    const listMemberTest = async () => {
      await getMemberTestList(Number(router.query.id), Number(selectedTestInProfile.id));
    };

    Object.keys(selectedTestInProfile).length !== 0 && listMemberTest();
  }, [selectedTestInProfile.id]);

  const subTestDetails =
    Object.keys(testDetails).length !== 0 &&
    testDetails.list.map((element) => {
      return Object.assign(
        {},
        {
          app_slug: element.app_slug,
          test_date: element.test_date,

          tests: element.report.map((sub) => ({
            [sub.name]: sub.value,
            [`Note`]: sub.note,
          })),
        }
      );
    });

  const chartData =
    Object.keys(testDetails).length !== 0 &&
    testDetails.list.map((element) => {
      return Object.assign(
        {},
        {
          ...element.report.map((sub) => {
            return {
              [sub.slug]: {
                date: element.test_date,
                value: sub.value,
              },
            };
          }),
        }
      );
    });

  const tempData = chartData ? chartData.map((element) => Object.values(element)) : [];
  const initialData: any = [];
  tempData.forEach((element) => initialData.push(...element));

  const result = initialData.reduce((acc: any, curr: any) => {
    const key = Object.keys(curr)[0];
    const accKeys = Object.keys(acc);
    const found = accKeys.filter((element) => element === key)[0];
    if (!found) {
      acc[key] = {
        values: [curr[key].value],
        dates: [curr[key].date],
      };
    } else {
      acc[key] = {
        values: [...acc[key].values, curr[key].value],
        dates: [...acc[key].dates, curr[key].date],
      };
    }

    return acc;
  }, {});

  return loading ? (
    <Loader />
  ) : (
    <div className="print:ring-0 w-full bg-white rounded-xl sm:w-full  ring-1 ring-black ring-opacity-10 ">
      <div className={"p-6 flex flex-col space-y-8 sm:space-y-4"}>
        <div className=" flex items-center justify-between sm:flex-col sm:items-start sm:gap-4">
          <div className="print:hidden">
            <h1 className="text-gray-900 font-semibold text-3xl tracking-wider sm:text-2xl">
              Tests
            </h1>
            <h1 className="text-gray-500 font-medium text-lg print:hidden">
              Please choose a test to show results of that test
            </h1>
          </div>
          <div className="print:flex hidden flex-col  gap-4 w-full ">
            <div className="flex justify-between items-end w-full">
              <div className="flex flex-col gap-4">
                <h1 className="text-gray-900 font-semibold text-4xl tracking-wider">
                  {selectedTestInProfile.name} Report
                </h1>
                {selectedMember && (
                  <div>
                    <h1 className="text-gray-700 font-semibold text-2xl tracking-wider ">
                      Name: {selectedMember.name}
                    </h1>
                    <h1 className="text-gray-700 font-semibold text-2xl tracking-wider ">
                      Address: {selectedMember.address}
                    </h1>
                    <h1 className="text-gray-700 font-semibold text-2xl tracking-wider ">
                      Address: {selectedMember.gender}
                    </h1>
                    <h1 className="text-gray-700 font-semibold text-2xl tracking-wider">
                      Date of birth: {moment(selectedMember.dob_ad * 1000).format("DD/MM/YYYY")}
                    </h1>
                  </div>
                )}
              </div>
              <div>
                <Image src={"/sunya.png"} alt={"image"} height="140" width="230" />
              </div>
            </div>
            <div className="fixed bottom-20 w-full font-semibold">
              <div className="flex w-full items-center">
                <div>
                  Printed By Sunya Health ({" "}
                  <span className="text-green-700">{window.location.hostname}</span> ) on{" "}
                  {moment(new Date()).format("MMM Do YYYY")}
                </div>
              </div>
            </div>
          </div>
          <TestDropdown />
        </div>
        <div className="space-y-4">
          {Object.keys(testDetails).length !== 0 && <TestLineChart datas={result} />}

          {Object.keys(testDetails).length !== 0 ? (
            <Tab.Group>
              <div className="flex justify-between items-center ">
                <Tab.List className="space-x-4 print:hidden">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        selected
                          ? "py-3 px-10 rounded-sm text-xl bg-gray-800 text-white font-semibold"
                          : "py-3 px-10 rounded-sm text-xl  text-gray-700 font-semibold hover:bg-gray-200"
                      )
                    }
                  >
                    <div className="">Table</div>
                  </Tab>

                  <Tab
                    className={({ selected }) =>
                      classNames(
                        selected
                          ? "py-3 px-10 rounded-sm text-xl bg-gray-800 text-white font-semibold"
                          : "py-3 px-10 rounded-sm text-xl  text-gray-700 font-semibold hover:bg-gray-200"
                      )
                    }
                  >
                    Grid
                  </Tab>
                </Tab.List>
                <div
                  className={
                    "py-3 px-10 rounded-sm text-xl bg-gray-800 text-white font-semibold  print:hidden cursor-pointer"
                  }
                  onClick={() => window.print()}
                >
                  Print
                </div>
              </div>
              <hr className="border-t-[1px] border-gray-200" />

              <Tab.Panels>
                <Tab.Panel>
                  <TableView
                    data={subTestDetails}
                    tableHeadings={["Test App", "Test Date", "Test Result", "Test Notes"]}
                    tableRowComponent={<ProfileTestTableRow />}
                  />
                </Tab.Panel>
              </Tab.Panels>
              <Tab.Panel>
                <ProfileTestGridView testDetails={testDetails} />
              </Tab.Panel>
            </Tab.Group>
          ) : (
            <div className="flex  items-center text-xl font-semibold text-red-400 space-x-2 ">
              <WarningOctagon size={24} /> <span>No Test Details Found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const utcDateToLocal = (date: Date) => {
  // eslint-disable-next-line new-cap
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  try {
    return utcToZonedTime(new Date(date).getTime() * 1000, timezone).toLocaleString();
  } catch {
    return "Not Available";
  }
};
