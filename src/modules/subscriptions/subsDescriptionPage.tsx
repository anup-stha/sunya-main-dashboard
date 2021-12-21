/*
 * Created By Anup Shrestha
 * Copyright (c) 2021. All rights reserved.
 * Last Modified 12/20/21, 5:39 PM
 *
 *
 */

import React, { Fragment, useState } from "react";
import { Tab } from "@headlessui/react";
import { useSubscriptionStore } from "@/modules/subscriptions/subscriptionStore";
import { BooleanTag } from "@/components/others/BooleanTag";
import Image from "next/image";
import { alert } from "@/components/Alert";
import {
  assignTestToSubscription,
  removeTestFromSubscription,
} from "@/services/requests/subscriptionRequests";
import { TableView } from "@/components/Table";
import { Button, RedLineButton } from "@/components/Button";
import { testStore } from "@/modules/tests/testStore";
import { useForm } from "react-hook-form";
import { DropdownController } from "../roles/form/roleMemberCategoryForm";
import { TestSubCategory } from "@/types";
import { useRouter } from "next/router";

const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

type SubsDescriptionPage = {
  selected: any;
};

export const SubsDescriptionPage: React.FC<SubsDescriptionPage> = ({
  selected,
}) => {
  const { testList } = testStore();
  const { subscriptionDetails } = useSubscriptionStore();
  const [selectedId, setSelectedId] = useState(
    subscriptionDetails[0] ? subscriptionDetails[0].id : testList[0].id
  );

  const selectedTest = testList.filter(
    (element) => element.id === selectedId
  )[0];

  const getTestSubCategory = (testId: number) =>
    testList.filter((element) => element.id === testId)[0].sub_categories;

  const tabs = testList.map(
    (test) =>
      subscriptionDetails.filter((subs) => {
        if (subs.id === test.id) return { [test.id]: subs };
      })[0]
  );
  const tabArray = Object.values(tabs);

  return (
    <div className="px-10 py-10 overflow-visible sm:p-8 w-full space-y-4">
      <div className="flex flex-col">
        <h1 className="text-4xl font-semibold text-neutral-800 capitalize">
          {selected ? selected.name : ""}
        </h1>
        <p className="text-xl font-semibold text-neutral-500 pl-1">
          {selected ? selected.slug : ""}
        </p>
      </div>
      <hr />
      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold text-neutral-800 capitalize">
          Tests
        </h1>
      </div>

      <div className="w-full flex gap-6 ">
        <Tab.Group vertical>
          <Tab.List className="w-1/4 sm:w-full h-full flex flex-col  bg-white shadow-sm rounded-md overflow-hidden">
            {testList.map((test) => (
              <Tab as={Fragment} key={test.id}>
                {({ selected }) => (
                  <button
                    onClick={() => {
                      console.log(test.id);
                      setSelectedId(Number(test.id));
                    }}
                    className={classNames(
                      selected
                        ? "w-full py-4 px-6 border-green-500 border-r-4 bg-neutral-700 text-white cursor-pointer text-left"
                        : '"w-full py-4 px-6 border-green-500 text-neutral-700 border-b-[1px] text-left border-neutral-200 cursor-pointer hover:bg-gray-200 '
                    )}
                  >
                    <span className="text-xl font-medium capitalize">
                      {test.name}
                    </span>
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="w-3/4 h-full bg-white rounded-md px-8 py-8 shadow-sm ">
            {tabArray.map((test, index) => {
              if (test === undefined)
                return (
                  <Tab.Panel key={index}>
                    <div className={"flex flex-col space-y-4"}>
                      <div className="flex flex-col">
                        <h1 className="text-3xl font-semibold text-neutral-700 capitalize">
                          {selectedTest.name}
                        </h1>
                        <div className="flex space-x-2">
                          <BooleanTag
                            type={"info"}
                            trueStatement={`Slug: ${selectedTest.slug}`}
                          />
                          <BooleanTag
                            type={"info"}
                            trueStatement={`Public:${
                              selectedTest.public ? " Yes" : " No"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <SubsTestDropdown
                          label={"Choose a test"}
                          options={getTestSubCategory(Number(selectedId))}
                        />
                      </div>
                    </div>
                  </Tab.Panel>
                );
              const subCategories = test.sub_categories.map((subTest: any) => ({
                ...subTest,
                category_name: test.name,
                category_desc: test.desc,
              }));

              return (
                <Tab.Panel key={index}>
                  <div className={"space-y-4 w-full"}>
                    <div className={"flex items-center justify-between w-full"}>
                      <div className="space-y-1">
                        <h1 className="text-3xl font-semibold text-neutral-700 capitalize">
                          {test.name}
                        </h1>
                        <div className="flex space-x-2">
                          <BooleanTag
                            type={"info"}
                            trueStatement={`Slug: ${test.slug}`}
                          />
                          <BooleanTag
                            type={"info"}
                            trueStatement={`Public:${
                              test.public ? " Yes" : " No"
                            }`}
                          />
                        </div>
                      </div>{" "}
                      <div className={"flex"}>
                        <SubsTestDropdown
                          options={getTestSubCategory(test.id)}
                        />
                      </div>
                    </div>
                    <TableView
                      data={subCategories}
                      tableHeadings={[
                        "Name",
                        "Slug",
                        "Public",
                        "Description",

                        "",
                      ]}
                      tableRowComponent={<SubscriptionSubTestTableRow />}
                      loading={false}
                    />
                  </div>
                </Tab.Panel>
              );
            })}
          </Tab.Panels>
        </Tab.Group>
      </div>

      <hr />
      <div></div>
    </div>
  );
};

const SubscriptionSubTestTableRow = ({ data }: any) => {
  return data ? (
    <tr className={"text-lg"}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="relative flex-shrink-0 h-16 w-16">
            <Image
              src={"/sub_test.png"}
              layout="fill"
              objectFit="cover"
              className=""
              alt="Profile"
            />
          </div>
          <div className="ml-4">
            <div className="text-xl font-semibold text-gray-900 w-full capitalize">
              {data.name}
            </div>
            <div className="text-lg font-medium text-gray-500">
              {data.category_name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <BooleanTag type={"info"} trueStatement={data.slug}></BooleanTag>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <BooleanTag
          type={"info"}
          trueStatement={data.public ? "Yes" : "No"}
        ></BooleanTag>
      </td>
      <td className="px-6 py-4">{data.desc}</td>
      <td className="font-medium px-6 py-4 whitespace-nowrap text-lg flex items-center justify-end">
        <RedLineButton
          onClick={async () =>
            alert({
              type: "promise",
              promise: removeTestFromSubscription(data.category_id, data.id),
              msgs: {
                loading: "Removing Test",
              },
              id: "remove-test-from-id",
            })
          }
        >
          Remove Test
        </RedLineButton>
      </td>
    </tr>
  ) : (
    <tr></tr>
  );
};

type SubTestDropdown = {
  options: TestSubCategory[];
  label?: string;
};

export const SubsTestDropdown: React.FC<SubTestDropdown> = ({
  options,
  label = "",
}) => {
  const { handleSubmit, control } = useForm();
  const router = useRouter();

  const subtestOptions =
    options.length !== 0
      ? options.map((element) => ({
          value: `${element.id}-${element.name}`,
          label: element.name,
        }))
      : [];

  return (
    <form
      onSubmit={handleSubmit(
        async (data) =>
          await alert({
            type: "promise",
            promise: assignTestToSubscription(
              Number(options[0].category_id),
              Number(data.sub_test.split("-")[0]),
              Number(router.query.id)
            ),
            msgs: {
              loading: "Assigning",
            },
            id: "Test-assign",
          })
      )}
      className={"flex lg:w-full space-x-4 items-end"}
    >
      <div className={"w-64"}>
        <DropdownController
          options={subtestOptions}
          name={"sub_test"}
          label={label}
          control={control}
        />
      </div>

      <Button>Assign</Button>
    </form>
  );
};