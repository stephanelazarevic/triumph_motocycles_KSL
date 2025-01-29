export type AddUserCommand = {
  firstname: string;
  lastname: string;
  emailAddress: string;
  plainPassword: string;
  phoneNumber: string;
  address: {
    street: string;
    postalCode: string;
    countryCode: string;
  };
};

export type UpdateUserPersonalInformationCommand = {
  firstname?: string;
  lastname?: string;
  address?: {
    street?: string;
    postalCode?: string;
    countryCode?: string;
  };
};

export type UpdateUserPasswordCommand = {
  newPassword: string;
  confirmNewPassword: string;
};

export type UpdateUserContactInformationCommand = {
  emailAddress?: string;
  phoneNumber?: string;
};
