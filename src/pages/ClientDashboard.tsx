import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Users, 
  Share2, 
  Copy,
  ExternalLink,
  Gift,
  TrendingUp,
  Calendar
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

const ClientDashboard = () => {
  const { clientId } = useParams()
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<any>(null)