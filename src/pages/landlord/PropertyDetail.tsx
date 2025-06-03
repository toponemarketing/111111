import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  PlusIcon,
  HomeIcon,
  UserIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'

// Sample property data
const SAMPLE_PROPERTY = {
  id: '00000000-0000-0000-0000-000000000101',
  landlord_id: '00000000-0000-0000-0000-000000000001',
  name: 'Sunset Apartments',
  address: '123 Sunset Blvd',
  city: 'Los Angeles',
  state: 'CA',
  zip: '90001',
  description: 'Modern apartment complex with great amenities',
  image_url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
};

// Sample units data
const SAMPLE_UNITS = [
  {
    id: '00000000-0000-0000-0000-000000000201',
    property_id: '00000000-0000-0000-0000-000000000101',
    unit_number: '101',
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 750,
    rent_amount: 1200,
    status: 'occupied',
    description: 'Cozy 1-bedroom apartment with balcony',
    leases: [
      {
        id: '00000000-0000-0000-0000-000000000301',
        tenant_id: '00000000-0000-0000-0000-000000000003',
        start_date: '2023-01-01',
        end_date: '2024-01-01',
        rent_amount: 1200,
        status: 'active',
        tenant: {
          first_name: 'Michael',
          last_name: 'Brown',
          email: 'michael.brown@example.com',
          phone: '555-111-2222'
        }
      }
    ]
  },
  {
    id: '00000000-0000-0000-0000-000000000202',
    property_id: '00000000-0000-0000-0000-000000000101',
    unit_number: '102',
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1000,
    rent_amount: 1800,
    status: 'occupied',
    description: 'Spacious 2-bedroom apartment with modern kitchen',
    leases: [
      {
        id: '00000000-0000-0000-0000-000000000302',
        tenant_id: '00000000-0000-0000-0000-000000000004',
        start_date: '2023-02-15',
        end_date: '2024-02-15',
        rent_amount: 1800,
        status: 'active',
        tenant: {
          first_name: 'Emily',
          last_name: 'Davis',
          email: 'emily.davis@example.com',
          phone: '555-333-4444'
        }
      }
    ]
  },
  {
    id: '00000000-0000-0000-0000-000000000203',
    property_id: '00000000-0000-0000-0000-000000000101',
    unit_number: '103',
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 900,
    rent_amount: 1600,
    status: 'vacant',
    description: 'Bright 2-bedroom apartment with city views',
    leases: []
  }
];

// Sample properties mapping for easy lookup
const SAMPLE_PROPERTIES_MAP = {
  '00000000-0000-0000-0000-000000000101': {
    property: SAMPLE_PROPERTY,
    units: SAMPLE_UNITS
  },
  '00000000-0000-0000-0000-000000000102': {
    property: {
      id: '00000000-0000-0000-0000-000000000102',
      landlord_id: '00000000-0000-0000-0000-000000000001',
      name: 'Riverside Condos',
      address: '456 River St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      description: 'Luxury condos with river views',
      image_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
    },
    units: [
      {
        id: '00000000-0000-0000-0000-000000000204',
        property_id: '00000000-0000-0000-0000-000000000102',
        unit_number: '201',
        bedrooms: 3,
        bathrooms: 2,
        square_feet: 1500,
        rent_amount: 2500,
        status: 'occupied',
        description: 'Luxury 3-bedroom condo with river views',
        leases: [
          {
            id: '00000000-0000-0000-0000-000000000303',
            tenant_id: '00000000-0000-0000-0000-000000000005',
            start_date: '2023-03-01',
            end_date: '2024-03-01',
            rent_amount: 2500,
            status: 'active',
            tenant: {
              first_name: 'David',
              last_name: 'Wilson',
              email: 'david.wilson@example.com',
              phone: '555-555-6666'
            }
          }
        ]
      },
      {
        id: '00000000-0000-0000-0000-000000000205',
        property_id: '00000000-0000-0000-0000-000000000102',
        unit_number: '202',
        bedrooms: 2,
        bathrooms: 2,
        square_feet: 1200,
        rent_amount: 2200,
        status: 'vacant',
        description: 'Modern 2-bedroom condo with updated appliances',
        leases: []
      }
    ]
  },
  '00000000-0000-0000-0000-000000000103': {
    property: {
      id: '00000000-0000-0000-0000-000000000103',
      landlord_id: '00000000-0000-0000-0000-000000000001',
      name: 'Mountain View Homes',
      address: '789 Mountain Rd',
      city: 'Denver',
      state: 'CO',
      zip: '80201',
      description: 'Beautiful homes with mountain views',
      image_url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'
    },
    units: [
      {
        id: '00000000-0000-0000-0000-000000000206',
        property_id: '00000000-0000-0000-0000-000000000103',
        unit_number: '301',
        bedrooms: 4,
        bathrooms: 3,
        square_feet: 2000,
        rent_amount: 3000,
        status: 'occupied',
        description: 'Spacious 4-bedroom home with mountain views',
        leases: [
          {
            id: '00000000-0000-0000-0000-000000000305',
            tenant_id: '00000000-0000-0000-0000-000000000007',
            start_date: '2023-05-01',
            end_date: '2024-05-01',
            rent_amount: 3000,
            status: 'active',
            tenant: {
              first_name: 'Robert',
              last_name: 'Anderson',
              email: 'robert.anderson@example.com',
              phone: '555-999-0000'
            }
          }
        ]
      }
    ]
  }
};

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, useSampleData } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [property, setProperty] = useState<any>(null)
  const [units, setUnits] = useState<any[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddUnitModal, setShowAddUnitModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  
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
  
  // Unit form state
  const [unitFormData, setUnitFormData] = useState({
    unit_number: '',
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 0,
    rent_amount: 0,
    status: 'vacant',
    description: ''
  })

  useEffect(() => {
    console.log('PropertyDetail component mounted, id:', id, 'user:', user?.id)
    console.log('useSampleData flag:', useSampleData)
    
    if (id && user) {
      if (useSampleData) {
        console.log('Using sample property data for id:', id)
        loadSamplePropertyData(id)
      } else {
        fetchPropertyDetails()
      }
    }
  }, [id, user, useSampleData])

  const loadSamplePropertyData = (propertyId: string) => {
    console.log('Loading sample property data for id:', propertyId)
    
    // Find the property in our sample data
    const samplePropertyData = SAMPLE_PROPERTIES_MAP[propertyId]
    
    if (samplePropertyData) {
      console.log('Found sample property data:', samplePropertyData)
      setProperty(samplePropertyData.property)
      setUnits(samplePropertyData.units)
      
      // Set form data
      setFormData({
        name: samplePropertyData.property.name,
        address: samplePropertyData.property.address,
        city: samplePropertyData.property.city,
        state: samplePropertyData.property.state,
        zip: samplePropertyData.property.zip,
        description: samplePropertyData.property.description || '',
        image_url: samplePropertyData.property.image_url || ''
      })
    } else {
      console.log('No sample property found for id:', propertyId)
      toast.error('Property not found')
      navigate('/landlord/properties')
    }
    
    setLoading(false)
  }

  const fetchPropertyDetails = async () => {
    if (!id || !user) return
    
    setLoading(true)
    try {
      // Fetch property
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('landlord_id', user.id)
        .single()
      
      if (propertyError) throw propertyError
      
      setProperty(propertyData)
      setFormData({
        name: propertyData.name,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        zip: propertyData.zip,
        description: propertyData.description || '',
        image_url: propertyData.image_url || ''
      })
      
      // Fetch units
      const { data: unitsData, error: unitsError } = await supabase
        .from('units')
        .select(`
          *,
          leases:leases(
            id,
            tenant_id,
            start_date,
            end_date,
            rent_amount,
            status,
            tenant:profiles(
              first_name,
              last_name,
              email,
              phone
            )
          )
        `)
        .eq('property_id', id)
        .order('unit_number')
      
      if (unitsError) throw unitsError
      
      setUnits(unitsData || [])
    } catch (error: any) {
      toast.error(error.message || 'Error fetching property details')
      navigate('/landlord/properties')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUnitInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUnitFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !id) return
    
    setLoading(true)
    try {
      if (useSampleData) {
        // Simulate updating a property with sample data
        console.log('Simulating updating property with sample data:', formData)
        
        // Update the property in our state
        const updatedProperty = {
          ...property,
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          description: formData.description || null,
          image_url: formData.image_url || null
        }
        
        setProperty(updatedProperty)
        setShowEditModal(false)
        toast.success('Property updated successfully')
        setLoading(false)
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
        .eq('id', id)
      
      if (error) throw error
      
      setProperty({
        ...property,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        description: formData.description || null,
        image_url: formData.image_url || null
      })
      
      setShowEditModal(false)
      toast.success('Property updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error updating property')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProperty = async () => {
    if (!id || !user) return
    
    setLoading(true)
    try {
      if (useSampleData) {
        // Simulate deleting a property with sample data
        console.log('Simulating deleting property with sample data')
        
        // Check if property has units
        if (units.length > 0) {
          toast.error('Cannot delete property with units. Please delete all units first.')
          setShowDeleteModal(false)
          setLoading(false)
          return
        }
        
        toast.success('Property deleted successfully')
        navigate('/landlord/properties')
        setLoading(false)
        return
      }
      
      // Check if property has units
      if (units.length > 0) {
        toast.error('Cannot delete property with units. Please delete all units first.')
        setShowDeleteModal(false)
        return
      }
      
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast.success('Property deleted successfully')
      navigate('/landlord/properties')
    } catch (error: any) {
      toast.error(error.message || 'Error deleting property')
    } finally {
      setLoading(false)
      setShowDeleteModal(false)
    }
  }

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !id) return
    
    setLoading(true)
    try {
      if (useSampleData) {
        // Simulate adding a unit with sample data
        console.log('Simulating adding a unit with sample data:', unitFormData)
        
        const newUnit = {
          id: `sample-unit-${Date.now()}`,
          property_id: id,
          unit_number: unitFormData.unit_number,
          bedrooms: parseInt(unitFormData.bedrooms.toString()),
          bathrooms: parseFloat(unitFormData.bathrooms.toString()),
          square_feet: parseInt(unitFormData.square_feet.toString()) || 0,
          rent_amount: parseFloat(unitFormData.rent_amount.toString()),
          status: unitFormData.status,
          description: unitFormData.description || null,
          leases: []
        }
        
        // Add the new unit to the units array
        setUnits([...units, newUnit])
        
        setShowAddUnitModal(false)
        setUnitFormData({
          unit_number: '',
          bedrooms: 1,
          bathrooms: 1,
          square_feet: 0,
          rent_amount: 0,
          status: 'vacant',
          description: ''
        })
        
        toast.success('Unit added successfully')
        setLoading(false)
        return
      }
      
      const { data, error } = await supabase
        .from('units')
        .insert([
          {
            property_id: id,
            unit_number: unitFormData.unit_number,
            bedrooms: parseInt(unitFormData.bedrooms.toString()),
            bathrooms: parseFloat(unitFormData.bathrooms.toString()),
            square_feet: parseInt(unitFormData.square_feet.toString()) || 0,
            rent_amount: parseFloat(unitFormData.rent_amount.toString()),
            status: unitFormData.status,
            description: unitFormData.description || null
          }
        ])
        .select()
        .single()
      
      if (error) throw error
      
      // Add the new unit to the units array
      setUnits([...units, { ...data, leases: [] }])
      
      setShowAddUnitModal(false)
      setUnitFormData({
        unit_number: '',
        bedrooms: 1,
        bathrooms: 1,
        square_feet: 0,
        rent_amount: 0,
        status: 'vacant',
        description: ''
      })
      
      toast.success('Unit added successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error adding unit')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUnit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !id || !selectedUnit) return
    
    setLoading(true)
    try {
      if (useSampleData) {
        // Simulate updating a unit with sample data
        console.log('Simulating updating a unit with sample data:', unitFormData)
        
        // Update the unit in our state
        const updatedUnits = units.map(unit => 
          unit.id === selectedUnit.id 
            ? { 
                ...unit, 
                unit_number: unitFormData.unit_number,
                bedrooms: parseInt(unitFormData.bedrooms.toString()),
                bathrooms: parseFloat(unitFormData.bathrooms.toString()),
                square_feet: parseInt(unitFormData.square_feet.toString()) || 0,
                rent_amount: parseFloat(unitFormData.rent_amount.toString()),
                status: unitFormData.status,
                description: unitFormData.description || null
              } 
            : unit
        )
        
        setUnits(updatedUnits)
        
        setShowAddUnitModal(false)
        setSelectedUnit(null)
        setUnitFormData({
          unit_number: '',
          bedrooms: 1,
          bathrooms: 1,
          square_feet: 0,
          rent_amount: 0,
          status: 'vacant',
          description: ''
        })
        
        toast.success('Unit updated successfully')
        setLoading(false)
        return
      }
      
      const { error } = await supabase
        .from('units')
        .update({
          unit_number: unitFormData.unit_number,
          bedrooms: parseInt(unitFormData.bedrooms.toString()),
          bathrooms: parseFloat(unitFormData.bathrooms.toString()),
          square_feet: parseInt(unitFormData.square_feet.toString()) || 0,
          rent_amount: parseFloat(unitFormData.rent_amount.toString()),
          status: unitFormData.status,
          description: unitFormData.description || null
        })
        .eq('id', selectedUnit.id)
      
      if (error) throw error
      
      // Update the unit in the units array
      setUnits(units.map(unit => 
        unit.id === selectedUnit.id 
          ? { 
              ...unit, 
              unit_number: unitFormData.unit_number,
              bedrooms: parseInt(unitFormData.bedrooms.toString()),
              bathrooms: parseFloat(unitFormData.bathrooms.toString()),
              square_feet: parseInt(unitFormData.square_feet.toString()) || 0,
              rent_amount: parseFloat(unitFormData.rent_amount.toString()),
              status: unitFormData.status,
              description: unitFormData.description || null
            } 
          : unit
      ))
      
      setShowAddUnitModal(false)
      setSelectedUnit(null)
      setUnitFormData({
        unit_number: '',
        bedrooms: 1,
        bathrooms: 1,
        square_feet: 0,
        rent_amount: 0,
        status: 'vacant',
        description: ''
      })
      
      toast.success('Unit updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error updating unit')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUnit = async (unitId: string) => {
    if (!user || !id) return
    
    // Find the unit
    const unit = units.find(u => u.id === unitId)
    
    // Check if unit has active leases
    if (unit && unit.leases && unit.leases.some((lease: any) => lease.status === 'active')) {
      toast.error('Cannot delete unit with active leases. Please terminate all leases first.')
      return
    }
    
    if (!window.confirm('Are you sure you want to delete this unit?')) {
      return
    }
    
    setLoading(true)
    try {
      if (useSampleData) {
        // Simulate deleting a unit with sample data
        console.log('Simulating deleting a unit with sample data:', unitId)
        
        // Remove the unit from our state
        const updatedUnits = units.filter(unit => unit.id !== unitId)
        setUnits(updatedUnits)
        
        toast.success('Unit deleted successfully')
        setLoading(false)
        return
      }
      
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', unitId)
      
      if (error) throw error
      
      // Remove the unit from the units array
      setUnits(units.filter(unit => unit.id !== unitId))
      
      toast.success('Unit deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error deleting unit')
    } finally {
      setLoading(false)
    }
  }

  const openEditUnitModal = (unit: any) => {
    setSelectedUnit(unit)
    setUnitFormData({
      unit_number: unit.unit_number,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      square_feet: unit.square_feet || 0,
      rent_amount: unit.rent_amount,
      status: unit.status,
      description: unit.description || ''
    })
    setShowAddUnitModal(true)
  }

  if (loading && !property) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <BuildingOfficeIcon className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Property not found</h3>
        <p className="mt-1 text-gray-500">The property you're looking for doesn't exist or you don't have access to it.</p>
        <div className="mt-6">
          <Link to="/landlord/properties" className="btn btn-primary">
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/landlord/properties" className="mr-4 text-gray-400 hover:text-gray-500">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
        </div>
        <div className="flex space-x-2">
          {useSampleData && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Using Sample Data
            </div>
          )}
          <button
            onClick={() => setShowEditModal(true)}
            className="btn btn-secondary"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit Property
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-danger"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Property details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 h-48 md:h-auto md:w-1/3 bg-gray-200 flex items-center justify-center">
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
          <div className="p-6 md:w-2/3">
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-900">{property.address}</p>
                <p className="text-gray-900">{property.city}, {property.state} {property.zip}</p>
              </div>
            </div>
            
            {property.description && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-900">{property.description}</p>
              </div>
            )}
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Units</h3>
                <p className="text-lg font-medium text-gray-900">{units.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Vacant Units</h3>
                <p className="text-lg font-medium text-gray-900">
                  {units.filter(unit => unit.status === 'vacant').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Units */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Units</h2>
          <button
            onClick={() => {
              setSelectedUnit(null)
              setUnitFormData({
                unit_number: '',
                bedrooms: 1,
                bathrooms: 1,
                square_feet: 0,
                rent_amount: 0,
                status: 'vacant',
                description: ''
              })
              setShowAddUnitModal(true)
            }}
            className="btn btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Unit
          </button>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {units.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {units.map((unit) => {
                const activeLeases = unit.leases?.filter((lease: any) => lease.status === 'active') || []
                const isOccupied = activeLeases.length > 0
                const tenant = isOccupied ? activeLeases[0].tenant : null
                
                return (
                  <div key={unit.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Unit {unit.unit_number}</h3>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => openEditUnitModal(unit)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUnit(unit.id)}
                          className="text-gray-500 hover:text-red-500"
                          disabled={isOccupied}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <HomeIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">
                            {unit.bedrooms} bed • {unit.bathrooms} bath
                            {unit.square_feet ? ` • ${unit.square_feet} sq ft` : ''}
                          </span>
                        </div>
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${unit.status === 'occupied' || isOccupied ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        `}>
                          {unit.status === 'occupied' || isOccupied ? 'Occupied' : 'Vacant'}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-lg font-medium text-gray-900">${unit.rent_amount}/month</span>
                      </div>
                      
                      {unit.description && (
                        <p className="text-sm text-gray-500 mb-3">{unit.description}</p>
                      )}
                      
                      {isOccupied && tenant && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-primary-700 font-medium">
                                  {tenant.first_name[0]}{tenant.last_name[0]}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {tenant.first_name} {tenant.last_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Lease: {format(parseISO(activeLeases[0].start_date), 'MMM d, yyyy')} - 
                                {format(parseISO(activeLeases[0].end_date), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <Link
                          to={`/landlord/units/${unit.id}`}
                          className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <HomeIcon className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No units</h3>
              <p className="mt-1 text-gray-500">Get started by adding your first unit to this property.</p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSelectedUnit(null)
                    setUnitFormData({
                      unit_number: '',
                      bedrooms: 1,
                      bathrooms: 1,
                      square_feet: 0,
                      rent_amount: 0,
                      status: 'vacant',
                      description: ''
                    })
                    setShowAddUnitModal(true)
                  }}
                  className="btn btn-primary"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Unit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Property Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpdateProperty}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Edit Property
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
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 sm:mt-0"
                    onClick={() => setShowEditModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Unit Modal */}
      {showAddUnitModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={selectedUnit ? handleUpdateUnit : handleAddUnit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {selectedUnit ? 'Edit Unit' : 'Add Unit'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="unit_number" className="form-label">
                            Unit Number
                          </label>
                          <input
                            type="text"
                            name="unit_number"
                            id="unit_number"
                            required
                            className="form-input"
                            value={unitFormData.unit_number}
                            onChange={handleUnitInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="bedrooms" className="form-label">
                              Bedrooms
                            </label>
                            <input
                              type="number"
                              name="bedrooms"
                              id="bedrooms"
                              required
                              min="0"
                              className="form-input"
                              value={unitFormData.bedrooms}
                              onChange={handleUnitInputChange}
                            />
                          </div>
                          <div>
                            <label htmlFor="bathrooms" className="form-label">
                              Bathrooms
                            </label>
                            <input
                              type="number"
                              name="bathrooms"
                              id="bathrooms"
                              required
                              min="0"
                              step="0.5"
                              className="form-input"
                              value={unitFormData.bathrooms}
                              onChange={handleUnitInputChange}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="square_feet" className="form-label">
                              Square Feet
                            </label>
                            <input
                              type="number"
                              name="square_feet"
                              id="square_feet"
                              min="0"
                              className="form-input"
                              value={unitFormData.square_feet}
                              onChange={handleUnitInputChange}
                            />
                          </div>
                          <div>
                            <label htmlFor="rent_amount" className="form-label">
                              Rent Amount
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">$</span>
                              </div>
                              <input
                                type="number"
                                name="rent_amount"
                                id="rent_amount"
                                required
                                min="0"
                                step="0.01"
                                className="form-input pl-7"
                                value={unitFormData.rent_amount}
                                onChange={handleUnitInputChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="status" className="form-label">
                            Status
                          </label>
                          <select
                            name="status"
                            id="status"
                            required
                            className="form-select"
                            value={unitFormData.status}
                            onChange={handleUnitInputChange}
                          >
                            <option value="vacant">Vacant</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Under Maintenance</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="unit_description" className="form-label">
                            Description (Optional)
                          </label>
                          <textarea
                            name="description"
                            id="unit_description"
                            rows={3}
                            className="form-input"
                            value={unitFormData.description}
                            onChange={handleUnitInputChange}
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
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : selectedUnit ? 'Update Unit' : 'Add Unit'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 sm:mt-0"
                    onClick={() => setShowAddUnitModal(false)}
                    disabled={loading}
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
      {showDeleteModal && (
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
                        Are you sure you want to delete <strong>{property.name}</strong>? This action cannot be undone.
                        {units.length > 0 && (
                          <span className="block mt-2 text-red-500 font-medium">
                            This property has {units.length} units. You must delete all units first.
                          </span>
                        )}
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
                  disabled={loading || units.length > 0}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mt-3 sm:mt-0"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
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

export default PropertyDetail
