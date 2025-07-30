// export type EmailType = 'verify' | 'reset';
// export interface IEmailTemplate {
//     to: string;
//     type: EmailType
//     code: string;
//     from?: string;
// };

export interface IEmailTemplate {
  to: string;
  code: string;
  type: "verify" | "reset";
  from?: string;
}
