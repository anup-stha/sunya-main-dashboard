/*
 * Created By Anup Shrestha
 * Copyright (c) 2021. All rights reserved.
 * Last Modified 12/11/21, 9:58 AM
 *
 *
 */

import Image from "next/image";
import { LabelInput } from "@/components/Input";
import { Field, Formik } from "formik";
import { Button, GrayButton } from "@/components/Button";
import { Modal } from "@/components/Modal/useModal";

export const PasswordModal = () => {
  return (
    <Modal>
      <Modal.Button type="open">
        <div className=" p-6 border-b-2 border-gray-200 text-gray-500 text-xl font-semibold cursor-pointer hover:text-gray-850">
          Change Password
        </div>
      </Modal.Button>
      <Modal.Content width="6xl">
        <div className="flex flex-col space-y-16 sm:-space-y-12">
          <Modal.Title>Change Password</Modal.Title>
          <div className="flex items-center w-full space-x-8 sm:flex-col-reverse">
            <Formik
              initialValues={{
                oldPassword: "",
                password: "",
                confirmPassword: "",
              }}
              onSubmit={(values) => console.log(values)}
            >
              {() => (
                <form className="w-1/2 space-y-16 sm:w-full sm:space-y-8">
                  <div className="space-y-8">
                    <Field
                      name="Old Password"
                      type="password"
                      component={LabelInput}
                      placeholder={"Enter Old Password"}
                    />
                    <Field
                      name="New Password"
                      type="password"
                      component={LabelInput}
                      placeholder={"Enter New Password"}
                    />
                    <Field
                      name="Confirm Password"
                      type="password"
                      component={LabelInput}
                      placeholder={"Confirm New Password"}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Modal.Button type="close">
                      <Button>Change</Button>
                    </Modal.Button>
                    <Modal.Button type="close">
                      <GrayButton>Cancel</GrayButton>
                    </Modal.Button>
                  </div>
                </form>
              )}
            </Formik>
            <div className="w-1/2 -mt-40 sm:mt-10 flex flex-col items-center -space-y-6  sm:space-y-0 sm:w-full">
              <div className="relative h-8xl w-full sm:h-7xl sm:-ml-12  ">
                <Image
                  src="/assets/change-password.svg"
                  alt="Change Password"
                  objectFit="contain"
                  layout="fill"
                />
              </div>
              <div className="flex flex-col items-center sm:hidden ">
                <h1 className="text-2xl sm:text-xl font-semibold text-green-600">
                  New Password must contain
                </h1>
                <div className=" text-xl sm:text-base sm:items-start font-medium text-gray-600 flex flex-col items-center">
                  <p>At least six characters</p>
                  <p>At least one uppercase character</p>
                  <p>At least one number </p>
                  <p>At least one special characer </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
};
