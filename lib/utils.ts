import { clsx, type ClassValue } from "clsx"
import moment from "moment"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function keyDownLengthValidation(
  event: React.KeyboardEvent<HTMLInputElement>,
  maxLength: number
) {
  const pattern = /[0-9]/
  const inputValue = event.currentTarget.value
  if (
    (event.key !== "Backspace" &&
      event.key !== "Tab" && // Not a backspace
      !pattern.test(event.key)) || // Not a number
    (inputValue.length >= maxLength &&
      event.key !== "Backspace" &&
      event.key !== "Tab") // Limit to 11 digits, allow backspace
  ) {
    event.preventDefault()
  }
}

export function keyDownOnlyLetters(
  event: React.KeyboardEvent<HTMLInputElement>,
  maxLength: number
) {
  const pattern = /[a-zA-Z]/
  const inputValue = event.currentTarget.value
  if (
    (event.key !== "Backspace" &&
      event.key !== "Tab" && // Not a backspace
      !pattern.test(event.key)) || // Not a number
    (inputValue.length >= maxLength &&
      event.key !== "Backspace" &&
      event.key !== "Tab") // Limit to 11 digits, allow backspace
  ) {
    event.preventDefault()
  }
}

export function formatPhoneNumber(inputValue: any) {
  if (inputValue) {
    const numericValue = String(inputValue)?.replace(/\D/g, "")
    let formattedNumber
    if (String(inputValue)[0] === "1") {
      formattedNumber = String(numericValue)?.replace(
        /(\d{1})(\d{3})(\d{3})(\d{4})/,
        "+$1-($2) $3-$4"
      )
    } else {
      formattedNumber = String(numericValue)?.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})/,
        "+$1-($2) $3-$4"
      )
    }
    return formattedNumber
  } else {
    return inputValue
  }
}
export function formatFaxNumber(inputValue: any) {
  if (inputValue) {
    const numericValue = String(inputValue)?.replace(/\D/g, "")
    const formattedFax = String(numericValue)?.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1-$2-$3"
    )
    return formattedFax
  } else {
    return inputValue
  }
}
export function formatTaxIdentificationNumber(inputValue: any) {
  if (inputValue) {
    const numericValue = String(inputValue)?.replace(/\D/g, "")
    const formattedTin = String(numericValue)?.replace(
      /(\d{2})(\d{7})/,
      "$1-$2"
    )
    return formattedTin
  } else {
    return inputValue
  }
}

export function formatSSN(inputValue: any) {
  if (inputValue) {
    const numericValue = String(inputValue)?.replace(/\D/g, "")
    const formattedSSN = String(numericValue)?.replace(
      /(\d{3})(\d{2})(\d{4})/,
      "$1-$2-$3"
    )
    return formattedSSN
  } else {
    return inputValue
  }
}

export function convertToLocalDateTime(dateTime: any) {
  if (moment(dateTime).isValid()) {
    let dateFormat = moment(dateTime).format("MM/DD/YYYY")

    let utcDateTime = moment.utc(dateTime)
    let localDate = moment(utcDateTime).local().format("MM/DD/YYYY")
    return localDate
  } else {
    return dateTime
  }
}

export function convertToUTCDate(dateTime: any) {
  if (moment(dateTime).isValid()) {
    // Parse the date-time string using Moment.js
    const momentDate = moment(dateTime)
    // Convert the date to UTC
    const momentDateUTC = momentDate.utc()
    // Format the date in MM/DD/YYYY
    const utcDateOnly = momentDateUTC.format("MM/DD/YYYY")
    return utcDateOnly
  } else {
    return dateTime
  }
}
