// Jobber API integration
const JOBBER_API_BASE = 'https://api.getjobber.com/api/graphql'

export interface JobberClient {
  id: string
  name: string
  email: string
  phone?: string
}

export interface JobberJob {
  id: string
  title: string
  client: JobberClient
  status: string
  total: number
  completedAt?: string
  invoices: Array<{
    id: string
    status: string
    total: number
    paidAt?: string
  }>
}

export class JobberAPI {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async request(query: string, variables?: any) {
    const response = await fetch(JOBBER_API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'X-JOBBER-GRAPHQL-VERSION': '2023-03-15'
      },
      body: JSON.stringify({ query, variables })
    })

    if (!response.ok) {
      throw new Error(`Jobber API error: ${response.statusText}`)
    }

    const data = await response.json()
    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors[0].message}`)
    }

    return data.data
  }

  async getClients(cursor?: string): Promise<{ clients: JobberClient[], hasNextPage: boolean, endCursor?: string }> {
    const query = `
      query GetClients($cursor: String) {
        clients(first: 50, after: $cursor) {
          nodes {
            id
            name
            billingAddress {
              email
            }
            phoneNumbers {
              number
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `

    const data = await this.request(query, { cursor })
    
    return {
      clients: data.clients.nodes.map((client: any) => ({
        id: client.id,
        name: client.name,
        email: client.billingAddress?.email || '',
        phone: client.phoneNumbers?.[0]?.number
      })),
      hasNextPage: data.clients.pageInfo.hasNextPage,
      endCursor: data.clients.pageInfo.endCursor
    }
  }

  async getJobs(cursor?: string): Promise<{ jobs: JobberJob[], hasNextPage: boolean, endCursor?: string }> {
    const query = `
      query GetJobs($cursor: String) {
        jobs(first: 50, after: $cursor) {
          nodes {
            id
            title
            client {
              id
              name
              billingAddress {
                email
              }
            }
            jobStatus
            total
            completedAt
            invoices {
              nodes {
                id
                invoiceStatus
                total
                paidAt
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `

    const data = await this.request(query, { cursor })
    
    return {
      jobs: data.jobs.nodes.map((job: any) => ({
        id: job.id,
        title: job.title,
        client: {
          id: job.client.id,
          name: job.client.name,
          email: job.client.billingAddress?.email || ''
        },
        status: job.jobStatus,
        total: job.total,
        completedAt: job.completedAt,
        invoices: job.invoices.nodes.map((invoice: any) => ({
          id: invoice.id,
          status: invoice.invoiceStatus,
          total: invoice.total,
          paidAt: invoice.paidAt
        }))
      })),
      hasNextPage: data.jobs.pageInfo.hasNextPage,
      endCursor: data.jobs.pageInfo.endCursor
    }
  }

  async getJobById(jobId: string): Promise<JobberJob | null> {
    const query = `
      query GetJob($id: ID!) {
        job(id: $id) {
          id
          title
          client {
            id
            name
            billingAddress {
              email
            }
          }
          jobStatus
          total
          completedAt
          invoices {
            nodes {
              id
              invoiceStatus
              total
              paidAt
            }
          }
        }
      }
    `

    const data = await this.request(query, { id: jobId })
    
    if (!data.job) return null

    const job = data.job
    return {
      id: job.id,
      title: job.title,
      client: {
        id: job.client.id,
        name: job.client.name,
        email: job.client.billingAddress?.email || ''
      },
      status: job.jobStatus,
      total: job.total,
      completedAt: job.completedAt,
      invoices: job.invoices.nodes.map((invoice: any) => ({
        id: invoice.id,
        status: invoice.invoiceStatus,
        total: invoice.total,
        paidAt: invoice.paidAt
      }))
    }
  }
}

// OAuth helper functions
export const getJobberAuthUrl = (clientId: string, redirectUri: string, state: string) => {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'clients:read jobs:read invoices:read',
    state
  })
  
  return `https://api.getjobber.com/api/oauth/authorize?${params.toString()}`
}

export const exchangeCodeForToken = async (code: string, clientId: string, clientSecret: string, redirectUri: string) => {
  const response = await fetch('https://api.getjobber.com/api/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    })
  })

  if (!response.ok) {
    throw new Error('Failed to exchange code for token')
  }

  return response.json()
}
