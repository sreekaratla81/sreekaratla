import { format, parseISO } from "date-fns";

export const formatDate = (value: string, dateFormat = "MMMM d, yyyy") => format(parseISO(value), dateFormat);
