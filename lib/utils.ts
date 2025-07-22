import { API_RESPON, MetaPagination } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from 'bcryptjs'

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10)
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const sleep = (ms: number = 1000) => new Promise((resolve) => setTimeout(resolve, ms));


export function success<T>(message: string, data: T, meta?: MetaPagination): API_RESPON<T> {
  return { message, success: true, data, meta }
}

export function failure(message: string, err?: unknown): API_RESPON<null> {
  return { message, success: false, err, data: null }
}

