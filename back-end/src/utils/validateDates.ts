import moment, { Moment } from "moment";

interface DateValidationResult {
  valid: boolean;
  message?: string;
}

const validateDates = (dates: { startDate: string; endDate: string }): DateValidationResult => {
  try {
    const today: Moment = moment();
    const start: Moment = moment(dates.startDate, "YYYY-MM-DD");
    const end: Moment = moment(dates.endDate, "YYYY-MM-DD");

    if (start.isBefore(today)) {
      return { valid: false, message: "Start date cannot be in the past." };
    }

    if (end.isBefore(today)) {
      return { valid: false, message: "End date cannot be in the past." };
    }

    if (start.isSame(end)) {
      return { valid: true };
    }

    if (end.isBefore(start)) {
      return { valid: false, message: "End date cannot be before start date." };
    }

    return { valid: true };
  } catch (error) {
    console.log(error);
    return { valid: false, message: "An error occurred while validating dates." };
  }
};

export default validateDates;
