interface StatusBadgeProps {
  status: 'pending' | 'completed' | 'paid' | 'failed' | 'expired'
  className?: string
}

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending'
      case 'completed':
        return 'status-completed'
      case 'paid':
        return 'status-paid'
      case 'failed':
      case 'expired':
        return 'status-failed'
      default:
        return 'status-pending'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'completed':
        return 'Completed'
      case 'paid':
        return 'Paid'
      case 'failed':
        return 'Failed'
      case 'expired':
        return 'Expired'
      default:
        return status
    }
  }

  return (
    <span className={`${getStatusStyles(status)} ${className}`}>
      {getStatusText(status)}
    </span>
  )
}

export default StatusBadge
