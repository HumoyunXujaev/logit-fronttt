export type UserType = 'individual' | 'legal';
export type UserRole =
  | 'student'
  | 'carrier'
  | 'cargo-owner'
  | 'logistics-company'
  | 'transport-company'
  | 'logit-trans';
export type Language = 'ru' | 'uz';

export interface UserState {
  type?: UserType;
  role?: UserRole;
  language?: Language;
  isAuthenticated?: boolean;
  userData?: {
    photo?: string;
    companyName?: string;
    fullName?: string;
    telegramNumber?: string;
    whatsappNumber?: string;
    phoneNumber?: string;
    position?: string;
    registrationCertificate?: string;
    studentStatus?: string;
    city?: string;
    tariff?: string;
    groupName?: string;
    studyLanguage?: string;
    curatorName?: string;
    endDate?: string;
  };
}
