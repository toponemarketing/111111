// Stripe integration for payouts
export interface StripeAccount {
  id: string
  email: string
  details_submitted: boolean
  charges_enabled: boolean
  payouts_enabled: boolean
}

export class StripeAPI {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async createConnectedAccount(email: string, businessName: string): Promise<StripeAccount> {
    const response = await fetch('/api/stripe/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        type: 'express',
        email,
        business_profile: {
          name: businessName
        },
        capabilities: {
          transfers: { requested: true }
        }
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create Stripe account')
    }

    return response.json()
  }

  async createAccountLink(accountId: string, returnUrl: string, refreshUrl: string): Promise<{ url: string }> {
    const response = await fetch('/api/stripe/account_links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        account: accountId,
        return_url: returnUrl,
        refresh_url: refreshUrl,
        type: 'account_onboarding'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create account link')
    }

    return response.json()
  }

  async createTransfer(amount: number, accountId: string, description: string): Promise<{ id: string }> {
    const response = await fetch('/api/stripe/transfers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        destination: accountId,
        description
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create transfer')
    }

    return response.json()
  }
}
