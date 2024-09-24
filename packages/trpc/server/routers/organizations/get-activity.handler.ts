import { getOrganizationActivity } from "@fergeh/enterprise/analytics";
import { TRPCError } from "@trpc/server";
import { isOrganizationMember } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TGetActivitySchema } from "./get-activity.schema";

type GetActivityOptions = {
  ctx: NonNullableUserContext;
  input: TGetActivitySchema;
};

export const getActivityHandler = async ({
  ctx,
  input,
}: GetActivityOptions) => {
  if (!(await isOrganizationMember(ctx.session.user.id, input.id))) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  console.log("Fetching activity data for organization ID:", input.id);
  const activityData = await getOrganizationActivity(input.id, input.period);
  console.log("Activity data received:", activityData);

  // Check if activityData is undefined and return a default value if so
  if (!activityData) {
    console.warn("No activity data found for id:", input.id, "and period:", input.period);
    return { activity: [], total: 0 }; // Return default structure
  }

  return activityData; // Ensure this is a defined object
};

export default getActivityHandler;
