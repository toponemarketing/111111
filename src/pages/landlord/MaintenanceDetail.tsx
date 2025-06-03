import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  WrenchScrewdriverIcon,
  UserIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  PaperClipIcon,
  PhotoIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'

// Sample data for development/testing
const SAMPLE_MAINTENANCE_REQUEST = {
  id: '00000000-0000-0000-0000-000000000505',
  unit_id: '00000000-0000-0000-0000-000000000205',
  tenant_id: '00000000-0000-0000-0000-000000000006',
  title: 'Water damage on ceiling',
  description: 'There\'s a water stain on the ceiling in the living room that seems to be growing. Might be a leak from upstairs.',
  priority: 'emergency',
  status: 'in_progress',
  created_at: '2023-08-23T08:00:00Z',
  completed_at: null,
  notes: 'Plumber identified leak from unit above. Repairs in progress.'
}

const SAMPLE_UNIT = {
  id: '00000000-0000-0000-0000-000000000205',
  unit_number: '202',
  property_id: '00000000-0000-0000-0000-000000000102',
  status: 'maintenance'
}

const SAMPLE_PROPERTY = {
  id: '00000000-0000-0000-0000-000000000102',
  name: 'Riverside Condos',
  address: '456 River St',
  city: 'Chicago',
  state: 'IL',
  zip: '60601',
  landlord_id: '00000000-0000-0000-0000-000000000001'
}

const SAMPLE_TENANT = {
  id: '00000000-0000-0000-0000-000000000006',
  first_name: 'Jessica',
  last_name: 'Martinez',
  email: 'jessica.martinez@example.com',
  phone: '555-777-8888',
  role: 'tenant'
}

const SAMPLE_COMMENTS = [
  {
    id: '00000000-0000-0000-0000-000000000608',
    created_at: '2023-08-22T08:00:00Z',
    maintenance_request_id: '00000000-0000-0000-0000-000000000505',
    user_id: '00000000-0000-0000-0000-000000000006',
    comment: 'The water stain is getting bigger and now there\'s a drip. This is urgent!',
    user: {
      id: '00000000-0000-0000-0000-000000000006',
      first_name: 'Jessica',
      last_name: 'Martinez',
      role: 'tenant'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000609',
    created_at: '2023-08-22T09:30:00Z',
    maintenance_request_id: '00000000-0000-0000-0000-000000000505',
    user_id: '00000000-0000-0000-0000-000000000002',
    comment: 'I\'m sending an emergency plumber right away. They should be there within the hour.',
    user: {
      id: '00000000-0000-0000-0000-000000000002',
      first_name: 'Sarah',
      last_name: 'Johnson',
      role: 'landlord'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000610',
    created_at: '2023-08-22T14:00:00Z',
    maintenance_request_id: '00000000-0000-0000-0000-000000000505',
    user_id: '00000000-0000-0000-0000-000000000002',
    comment: 'The plumber found a leak in the unit above. We\'re working on repairs now and will fix your ceiling once the leak is resolved.',
    user: {
      id: '00000000-0000-0000-0000-000000000002',
      first_name: 'Sarah',
      last_name: 'Johnson',
      role: 'landlord'
    }
  }
]

const SAMPLE_IMAGES = [
  {
    id: '00000000-0000-0000-0000-000000000703',
    created_at: '2023-08-22T08:00:00Z',
    maintenance_request_id: '00000000-0000-0000-0000-000000000505',
    image_url: 'https://images.pexels.com/photos/5980800/pexels-photo-5980800.jpeg',
    description: 'Water damage on ceiling'
  },
  {
    id: '00000000-0000-0000-0000-000000000704',
    created_at: '2023-08-22T08:05:00Z',
    maintenance_request_id: '00000000-0000-0000-0000-000000000505',
    image_url: 'https://images.pexels.com/photos/5980856/pexels-photo-5980856.jpeg',
    description: 'Close-up of water damage'
  }
]

const MaintenanceDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [request, setRequest] = useState<any>(null)
  const [unit, setUnit] = useState<any>(null)
  const [property, setProperty] = useState<any>(null)
  const [tenant, setTenant] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddCommentModal, setShowAddCommentModal] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [useSampleData, setUseSampleData] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    notes: ''
  })

  useEffect(() => {
    if (id && user) {
      fetchRequestDetails()
    }
  }, [id, user])

  const fetchRequestDetails = async () => {
    if (!id || !user) return
    
    setLoading(true)
    try {
      // Check if we should use sample data (for development/testing)
      const useDevData = import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)
      
      if (useDevData) {
        console.log('Using sample maintenance request data')
        setUseSampleData(true)
        
        // Use sample data
        setRequest(SAMPLE_MAINTENANCE_REQUEST)
        setUnit(SAMPLE_UNIT)
        setProperty(SAMPLE_PROPERTY)
        setTenant(SAMPLE_TENANT)
        setComments(SAMPLE_COMMENTS)
        setImages(SAMPLE_IMAGES)
        
        // Set form data
        setFormData({
          title: SAMPLE_MAINTENANCE_REQUEST.title,
          description: SAMPLE_MAINTENANCE_REQUEST.description,
          priority: SAMPLE_MAINTENANCE_REQUEST.priority,
          status: SAMPLE_MAINTENANCE_REQUEST.status,
          notes: SAMPLE_MAINTENANCE_REQUEST.notes || ''
        })
        
        setLoading(false)
        return
      }
      
      // Fetch maintenance request
      const { data: requestData, error: requestError } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('id', id)
        .single()
      
      if (requestError) throw requestError
      
      if (!requestData) {
        throw new Error('Maintenance request not found')
      }
      
      setRequest(requestData)
      setFormData({
        title: requestData.title || '',
        description: requestData.description || '',
        priority: requestData.priority || 'medium',
        status: requestData.status || 'open',
        notes: requestData.notes || ''
      })
      
      // Fetch unit
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('*')
        .eq('id', requestData.unit_id)
        .single()
      
      if (unitError) throw unitError
      
      if (!unitData) {
        throw new Error('Unit not found')
      }
      
      setUnit(unitData)
      
      // Fetch property
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', unitData.property_id)
        .single()
      
      if (propertyError) throw propertyError
      
      if (!propertyData) {
        throw new Error('Property not found')
      }
      
      // Verify this property belongs to the landlord
      if (propertyData.landlord_id !== user.id) {
        toast.error('You do not have permission to view this maintenance request')
        navigate('/landlord/maintenance')
        return
      }
      
      setProperty(propertyData)
      
      // Fetch tenant
      const { data: tenantData, error: tenantError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', requestData.tenant_id)
        .single()
      
      if (tenantError) throw tenantError
      
      if (!tenantData) {
        throw new Error('Tenant not found')
      }
      
      setTenant(tenantData)
      
      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('maintenance_comments')
        .select(`
          *,
          user:profiles(
            id,
            first_name,
            last_name,
            role
          )
        `)
        .eq('maintenance_request_id', id)
        .order('created_at', { ascending: true })
      
      if (commentsError) throw commentsError
      
      setComments(commentsData || [])
      
      // Fetch images
      const { data: imagesData, error: imagesError } = await supabase
        .from('maintenance_images')
        .select('*')
        .eq('maintenance_request_id', id)
        .order('created_at', { ascending: true })
      
      if (imagesError) throw imagesError
      
      setImages(imagesData || [])
    } catch (error: any) {
      console.error('Error fetching maintenance request details:', error)
      
      // If there's an error, use sample data in development mode
      if (import.meta.env.DEV) {
        console.log('Using sample data due to error')
        setUseSampleData(true)
        
        // Use sample data
        setRequest(SAMPLE_MAINTENANCE_REQUEST)
        setUnit(SAMPLE_UNIT)
        setProperty(SAMPLE_PROPERTY)
        setTenant(SAMPLE_TENANT)
        setComments(SAMPLE_COMMENTS)
        setImages(SAMPLE_IMAGES)
        
        // Set form data
        setFormData({
          title: SAMPLE_MAINTENANCE_REQUEST.title,
          description: SAMPLE_MAINTENANCE_REQUEST.description,
          priority: SAMPLE_MAINTENANCE_REQUEST.priority,
          status: SAMPLE_MAINTENANCE_REQUEST.status,
          notes: SAMPLE_MAINTENANCE_REQUEST.notes || ''
        })
      } else {
        toast.error(error.message || 'Error fetching maintenance request details')
        navigate('/landlord/maintenance')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !id) return
    
    setSubmitting(true)
    try {
      const updates: any = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        notes: formData.notes || null
      }
      
      // If status is changing to completed, add completed_at timestamp
      if (formData.status === 'completed' && request.status !== 'completed') {
        updates.completed_at = new Date().toISOString()
      } else if (formData.status !== 'completed' && request.status === 'completed') {
        updates.completed_at = null
      }
      
      if (useSampleData) {
        // Simulate update with sample data
        console.log('Simulating update with sample data:', updates)
        
        // Update the request state
        setRequest({ ...request, ...updates })
        
        // If status is changing to maintenance, update unit status
        if (formData.status === 'in_progress' && unit.status !== 'maintenance') {
          setUnit({ ...unit, status: 'maintenance' })
        } else if (formData.status === 'completed' && unit.status === 'maintenance') {
          // If request is completed and unit is in maintenance, set unit back to occupied
          setUnit({ ...unit, status: 'occupied' })
        }
        
        setShowEditModal(false)
        toast.success('Maintenance request updated successfully')
        setSubmitting(false)
        return
      }
      
      const { error } = await supabase
        .from('maintenance_requests')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      
      // If status is changing to maintenance, update unit status
      if (formData.status === 'in_progress' && unit.status !== 'maintenance') {
        const { error: unitError } = await supabase
          .from('units')
          .update({ status: 'maintenance' })
          .eq('id', unit.id)
        
        if (unitError) throw unitError
        
        setUnit({ ...unit, status: 'maintenance' })
      } else if (formData.status === 'completed' && unit.status === 'maintenance') {
        // If request is completed and unit is in maintenance, set unit back to occupied or vacant
        const { data: activeLeases, error: leaseError } = await supabase
          .from('leases')
          .select('id')
          .eq('unit_id', unit.id)
          .eq('status', 'active')
          .limit(1)
        
        if (leaseError) throw leaseError
        
        const newStatus = activeLeases && activeLeases.length > 0 ? 'occupied' : 'vacant'
        
        const { error: unitError } = await supabase
          .from('units')
          .update({ status: newStatus })
          .eq('id', unit.id)
        
        if (unitError) throw unitError
        
        setUnit({ ...unit, status: newStatus })
      }
      
      setRequest({ ...request, ...updates })
      setShowEditModal(false)
      toast.success('Maintenance request updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error updating maintenance request')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !id || !newComment.trim()) return
    
    setSubmitting(true)
    try {
      if (useSampleData) {
        // Simulate adding a comment with sample data
        console.log('Simulating adding a comment with sample data:', newComment)
        
        const newCommentObj = {
          id: `sample-comment-${Date.now()}`,
          created_at: new Date().toISOString(),
          maintenance_request_id: id,
          user_id: user.id,
          comment: newComment.trim(),
          user: {
            id: user.id,
            first_name: user.first_name || 'Current',
            last_name: user.last_name || 'User',
            role: 'landlord'
          }
        }
        
        setComments([...comments, newCommentObj])
        setNewComment('')
        setShowAddCommentModal(false)
        toast.success('Comment added successfully')
        setSubmitting(false)
        return
      }
      
      const { data, error } = await supabase
        .from('maintenance_comments')
        .insert([
          {
            maintenance_request_id: id,
            user_id: user.id,
            comment: newComment.trim()
          }
        ])
        .select(`
          *,
          user:profiles(
            id,
            first_name,
            last_name,
            role
          )
        `)
        .single()
      
      if (error) throw error
      
      setComments([...comments, data])
      setNewComment('')
      setShowAddCommentModal(false)
      toast.success('Comment added successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error adding comment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!request || !unit || !property || !tenant) {
    return (
      <div className="text-center py-12">
        <WrenchScrewdriverIcon className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Maintenance request not found</h3>
        <p className="mt-1 text-gray-500">The maintenance request you're looking for doesn't exist or you don't have access to it.</p>
        <div className="mt-6">
          <Link to="/landlord/maintenance" className="btn btn-primary">
            Back to Maintenance
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/landlord/maintenance" className="mr-4 text-gray-400 hover:text-gray-500">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Maintenance Request
          </h1>
        </div>
        <div className="flex space-x-2">
          {useSampleData && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Using Sample Data
            </div>
          )}
          <button
            onClick={() => setShowEditModal(true)}
            className="btn btn-primary"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Update Status
          </button>
        </div>
      </div>

      {/* Request details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">{request.title}</h2>
            <span className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${request.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 
                request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                request.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
            `}>
              {request.status === 'open' ? 'Open' : 
                request.status === 'in_progress' ? 'In Progress' : 
                request.status === 'completed' ? 'Completed' : 'Cancelled'}
            </span>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="text-gray-900 whitespace-pre-line">{request.description}</p>
                </div>
                
                <div className="flex space-x-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                      ${request.priority === 'emergency' ? 'bg-red-100 text-red-800' : 
                        request.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
                        request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}
                    `}>
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Reported On</h3>
                    <p className="text-gray-900">
                      {format(parseISO(request.created_at), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  {request.completed_at && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Completed On</h3>
                      <p className="text-gray-900">
                        {format(parseISO(request.completed_at), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
                
                {request.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="text-gray-900 whitespace-pre-line">{request.notes}</p>
                  </div>
                )}
                
                {/* Images */}
                {Array.isArray(images) && images.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Images</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <a href={image.image_url} target="_blank" rel="noopener noreferrer">
                            <img 
                              src={image.image_url} 
                              alt={image.description || 'Maintenance image'} 
                              className="h-32 w-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                            </div>
                          </a>
                          {image.description && (
                            <p className="mt-1 text-xs text-gray-500 truncate">{image.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Tenant Information</h3>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium">
                        {tenant.first_name?.[0] || '?'}{tenant.last_name?.[0] || '?'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {tenant.first_name || 'Unknown'} {tenant.last_name || 'Tenant'}
                    </p>
                    <div className="text-xs text-gray-500 flex flex-col">
                      <span>{tenant.email || 'No email'}</span>
                      {tenant.phone && <span>{tenant.phone}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Property & Unit</h3>
                  <p className="text-sm text-gray-900">
                    {property.name || 'Unknown Property'} - Unit {unit.unit_number || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {property.address || ''}, {property.city || ''}, {property.state || ''} {property.zip || ''}
                  </p>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Link
                    to={`/landlord/tenants/${tenant.id}`}
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    View tenant details
                  </Link>
                  <Link
                    to={`/landlord/units/${unit.id}`}
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    View unit details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Communication</h2>
          <button
            onClick={() => setShowAddCommentModal(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Comment
          </button>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {Array.isArray(comments) && comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className={`
                  flex
                  ${comment.user?.role === 'landlord' ? 'justify-end' : 'justify-start'}
                `}>
                  <div className={`
                    max-w-lg rounded-lg p-4
                    ${comment.user?.role === 'landlord' ? 'bg-primary-50 border border-primary-100' : 'bg-gray-50 border border-gray-100'}
                  `}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`
                          h-8 w-8 rounded-full flex items-center justify-center
                          ${comment.user?.role === 'landlord' ? 'bg-primary-100' : 'bg-gray-200'}
                        `}>
                          <span className={`
                            text-sm font-medium
                            ${comment.user?.role === 'landlord' ? 'text-primary-700' : 'text-gray-700'}
                          `}>
                            {comment.user?.first_name?.[0] || '?'}{comment.user?.last_name?.[0] || '?'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900">
                          {comment.user?.first_name || 'Unknown'} {comment.user?.last_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(parseISO(comment.created_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-900 whitespace-pre-line">{comment.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No comments yet</h3>
              <p className="mt-1 text-gray-500">Start the conversation by adding a comment.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAddCommentModal(true)}
                  className="btn btn-primary"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Request Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpdateRequest}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Update Maintenance Request
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="title" className="form-label">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            className="form-input"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="description" className="form-label">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="form-input"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="priority" className="form-label">
                              Priority <span className="text-red-500">*</span>
                            </label>
                            <select
                              id="priority"
                              name="priority"
                              className="form-select"
                              value={formData.priority}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="emergency">Emergency</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="status" className="form-label">
                              Status <span className="text-red-500">*</span>
                            </label>
                            <select
                              id="status"
                              name="status"
                              className="form-select"
                              value={formData.status}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="open">Open</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="notes" className="form-label">
                            Notes (Optional)
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            className="form-input"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Add any additional notes about the maintenance request..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="btn btn-primary sm:ml-3"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 sm:mt-0"
                    onClick={() => setShowEditModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Comment Modal */}
      {showAddCommentModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddComment}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Add Comment
                      </h3>
                      <div className="mt-4">
                        <textarea
                          id="comment"
                          name="comment"
                          rows={4}
                          className="form-input"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Type your comment here..."
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="btn btn-primary sm:ml-3"
                    disabled={submitting || !newComment.trim()}
                  >
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 sm:mt-0"
                    onClick={() => setShowAddCommentModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaintenanceDetail
