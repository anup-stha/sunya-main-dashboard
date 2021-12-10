import withAuth from "@/hoc/withAuth";
import { withRole } from "@/hoc/withRole";
import { MainLayout } from "@/layout/MainLayout";
import { PasswordModal } from "@/modules/profile/passwordModal";
import Image from "next/image";

import { FacebookLogo, LinkedinLogo, TwitterLogo } from "phosphor-react";
import { Briefcase, Calendar, Mail, Map, PhoneCall } from "react-feather";
import CoverImage from "../../../public/assets/cover.png";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useState } from "react";
import { listSubscription } from "@/services/requests/subscriptionRequests";
import { useSubscriptionStore } from "@/modules/subscriptions/subscriptionStore";
import { useRouter } from "next/router";
import { listRoleDetails } from "@/services/requests/roleRequests";
import { SubscriptionDropdown } from "@/modules/members/modal/memberSubscriptionModal";
import { Button } from "@/components/Button";
import { alert } from "@/components/Alert";
import { assignSubscriptionToMember } from "@/services/requests/subscriptionRequests";

const MemberProfile: NextPage<any> = ({ idX }) => {
  const [role, setRole] = useState<any>({});
  const [roleLoading, setRoleLoading] = useState(false);
  const router = useRouter();

  const {
    setLoading,
    setSubscriptionList,
    loading,
    subscriptionList,
    selectedSubscription,
  } = useSubscriptionStore();

  useEffect(() => {
    const listSubscriptionFn = async (id: any) => {
      setLoading(true);
      setRoleLoading(true);

      await listSubscription(id)
        .then((res) => {
          console.log(res);
          setSubscriptionList(res.data.data);
          setLoading(false);
        })
        .catch(() => {
          router.push("/404");
          setLoading(false);
        });

      await listRoleDetails(Number(idX.role))
        .then((res) => {
          setRoleLoading(false);
          setRole(res.data.data);
        })
        .catch(() => {
          setRoleLoading(false);
          router.push("/404");
        });
    };

    listSubscriptionFn(Number(idX.role));
  }, []);

  return (
    <MainLayout>
      {loading || roleLoading ? (
        <div>Loading</div>
      ) : (
        <>
          <div className="flex gap-8 p-8 sm:flex-col 3xl:max-w-8xl 3xl:justify-center sm:p-4">
            <div className="w-3/4 space-y-8">
              <div className="relative w-full bg-white rounded-xl sm:w-full ring-1 ring-black ring-opacity-10">
                <div className="relative w-full h-52 z-0">
                  <Image
                    src={CoverImage}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="50% 35%"
                    className="rounded-t-xl z-40"
                    placeholder="blur"
                    alt="Cover Image"
                  />
                </div>

                <div className="absolute left-[3%] top-40 z-0 flex items-center gap-x-6">
                  <div className="relative w-40 h-40 z-10 ring-4 ring-white rounded-full">
                    <Image
                      src="/assets/profile.jpg"
                      layout="fill"
                      objectFit="cover"
                      className="z-40 rounded-full"
                      alt="Profile Image"
                    />
                  </div>
                  <div className="flex flex-col mt-10">
                    <h1 className="text-gray-900 font-semibold text-3xl tracking-wider sm:text-2xl">
                      Drakin Plywood
                    </h1>
                    <p className="text-gray-500 font-semibold text-xl sm:text-lg">
                      {role.name}
                    </p>
                  </div>
                </div>
                <div className="px-6 py-6 min-h-[10rem] sm:px-2">
                  <div className="ml-[20%] flex justify-between items-center sm:items-start sm:ml-0 ">
                    <div className="sm:hidden"></div>
                    <div className="flex items-center gap-1 sm:mt-24 sm:ml-4">
                      <p className="text-gray-800 text-xl font-semibold">
                        Share
                      </p>
                      <FacebookLogo
                        size={32}
                        weight="fill"
                        className="text-blue-600 cursor-pointer"
                      />
                      <TwitterLogo
                        size={32}
                        weight="fill"
                        className="text-blue-400 cursor-pointer"
                      />
                      <LinkedinLogo
                        size={32}
                        weight="fill"
                        className="text-blue-700 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="mt-20 font-medium text-gray-700 flex gap-x-6 sm:flex-col sm:gap-y-4">
                    <div className="  p-6 bg-gray-50 w-2/5 text-xl rounded-lg flex flex-col gap-4 sm:w-full ">
                      <p className="text-2xl font-semibold text-gray-900">
                        Personal Info
                      </p>
                      <div className="flex items-center gap-x-4">
                        <div className="text-gray-800">
                          <Briefcase />
                        </div>
                        <span>Sunya Health</span>
                      </div>
                      <div className="flex gap-x-4">
                        <div className="text-gray-800">
                          <Mail />
                        </div>
                        <span>anup.stha012@gmail.com</span>
                      </div>
                      <div className="flex items-center gap-x-4">
                        <div className="text-gray-800">
                          <Map />
                        </div>
                        <span>Illachen-17, Sundhara</span>
                      </div>
                      <div className="flex items-center gap-x-4">
                        <div className="text-gray-800">
                          <PhoneCall />
                        </div>
                        <span>9840748111</span>
                      </div>
                      <div className="flex items-center gap-x-4">
                        <div className="text-gray-800">
                          <Calendar />
                        </div>
                        <span>Date joined: 2021/11/25</span>
                      </div>
                    </div>
                    <div className="w-3/5 text-lg flex flex-col gap-6 font-medium text-gray-70 sm:w-full">
                      <div className="bg-gray-50 h-1/2 p-6 rounded-lg flex flex-col justify-between">
                        <p className="text-2xl font-semibold text-gray-900">
                          Short Summary
                        </p>
                        <span>
                          Lorem ipsum dolor sit amet consectetur, adipisicing
                          elit. Est, harum eveniet! Rerum cupiditate dolores
                          nobis soluta
                        </span>
                      </div>

                      <div className="bg-gray-50 h-1/2 p-4 rounded-lg flex sm:w-full">
                        <div className="flex flex-col justify-between w-3/4 p-2 ">
                          <div className="flex justify-between items-center">
                            <p className="text-2xl font-semibold text-gray-900">
                              Activity
                            </p>
                          </div>

                          <span>14 users added today</span>
                          <span>34 organisations added today</span>
                        </div>
                        <div className="w-1/4 border-l-2 border-gray-300 flex items-center justify-center">
                          <p className="text-green-500 text-xl font-bold cursor-pointer sm:whitespace-nowrap sm:pl-2">
                            See More
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" w-full bg-white rounded-xl sm:w-full ring-1 ring-black ring-opacity-10">
                <div className="p-6 space-y-8">
                  <h1 className="text-gray-900 font-semibold text-3xl tracking-wider sm:text-2xl">
                    Subscriptions
                  </h1>
                  <div className="flex items-center">
                    {subscriptionList.length === 0 ? (
                      <p className="text-2xl font-semibold text-gray-700">
                        No Subscription Found. Please add a subscription to this
                        role
                      </p>
                    ) : (
                      <div className="w-1/3 space-y-4">
                        <p className="text-2xl font-semibold text-gray-700">
                          Please select a subscription to add
                        </p>
                        <div className="flex items-center space-x-4">
                          <SubscriptionDropdown />{" "}
                          <Button
                            onClick={async () => {
                              await alert({
                                promise: assignSubscriptionToMember(
                                  Number(idX.id),
                                  Number(selectedSubscription.id)
                                ),
                                msgs: {
                                  loading: "Assiging Subscription",
                                },
                                id: "assign-subscription",
                              });
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/4 h-auto bg-white rounded-xl sm:w-full ring-1 ring-black ring-opacity-10 py-2 px-4 self-start">
              <div className="hover:text-gray-850 p-6 border-b-2 border-gray-200 text-gray-500 text-xl font-semibold cursor-pointer">
                Update Public Profile Info
              </div>
              <PasswordModal />
              <div className="p-6  text-gray-500 text-xl font-semibold cursor-pointer hover:text-gray-850">
                Log Out
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
