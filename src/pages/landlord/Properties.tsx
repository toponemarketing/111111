import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  HomeIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

// Sample properties data
const SAMPLE_PROPERTIES = [
  {
    id: '00000000-0000-0000-0000-000000000101',
    landlord_id: '00000000-0000-0000-0000-000000000001',
    name: 'Sunset Apartments',
    address: '123 Sunset Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    description: 'Modern apartment complex with great amenities',
    image_url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
    units_count: 3,
    vacant_units: 1
  },
  {
    id: '00000000-0000-0000-0000-000000000102',
    landlord_id: '00000000-0000-0000-0000-000000000001',
    name: 'Riverside Condos',
    address: '456 River St',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    description: 'Luxury condos with river views',
    image_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    units_count: 2,
    vacant_units: 1
  },
  {
    id: '00000000-0000-0000-0000-000000000103',
    landlord_id: '00000000-0000-0000-0000-000000000001',
    name: 'Mountain View Homes',
    address: '789 Mountain Rd',
    city: 'Denver',
    state: 'CO',
    zip: '80201',
    description: 'Beautiful homes with mountain views',
    image_url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    units_count: 1,
    vacant_units: 0
  }
];

interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  description: string | null
  image_url: string | null
  units_count: number
  vacant_units: number
}

const Properties = () => {
  const { user, useSampleData, setUseSampleData } = useAuthStore()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    description: '',
    image_url: ''
  })

  useEffect(() => {
    console.log('Properties component mounted, user:', user?.id)
    console.log('useSampleData flag:', useSampleData)
    
    // Check if we should use sample data
    const shouldUseDevData = import.meta.env.DEV && 
      (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)
    
    console.log('Should use sample data (env check):', shouldUseDevData)
    
    if (shouldUseDevData || useSampleData) {
      console.log('Using sample property data')
      setUseSampleData(true)
      setProperties(SAMPLE_PROPERTIES)
      setLoading(false)
    } else {
      fetchProperties()
    }
  }, [user, useSampleData])

  const fetchProperties = async () => {
    if (!user) {
      console.log('No user found, cannot fetch properties')
      return
    }
    
    setLoading(true)
    try {
      console.log('Fetching properties for landlord:', user.id)
      
      // Fetch properties with unit counts
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          units:units(
            id,
            status
          )
        `)
        .eq('landlord_id', user.id)
        .order('name')
      
      if (error) throw error
      
      // Safely handle the case where data might be null or undefined
      const safeData = Array.isArray(data) ? data : []
      
      // Process the data to include unit counts
      const processedProperties = safeData.map((property: any) => {
        const units = Array.isArray(property.units) ? property.units : []
        const vacantUnits = units.filter((unit: any) => unit.status === 'vacant').length
        
        return {
          ...property,
          units_count: units.length,
          vacant_units: vacantUnits
        }
      })
      
      setProperties(processedProperties)
    } catch (error: any) {
      console.error('Error in fetchProperties:', error)
      toast.error(error.message || 'Error fetching properties')
      
      // If there's an error, use sample data in development mode
      if (import.meta.env.DEV) {
        console.log('Using sample data due to error')
        setUseSampleData(true)
        setProperties(SAMPLE_PROPERTIES)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    try {
      if (useSampleData) {
        // Simulate adding a property with sample data
        console.log('Simulating adding a property with sample data:', formData)
        
        const newProperty = {
          id: `sample-property-${Date.now()}`,
          landlord_id: user.id,
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          description: formData.description || null,
          image_url: formData.image_url || null,
          units_count: 0,
          vacant_units: 0
        }
        
        setProperties([...properties, newProperty])
        toast.success('Property added successfully')
        setShowAddModal(false)
        setFormData({
          name: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          description: '',
          image_url: ''
        })
        return
      }
      
      const { data, error } = await supabase
        .from('properties')
        .insert({
          landlord_id: user.id,
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          description: formData.description || null,
          image_url: formData.image_url || null
        })
        .select()
      
      if (error) throw error
      
      toast.success('Property added successfully')
      setShowAddModal(false)
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        description: '',
        image_url: ''
      })
      
      fetchProperties()
    } catch (error: any) {
      toast.error(error.message || 'Error adding property')
    }
  }

  const handleEditProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !selectedProperty) return
    
    try {
      if (useSampleData) {
        // Simulate editing a property with sample data
        console.log('Simulating editing a property with sample data:', formData)
        
        const updatedProperties = properties.map(property => 
          property.id === selectedProperty.id
            ? {
                ...property,
                name: formData.name,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
                description: formData.description || null,
                image_url: formData.image_url || null
              }
            : property
        )
        
        setProperties(updatedProperties)
        toast.success('Property updated successfully')
        setShowAddModal(false)
        setSelectedProperty(null)
        setFormData({
          name: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          description: '',
          image_url: ''
        })
        return
      }
      
      const { error } = await supabase
        .from('properties')
        .update({
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          description: formData.description || null,
          image_url: formData.image_url || null
        })
        .eq('id', selectedProperty.id)
      
      if (error) throw error
      
      toast.success('Property updated successfully')
      setShowAddModal(false)
      setSelectedProperty(null)
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        description: '',
        image_url: ''
      })
      
      fetchProperties()
    } catch (error: any) {
      toast.error(error.message || 'Error updating property')
    }
  }

  const handleDeleteProperty = async () => {
    if (!selectedProperty) return
    
    try {
      if (useSampleData) {
        // Simulate deleting a property with sample data
        console.log('Simulating deleting a property with sample data:', selectedProperty.id)
        
        // Check if property has units
        if (selectedProperty.units_count > 0) {
          toast.error('Cannot delete property with units. Please delete all units first.')
          setShowDeleteModal(false)
          return
        }
        
        const updatedProperties = properties.filter(property => property.id !== selectedProperty.id)
        setProperties(updatedProperties)
        toast.success('Property deleted successfully')
        setShowDeleteModal(false)
        setSelectedProperty(null)
        return
      }
      
      // Check if property has units
      const { data: units, error: unitsError } = await supabase
        .from('units')
        .select('id')
        .eq('property_id', selectedProperty.id)
      
      if (unitsError) throw unitsError
      
      if (units && units.length > 0) {
        toast.error('Cannot delete property with units. Please delete all units first.')
        setShowDeleteModal(false)
        return
      }
      
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', selectedProperty.id)
      
      if (error) throw error
      
      toast.success('Property deleted successfully')
      setShowDeleteModal(false)
      setSelectedProperty(null)
      
      fetchProperties()
    } catch (error: any) {
      toast.error(error.message || 'Error deleting property')
    }
  }

  const openEditModal = (property: Property) => {
    setSelectedProperty(property)
    setFormData({
      name: property.name,
      address: property.address,
      city: property.city,
      state: property.state,
      zip: property.zip,
      description: property.description || '',
      image_url: property.image_url || ''
    })
    setShowAddModal(true)
  }

  const openDeleteModal = (property: Property) => {
    setSelectedProperty(property)
    setShowDeleteModal(true)
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <div className="flex items-center space-x-4">
          {useSampleData && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Using Sample Data
            </div>
          )}
          <button
            type="button"
            className="btn btn-primary flex items-center"
            onClick={() => {
              setSelectedProperty(null)
              setFormData({
                name: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                description: '',
                image_url: ''
              })
              setShowAddModal(true)
            }}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Property
          </button>
        </div>
      </div>

      {!Array.isArray(properties) || properties.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <BuildingOfficeIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No properties</h3>
          <p className="mt-1 text-gray-500">Get started by adding your first property.</p>
          <div className="mt-6">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setSelectedProperty(null)
                setFormData({
                  name: '',
                  address: '',
                  city: '',
                  state: '',
                  zip: '',
                  description: '',
                  image_url: ''
                })
                setShowAddModal(true)
              }}
            >
              <PlusIcon className="h-5 w-5 mr-2 inline" />
              Add Property
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                {property.image_url ? (
                  <img
                    src={property.image_url}
                    alt={property.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BuildingOfficeIcon className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <div className="p-5">
                <Link to={`/landlord/properties/${property.id}`}>
                  <h3 className="text-lg font-medium text-gray-900 hover:text-primary-600">
                    {property.name}
                  </h3>
                </Link>
                <div className="mt-2 text-sm text-gray-500 space-y-1">
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-1 flex-shrink-0" />
                    <span>
                      {property.address}, {property.city}, {property.state} {property.zip}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <HomeIcon className="h-5 w-5 text-gray-400 mr-1" />
                    <span>
                      {property.units_count} {property.units_count === 1 ? 'unit' : 'units'} ({property.vacant_units} vacant)
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <Link
                    to={`/landlord/properties/${property.id}`}
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    View details
                  </Link>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => openEditModal(property)}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => openDeleteModal(property)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={selectedProperty ? handleEditProperty : handleAddProperty}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {selectedProperty ? 'Edit Property' : 'Add Property'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="name" className="form-label">
                            Property Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="form-input"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="address" className="form-label">
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            required
                            className="form-input"
                            value={formData.address}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="city" className="form-label">
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              id="city"
                              required
                              className="form-input"
                              value={formData.city}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <label htmlFor="state" className="form-label">
                              State
                            </label>
                            <input
                              type="text"
                              name="state"
                              id="state"
                              required
                              className="form-input"
                              value={formData.state}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="zip" className="form-label">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zip"
                            id="zip"
                            required
                            className="form-input"
                            value={formData.zip}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="description" className="form-label">
                            Description (Optional)
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows={3}
                            className="form-input"
                            value={formData.description}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="image_url" className="form-label">
                            Image URL (Optional)
                          </label>
                          <input
                            type="text"
                            name="image_url"
                            id="image_url"
                            className="form-input"
                            value={formData.image_url}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
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
                  >
                    {selectedProperty ? 'Save Changes' : 'Add Property'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 sm:mt-0"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProperty && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Property
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <strong>{selectedProperty.name}</strong>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="btn btn-danger sm:ml-3"
                  onClick={handleDeleteProperty}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mt-3 sm:mt-0"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Properties
