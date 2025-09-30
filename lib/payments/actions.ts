"use server";

import { redirect } from "next/navigation";
// STRIPE IMPORTS COMMENTED OUT - TO BE ENABLED LATER
// import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from "@/lib/auth/middleware";

export const checkoutAction = withTeam(async (formData, team) => {
  // STRIPE CHECKOUT COMMENTED OUT - REDIRECT TO MESSAGE PAGE
  // const priceId = formData.get('priceId') as string;
  // await createCheckoutSession({ team: team, priceId });
  redirect("/pricing?message=stripe_disabled");
});

export const customerPortalAction = withTeam(async (_, team) => {
  // STRIPE CUSTOMER PORTAL COMMENTED OUT - REDIRECT TO MESSAGE PAGE
  // const portalSession = await createCustomerPortalSession(team);
  // redirect(portalSession.url);
  redirect("/dashboard?message=stripe_disabled");
});
