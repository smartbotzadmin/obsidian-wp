require("dotenv").config();

const STRIPE_SK = process.env.STRIPE_SK;

// createPrice.js
const stripe = require("stripe")(STRIPE_SK);

// const products = await stripe.products.list();
// console.log(products.data.length);

// const prices = await stripe.prices.list();
// console.log(JSON.stringify(prices.data.length, null, 2));

// const customers = await stripe.customers.list();
// console.log(JSON.stringify(customers, null, 2));

// const subscriptions = await stripe.subscriptions.list();
// console.log(JSON.stringify(subscriptions, null, 2), subscriptions.data.length);

async function deleteAllSubscriptions() {
  console.log("Fetching all subscriptions...");

  try {
    for await (const subscription of stripe.subscriptions.list({ limit: 100 })) {
      if (subscription.status !== "canceled") {
        try {
          await stripe.subscriptions.cancel(subscription.id);
          console.log(`Canceled subscription: ${subscription.id}`);
        } catch (cancelError) {
          console.error(`Failed to cancel subscription ${subscription.id}:`, cancelError.message);
        }
      }
    }
    console.log("\nFinished processing all subscriptions.");
  } catch (error) {
    console.error("Error fetching subscriptions:", error.message);
  }
}

deleteAllSubscriptions();

// async function createSubscriptionPrice() {
//   try {
//     // First, create the product if it doesn't exist
//     const product = await stripe.products.create({
//       name: "Obsidian WP Monthly Subscription",
//     });
//     console.log(`Product created: ${product.id}`);

//     // Then, create the price attached to that product
//     const price = await stripe.prices.create({
//       product: product.id,
//       unit_amount: 500, // 500 cents = $5.00
//       currency: "usd",
//       recurring: {
//         interval: "month", // Can be 'day', 'week', 'month', or 'year'
//       },
//     });

//     console.log("Price created successfully!");
//     console.log("PRODUCT ID:", product.id);
//     console.log("PRICE ID:", price.id); // Use this ID in your environment variables (STRIPE_PRICE_ID)
//   } catch (error) {
//     console.error("Error creating price:", error.message);
//   }
// }

// createSubscriptionPrice();
