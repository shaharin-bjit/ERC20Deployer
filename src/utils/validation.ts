import { TokenFormData } from '../types';

export const validateTokenForm = (data: TokenFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Validate name
  if (!data.name) {
    errors.name = 'Token name is required';
  } else if (data.name.length < 3) {
    errors.name = 'Token name must be at least 3 characters';
  } else if (data.name.length > 50) {
    errors.name = 'Token name must be less than 50 characters';
  }

  // Validate symbol
  if (!data.symbol) {
    errors.symbol = 'Token symbol is required';
  } else if (data.symbol.length < 1) {
    errors.symbol = 'Token symbol is required';
  } else if (data.symbol.length > 10) {
    errors.symbol = 'Token symbol must be less than 10 characters';
  } else if (!/^[A-Z0-9]+$/.test(data.symbol)) {
    errors.symbol = 'Token symbol must only contain uppercase letters and numbers';
  }

  // Validate decimals
  if (data.decimals === undefined || data.decimals === null) {
    errors.decimals = 'Token decimals are required';
  } else if (isNaN(data.decimals)) {
    errors.decimals = 'Token decimals must be a number';
  } else if (data.decimals < 0 || data.decimals > 18) {
    errors.decimals = 'Token decimals must be between 0 and 18';
  }

  // Validate total supply
  if (!data.totalSupply) {
    errors.totalSupply = 'Total supply is required';
  } else if (isNaN(Number(data.totalSupply)) || Number(data.totalSupply) <= 0) {
    errors.totalSupply = 'Total supply must be a positive number';
  } else if (Number(data.totalSupply) > Number.MAX_SAFE_INTEGER) {
    errors.totalSupply = 'Total supply is too large';
  }

  return errors;
};