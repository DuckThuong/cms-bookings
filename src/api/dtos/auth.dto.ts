export interface LoginPayloadDto {
  phoneNumber: string;
  
  password: string;
}

export interface SignUpPayloadDto {
  fullName: string;

  phoneNumber: string;

  password: string;

  confirm_password: string;

  submitRule: number;

  email: string;

  dob: string;

  gender: number;
}

export interface AuthResponseDto {
  accessToken: string;
}
