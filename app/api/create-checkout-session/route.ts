// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with error handling
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

// Use the latest stable API version or remove apiVersion to use default
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Remove apiVersion or use latest: '2024-12-18.acacia'
  // If you remove it, Stripe will use the default version from your account
});

interface LineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      images?: string[]; // Make images optional
    };
    unit_amount: number;
  };
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail, metadata } = await request.json();

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items array is required and must not be empty" },
        { status: 400 }
      );
    }

    // // Validate environment variable
    // if (!process.env.NEXT_PUBLIC_APP_URL) {
    //   throw new Error("NEXT_PUBLIC_APP_URL is not defined");
    // }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Note: PayPal requires additional setup in Stripe Dashboard
      line_items: items as LineItem[],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      customer_email: customerEmail,
      metadata: metadata || {},
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "FR", "DE", "JP", "PS"], // Added PS for Palestine
      },
      // Shipping options
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 999, // $9.99 in cents
              currency: "usd",
            },
            display_name: "Express shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 2,
              },
            },
          },
        },
      ],
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url, // Also return the URL for direct redirect
    });
  } catch (error: any) {
    console.error("Stripe session creation error:", error);

    // Return more specific error messages
    if (error.type === "StripeCardError") {
      return NextResponse.json(
        { error: "Card error occurred" },
        { status: 400 }
      );
    }

    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        { error: "Invalid request to Stripe API" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
