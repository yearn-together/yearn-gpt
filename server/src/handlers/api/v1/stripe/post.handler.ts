import { FastifyReply, FastifyRequest } from "fastify";
import Stripe from "stripe";
import {
  MessageCredits,
  PlanLookup,
  getStripe,
} from "../../../../utils/stripe";

export const webhookHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      (request.body as any).raw,
      request.headers["stripe-signature"]!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.log("Signature verify failed");
    return reply.status(500).send({ message: "Something went wrong" });
  }

  const prisma = request.server.prisma;

  // Handle the event
  switch (event.type) {
    case "customer.subscription.updated":
      // handles creation + plan switch + deletion
      const customerSubscriptionUpdated = event.data
        .object as Stripe.Subscription;

      if (
        customerSubscriptionUpdated.status === "active" ||
        customerSubscriptionUpdated.status === "past_due"
      ) {
        // creation + plan change
        await prisma.stripe.updateMany({
          where: { customerId: customerSubscriptionUpdated.customer as string },
          data: {
            active_plan:
              customerSubscriptionUpdated?.items?.data[0]?.price.lookup_key ||
              "",
            line_item_id: customerSubscriptionUpdated?.items?.data[0]?.id || "",
            subscription_id:
              customerSubscriptionUpdated?.items?.data[0]?.subscription || "",
            plan_status: customerSubscriptionUpdated.status,
          },
        });
      } else if (customerSubscriptionUpdated.status === "canceled") {
        // deletion
        await prisma.stripe.updateMany({
          where: { customerId: customerSubscriptionUpdated.customer as string },
          data: {
            active_plan: "",
            line_item_id: "",
            subscription_id: "",
            plan_status: "",
            message_credits_remaining: 0,
          },
        });
      }
      console.log("handled customer.subscription.updated");
      break;

    case "invoice.paid":
      // handles subscription renewal
      const invoicePaid = event.data.object;
      const lookup = invoicePaid.lines!.data[0]!.price!.lookup_key;

      if (lookup) {
        await prisma.stripe.updateMany({
          where: { customerId: invoicePaid.customer as string },
          data: {
            message_credits_remaining: MessageCredits[lookup as PlanLookup],
          },
        });
      }

      console.log("invoice.paid");
      break;
    default:
    // ... handle other event types
    // console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 res to acknowledge receipt of the event
  reply.status(200).send();
};
