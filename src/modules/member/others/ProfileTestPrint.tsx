/*
 * Created By Anup Shrestha
 * Copyright (c) 2022. All rights reserved.
 * Last Modified 1/25/22, 8:56 PM
 *
 *
 */

import React from "react";
import moment from "moment";
import Image from "next/image";
import { isServer } from "@/services/isServer";
import { utcDateToLocal } from "@/modules/member/utils/utcDateToLocal";
import { Member } from "@/modules/member/types";

type ProfileTestData = {
  app_slug: string;
  test_date: Date;
  tests: { [p: string]: any }[];
};

type PrintTestComponentProps = {
  test_name: string;
  test: ProfileTestData[];
  member: Member;
};

type PrintProps = React.DetailedHTMLProps<
  React.AllHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  PrintTestComponentProps;

export const ProfileTestPrint = React.forwardRef<HTMLDivElement, PrintProps>(
  ({ test_name, test, member }, ref) => {
    return (
      <div className="hidden print:flex w-full" ref={ref}>
        <div className="page-header w-full">
          <div className="flex flex-col space-y-8 w-full">
            <div className="flex justify-between items-end w-full">
              <div className="flex flex-col gap-4">
                <h1 className="text-gray-900 font-semibold text-4xl tracking-wider">
                  {test_name} Report
                </h1>
                {member && (
                  <div>
                    <h1 className="text-gray-700 font-semibold text-2xl tracking-wider capitalize">
                      Id: {member.member_code}
                    </h1>
                    <h1 className="text-gray-700 font-semibold text-2xl tracking-wider capitalize">
                      Name: {member.name}
                    </h1>
                    <h1 className="text-gray-700 font-semibold text-2xl tracking-wider ">
                      Address: {member.address}
                    </h1>
                    <h1 className="text-gray-700 font-semibold text-2xl tracking-wider ">
                      Address: {member.gender}
                    </h1>
                    <h1 className="text-gray-700 font-semibold text-2xl tracking-wider">
                      Date of birth:{" "}
                      {moment(member.dob_ad * 1000).format("DD/MM/YYYY")}
                    </h1>
                  </div>
                )}
              </div>

              <div className="self-center flex flex-col items-center">
                <Image
                  src="/sunya.svg"
                  layout="fixed"
                  width={220}
                  height={80}
                  objectFit="contain"
                  alt="Profile Image"
                  priority={true}
                />{" "}
                <h1 className="text-slate-900 font-semibold text-xl tracking-wider pt-4 ">
                  Kathmandu, Nepal
                </h1>
                <h1 className="text-slate-900 font-semibold text-xl tracking-wider ">
                  Email: contact@sunya.health
                </h1>
              </div>
            </div>
            <div className="bg-gray-100 w-full mr-4 grid grid-cols-3">
              <span className="px-6 pb-3 pt-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">
                Test Date
              </span>
              <span className="px-6 pb-3 pt-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">
                Test Result
              </span>
              <span className="px-6 pb-3 pt-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">
                Test Notes
              </span>
            </div>
          </div>
        </div>

        <div className="page-footer">
          <div className="flex w-full items-center">
            <div>
              Printed By Sunya Health ({" "}
              <span className="text-green-700">
                {!isServer && window.location.hostname}
              </span>{" "}
              ) on {moment(new Date()).format("MMM Do YYYY")}
            </div>
          </div>
        </div>

        <table className="w-full table-fixed">
          <thead className="">
            <tr>
              <td>
                <div className="page-header-space" />
              </td>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 w-screen">
            {test.map((data, index) => (
              <tr key={index} className="w-full">
                <td className="capitalize py-4 text-xl space-y-2 whitespace-nowrap  ">
                  <div className="">
                    <span className="block">
                      {moment(utcDateToLocal(data.test_date)).format(
                        "MM/DD/YYYY"
                      )}
                    </span>
                    <span className={"block"}>
                      {moment(utcDateToLocal(data.test_date)).format("h:mm A")}
                    </span>
                  </div>
                </td>
                <td className="capitalize py-4 text-xl space-y-2 break-words ">
                  {data.tests.map((element, index) => (
                    <div key={index} className="text-gray-700">
                      <span className="inline font-medium text-gray-500 block">
                        {Object.keys(element)[0]} :{" "}
                      </span>
                      <span className="inline font-semibold block text-lg ">
                        {Object.values(element)[0]}
                      </span>
                    </div>
                  ))}
                </td>
                <td className="capitalize py-4 text-xl space-y-2 text-gray-600 break-words">
                  {data.tests.map((element, index) => (
                    <div key={index} className="text-gray-700 ">
                      <span className="font-medium text-gray-500 inline">
                        {Object.keys(element)[1]} :{" "}
                      </span>
                      <span className="font-semibold block text-lg inline">
                        {Object.values(element)[1].length === 0
                          ? "N/A"
                          : Object.values(element)[1].map(
                              (element: any, index: number) => (
                                <span
                                  key={index}
                                  className="line-clamp-1 block"
                                >
                                  {" "}
                                  {element}{" "}
                                </span>
                              )
                            )}
                      </span>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <div className="page-footer-space" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
);

ProfileTestPrint.displayName = "ProfileTestPrint";