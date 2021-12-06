import { memberStore } from "@/modules/member/memberStore";
import {
  MemberListResponse,
  NormalMemberAddReq,
  NormalMemberAddRes,
  OrgMemberAddReq,
} from "@/types";
import { AxiosResponse } from "axios";
import { privateAgent } from ".";

export const getMemberList = (
  id: number | string
): Promise<AxiosResponse<MemberListResponse>> => {
  return privateAgent.get(`/member/list/${id}`);
};

export const postNormalMember = (body: NormalMemberAddReq) => {
  return new Promise((resolve, reject) =>
    privateAgent
      .post<NormalMemberAddRes>("user/store", body)
      .then((response) => {
        memberStore
          .getState()
          .getMemberListFromServer(response.data.data.role.id);
        resolve("Added Succesfully");
      })
      .catch((error) => {
        reject(error.response);
      })
  );
};

export const postOrgMember = (body: OrgMemberAddReq) => {
  return new Promise((resolve, reject) =>
    privateAgent
      .post<NormalMemberAddRes>("member/store", body)
      .then((response) => {
        memberStore
          .getState()
          .getMemberListFromServer(response.data.data.role.id);
        resolve("Added Succesfully");
      })
      .catch((error) => {
        reject(error.response);
      })
  );
};
