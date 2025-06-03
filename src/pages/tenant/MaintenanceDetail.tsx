import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'
import { 
  ArrowLeftIcon, 
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'
import { shouldUseSampleData } from '../../lib/sampleData'

// Sample maintenance request data
const SAMPLE_MAINTENANCE_REQUESTS_MAP = {
  '00000000-0000-0000-0000-000000000501': {
    id: '00000000-0000-0000-0000-000000000501',
    unit_id: '00000000-0000-0000-0000-000000000201',
    tenant_id: '00000000-0000-0000-0000-000000000003',
    title: 'Leaking faucet in bathroom',
    description: 'The bathroom sink faucet is leaking constantly. Water is dripping even when turned off completely.',
    priority: 'medium',
    status: 'completed',
    created_at: '2023-08-10T12:00:00Z',
    completed_at: '2023-08-15T14:30:00Z',
    notes: 'Replaced washer and fixed leak.',
    unit: {
      id: '00000000-0000-0000-0000-000000000201',
      unit_number: '101',
      property: {
        id: '00000000-0000-0000-0000-000000000101',
        name: 'Sunset Apartments'
      }
    },
    comments: [
      {
        id: '00000000-0000-0000-0000-000000000601',
        maintenance_request_id: '00000000-0000-0000-0000-000000000501',
        user_id: '00000000-0000-0000-0000-000000000003',
        comment: 'The leak is getting worse. Water is now pooling on the floor.',
        created_at: '2023-08-12T10:30:00Z',
        user: {
          id: '00000000-0000-0000-0000-000000000003',
          first_name: 'Michael',
          last_name: 'Brown',
          role: 'tenant'
        }
      },
      {
        id: '00000000-0000-0000-0000-000000000602',
        maintenance_request_id: '00000000-0000-0000-0000-000000000501',
        user_id: '00000000-0000-0000-0000-000000000001',
        comment: 'We\'ll send a plumber tomorrow morning between 9-11 AM.',
        created_at: '2023-08-12T14:15:00Z',
        user: {
          id: '00000000-0000-0000-0000-000000000001',
          first_name: 'John',
          last_name: 'Smith',
          role: 'landlord'
        }
      },
      {
        id: '00000000-0000-0000-0000-000000000603',
        maintenance_request_id: '00000000-0000-0000-0000-000000000501',
        user_id: '00000000-0000-0000-0000-000000000001',
        comment: 'The plumber has fixed the leak by replacing the washer. Please let us know if you notice any further issues.',
        created_at: '2023-08-15T14:30:00Z',
        user: {
          id: '00000000-0000-0000-0000-000000000001',
          first_name: 'John',
          last_name: 'Smith',
          role: 'landlord'
        }
      }
    ],
    images: [
      {
        id: '00000000-0000-0000-0000-000000000701',
        maintenance_request_id: '00000000-0000-0000-0000-000000000501',
        image_url: 'https://images.pexels.com/photos/5935755/pexels-photo-5935755.jpeg',
        description: 'Leaking faucet',
        created_at: '2023-08-10T12:05:00Z'
      }
    ]
  },
  '00000000-0000-0000-0000-000000000502': {
    id: '00000000-0000-0000-0000-000000000502',
    unit_id: '00000000-0000-0000-0000-000000000201',
    tenant_id: '00000000-0000-0000-0000-000000000003',
    title: 'Broken light fixture in kitchen',
    description: 'The ceiling light in the kitchen is not working. I changed the bulb but it still doesn\'t work.',
    priority: 'low',
    status: 'open',
    created_at: '2023-08-20T09:15:00Z',
    completed_at: null,
    notes: null,
    unit: {
      id: '00000000-0000-0000-0000-000000000201',
      unit_number: '101',
      property: {
        id: '00000000-0000-0000-0000-000000000101',
        name: 'Sunset Apartments'
      }
    },
    comments: [],
    images: [
      {
        id: '00000000-0000-0000-0000-000000000702',
        maintenance_request_id: '00000000-0000-0000-0000-000000000502',
        image_url: 'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg',
        description: 'Kitchen light fixture',
        created_at: '2023-08-20T09:20:00Z'
      }
    ]
  }
};

const MaintenanceDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [request, setRequest] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [showAddCommentModal, setShowAddCommentModal] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [useSampleData, setUseSampleData] = useState(false)

  useEffect(() => {
    if (id && user) {
      const useSample = shouldUseSampleData()
      setUseSampleData(useSample)
      
      if (useSample) {
        console.log('Using sample data for maintenance request details')
        loadSampleRequestDetails(id)
      } else {
        fetchRequestDetails()
      }
    }
  }, [id, user])

  const loadSampleRequestDetails = (requestId: string) => {
    console.log('Loading sample maintenance request details for id:', requestId)
    
    // Check if this is a dynamically created sample request (from the Maintenance.tsx component)
    if (requestId.startsWith('sample-')) {
      // This is a dynamically created sample request
      // We need to get it from the session storage or create a new one
      const sampleRequest = {
        id: requestId,
        unit_id: '00000000-0000-0000-0000-000000000201',
        tenant_id: user?.id,
        title: 'New Sample Request',
        description: 'This is a sample maintenance request created by the user.',
        priority: 'medium',
        status: 'open',
        created_at: new Date().toISOString(),
        completed_at: null,
        notes: null,
        unit: {
          id: '00000000-0000-0000-0000-000000000201',
          unit_number: '101',
          property: {
            id: '00000000-0000-0000-0000-000000000101',
            name: 'Sunset Apartments'
          }
        },
        comments: [],
        images: []
      }
      
      setRequest(sampleRequest)
      setComments([])
      setImages([])
      setLoading(false)
      return
    }
    
    // Find the request in our sample data
    const sampleRequestData = SAMPLE_MAINTENANCE_REQUESTS_MAP[requestId]
    
    if (sampleRequestData) {
      console.log('Found sample maintenance request data:', sampleRequestData)
      setRequest(sampleRequestData)
      setComments(sampleRequestData.comments || [])
      setImages(sampleRequestData.images || [])
    } else {
      console.log('No sample maintenance request found for id:', requestId)
      toast.error('Maintenance request not found')
      navigate('/tenant/maintenance')
    }
    
    setLoading(false)
  }

  const fetchRequestDetails = async () => {
    if (!id || !user) return
    
    setLoading(true)
    try {
      // Fetch maintenance request
      const { data: requestData, error: requestError } = await supabase
        .from('maintenance_requests')
        .select('*, unit:units(unit_number, property:properties(name))')
        .eq('id', id)
        .single()
      
      if (requestError) throw requestError
      
      // Verify this request belongs to the tenant
      if (requestData.tenant_id !== user.id) {
        toast.error('You do not have permission to view this maintenance request')
        navigate('/tenant/maintenance')
        return
      }
      
      setRequest(requestData)
      
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
      toast.error(error.message || 'Error fetching maintenance request details')
      navigate('/tenant/maintenance')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !id || !newComment.trim()) return
    
    setSubmitting(true)
    try {
      if (useSampleData) {
        // Create a sample comment
        console.log('Creating sample comment:', newComment)
        
        // Generate a unique ID for the new comment
        const newId = `sample-comment-${Date.now()}`
        
        // Create the new comment object with sample data
        const newCommentObj = {
          id: newId,
          maintenance_request_id: id,
          user_id: user.id,
          comment: newComment.trim(),
          created_at: new Date().toISOString(),
          user: {
            id: user.id,
            first_name: user.profile?.first_name || 'Sample',
            last_name: user.profile?.last_name || 'User',
            role: 'tenant'
          }
        }
        
        // Add the new comment to the state
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

  if (!request) {
    return (
      <div className="text-center py-12">
        <WrenchScrewdriverIcon className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Maintenance request not found</h3>
        <p className="mt-1 text-gray-500">The maintenance request you're looking for doesn't exist or you don't have access to it.</p>
        <div className="mt-6">
          <Link to="/tenant/maintenance" className="btn btn-primary">
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
          <Link to="/tenant/maintenance" className="mr-4 text-gray-400 hover:text-gray-500">
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
            onClick={() => setShowAddCommentModal(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Comment
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
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Property & Unit</h3>
              <p className="text-gray-900">
                {request.unit?.property?.name || 'Unknown Property'} - Unit {request.unit?.unit_number || 'Unknown'}
              </p>
            </div>
            
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
                <h3 className="text-sm font-medium text-gray-500">Notes from Landlord</h3>
                <p className="text-gray-900 whitespace-pre-line">{request.notes}</p>
              </div>
            )}
            
            {/* Images */}
            {images.length > 0 && (
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
      </div>

      {/* Comments */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Communication</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className={`
                  flex
                  ${comment.user?.role === 'tenant' ? 'justify-end' : 'justify-start'}
                `}>
                  <div className={`
                    max-w-lg rounded-lg p-4
                    ${comment.user?.role === 'tenant' ? 'bg-primary-50 border border-primary-100' : 'bg-gray-50 border border-gray-100'}
                  `}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`
                          h-8 w-8 rounded-full flex items-center justify-center
                          ${comment.user?.role === 'tenant' ? 'bg-primary-100' : 'bg-gray-200'}
                        `}>
                          <span className={`
                            text-sm font-medium
                            ${comment.user?.role === 'tenant' ? 'text-primary-700' : 'text-gray-700'}
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
