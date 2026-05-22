import stripe
from typing import Optional
from backend.config import STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET

stripe.api_key = STRIPE_API_KEY


def create_payment_intent(amount: int, description: str) -> Optional[dict]:
    """Create Stripe payment intent for checkout. Amount in cents."""
    try:
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            description=description,
        )
        return {
            "client_secret": intent.client_secret,
            "id": intent.id,
        }
    except stripe.error.StripeError as e:
        print(f"Stripe error: {e}")
        return None


def verify_webhook_signature(payload: bytes, sig_header: str) -> Optional[dict]:
    """Verify and parse Stripe webhook."""
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        return event
    except ValueError:
        return None
    except stripe.error.SignatureVerificationError:
        return None
