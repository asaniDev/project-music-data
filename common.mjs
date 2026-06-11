import { getUserIDs } from "./data.mjs";

export const countUsers = () => getUserIDs().length;
export const listUserIDs = () => getUserIDs;
