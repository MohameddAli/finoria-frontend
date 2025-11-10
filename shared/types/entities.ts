/**
 * Entity Interfaces
 * Domain models for the application
 */

/**
 * Admin user entity
 */
export interface Admin {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role?: string; // For permission checks
  permissions?: string[]; // User permissions
  created_at: string;
  updated_at: string;
}

/**
 * Admin login response
 */
export interface AdminLoginResponse {
  token: string;
  admin: Admin;
}

/**
 * Company entity
 */
export interface Company {
  id: string; // encrypted ID
  name: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Company creation payload
 */
export interface CompanyCreatePayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
}

/**
 * Company update payload
 */
export interface CompanyUpdatePayload extends Partial<CompanyCreatePayload> {
  email: string; // required for update
}

/**
 * Company with token (returned on creation)
 */
export interface CompanyWithToken extends Company {
  token: string;
}

/**
 * Currency entity
 */
export interface Currency {
  id: string; // encrypted ID
  name: string;
  code: string | null;
  symbol: string;
  exchange_rate: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Currency creation payload
 */
export interface CurrencyCreatePayload {
  name: string;
  code?: string | null;
  symbol: string;
  exchange_rate: number | string;
  is_active: boolean;
}

/**
 * Currency update payload
 */
export interface CurrencyUpdatePayload {
  name?: string;
  code?: string | null;
  symbol: string; // required
  exchange_rate: string | number; // required
  is_active: boolean; // required
}

/**
 * Transaction Type
 */
export type TransactionType = '1' | '2'; // 1 = deposit, 2 = withdrawal

/**
 * Transaction entity
 */
export interface Transaction {
  id: string;
  company_id: string;
  bank_account_id: string;
  currency_id: string;
  transaction_type: TransactionType;
  amount: string;
  description: string;
  transaction_date: string;
  reference_number: string;
  created_at: string;
  updated_at: string;
}

/**
 * Company Bank entity
 */
export interface CompanyBank {
  id: string; // encrypted ID
  company_id: string;
  currency_id: string;
  company_name: string;
  currency_name: string;
  iban: string;
  banknumber: string;
  bic?: string | null;
  balance: string;
  is_active: boolean;
  who_delete: string | null;
  created_at: string | null;
  updated_at: string | null;
  currency?: {
    id: string;
    name: string;
    code: string | null;
    symbol: string;
    exchange_rate: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  transactions?: Transaction[];
}

/**
 * Company Bank creation payload
 */
export interface CompanyBankCreatePayload {
  company_id: string;
  currency_id: string;
  iban: string;
  banknumber: string;
  bic?: string | null;
  is_active: boolean;
}

/**
 * Company Bank update payload
 */
export interface CompanyBankUpdatePayload {
  company_id?: string;
  currency_id?: string;
  iban?: string;
  banknumber?: string;
  bic?: string | null;
  is_active: boolean; // required
}

/**
 * Company Bank Transaction payload (deposit/withdraw)
 */
export interface CompanyBankTransactionPayload {
  amount: number;
  description?: string;
  reference_number?: string;
}
