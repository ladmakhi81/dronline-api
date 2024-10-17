export interface VerifyZarinpalTransactionResponseDTO {
  data: {
    code: 100 | 101;
    message: string;
    ref_id: number;
  };
  errors: [];
}
