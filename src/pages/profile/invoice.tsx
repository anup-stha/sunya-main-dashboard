/*
 * Created By Anup Shrestha
 * Copyright (c) 2022. All rights reserved.
 * Last Modified 2/22/22, 10:09 PM
 *
 *
 */

import { useRouter } from "next/router";
import React from "react";

import { useAuthStore } from "@/modules/auth/useTokenStore";
import { MembersModule } from "@/modules/members";
import { withAuth } from "@/shared/hoc/withAuth";
import { withRole } from "@/shared/hoc/withRole";

const ProfileInvoice = () => {
  const { query } = useRouter();
  const user = useAuthStore((state) => state.user);

  return (
    <MembersModule.InvoicePage
      selectedMember={user}
      invoice_id={isNaN(Number(query.id)) ? undefined : Number(query.id)}
    />
  );
};

export default withAuth(withRole(ProfileInvoice));