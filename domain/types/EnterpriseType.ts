import { AddUserCommand } from "./UserType.ts";

export type AddEnterpriseCommand = AddUserCommand & {
  taxNumber: string;
  industryType: string;
};

export type UpdateEnterprisePersonalInformationCommand = {
  taxNumber?: string;
  industryType?: string;
};
