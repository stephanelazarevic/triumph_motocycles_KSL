import { AddUserCommand } from "./UserType.ts";

export type AddDealerCommand = AddUserCommand & {
  site: string;
};

export type UpdateDealerSiteCommand = {
  site: string;
};
