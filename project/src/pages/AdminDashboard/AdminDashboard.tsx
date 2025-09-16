import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface Complaint {
  id: string;
  title: string;
  location: string;
  status: string;
  urgency: 'High' | 'Medium' | 'Low';
  category: string;
  description: string;
  createdAt: string;
  assignedTo?: string;
}

export const AdminDashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    urgency: 'all',
    category: 'all'
  });

  // Sample complaints data with AI prioritization
  const sampleComplaints: Complaint[] = [
    {
      id: 'CMP123456',
      title: 'Pothole - Main Street',
      location: 'MG Road, Pune',
      status: 'Pending',
      urgency: 'High',
      category: 'pothole',
      description: 'Large pothole causing traffic issues and potential accidents',
      createdAt: '2024-01-15T10:30:00Z',
      assignedTo: 'Road Maintenance Dept.'
    },
    {
      id: 'CMP789012',
      title: 'Water Leak - Block B',
      location: 'Anna Nagar, Chennai',
      status: 'In Progress',
      urgency: 'Medium',
      category: 'water-leak',
      description: 'Water pipe burst near residential area',
      createdAt: '2024-01-15T09:15:00Z',
      assignedTo: 'Water Works Dept.'
    },
    {
      id: 'CMP345678',
      title: 'Streetlight not working',
      location: 'Park Street, Kolkata',
      status: 'Pending',
      urgency: 'Low',
      category: 'streetlight',
      description: 'Street light pole damaged, area is dark at night',
      createdAt: '2024-01-15T08:45:00Z'
    },
    {
      id: 'CMP901234',
      title: 'Garbage Collection Missed',
      location: 'Sector 15, Noida',
      status: 'Resolved',
      urgency: 'Medium',
      category: 'garbage',
      description: 'Garbage not collected for 3 days, causing hygiene issues',
      createdAt: '2024-01-14T16:20:00Z',
      assignedTo: 'Sanitation Dept.'
    }
  ];

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    // Load complaints
    setComplaints(sampleComplaints);
    setFilteredComplaints(sampleComplaints);
  }, [navigate]);

  useEffect(() => {
    // Apply filters
    let filtered = complaints;

    if (filters.status !== 'all') {
      filtered = filtered.filter(c => c.status.toLowerCase() === filters.status);
    }

    if (filters.urgency !== 'all') {
      filtered = filtered.filter(c => c.urgency.toLowerCase() === filters.urgency);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(c => c.category === filters.category);
    }

    // Sort by urgency (High -> Medium -> Low) and then by date
    filtered.sort((a, b) => {
      const urgencyOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredComplaints(filtered);
  }, [complaints, filters]);

  const handleStatusChange = (complaintId: string, newStatus: string) => {
    setComplaints(prev => 
      prev.map(c => 
        c.id === complaintId 
          ? { ...c, status: newStatus, assignedTo: newStatus === 'In Progress' ? 'Assigned Department' : c.assignedTo }
          : c
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">NivaranAI - Admin Dashboard</h1>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">{stats.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm font-bold">{stats.pending}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">{stats.inProgress}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">{stats.resolved}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <h2 className="text-lg font-semibold text-gray-900">Ticket Inbox (AI Prioritized)</h2>
              
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.urgency} onValueChange={(value) => setFilters({...filters, urgency: value})}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="pothole">Pothole</SelectItem>
                  <SelectItem value="water-leak">Water Leak</SelectItem>
                  <SelectItem value="streetlight">Streetlight</SelectItem>
                  <SelectItem value="garbage">Garbage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <img className="w-6 h-6" alt="Issue" src="/i-1.svg" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {complaint.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>ID: {complaint.id}</span>
                        <span>•</span>
                        <span>Urgency: <span className={`font-bold ${getUrgencyColor(complaint.urgency)}`}>
                          {complaint.urgency}
                        </span></span>
                        <span>•</span>
                        <span>{complaint.location}</span>
                        {complaint.assignedTo && (
                          <>
                            <span>•</span>
                            <span>Assigned to: {complaint.assignedTo}</span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-700 mt-2">{complaint.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge className={`${getStatusColor(complaint.status)} hover:${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </Badge>

                    {complaint.status === 'Pending' && (
                      <Button 
                        onClick={() => handleStatusChange(complaint.id, 'In Progress')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        Start Work
                      </Button>
                    )}

                    {complaint.status === 'In Progress' && (
                      <Button 
                        onClick={() => handleStatusChange(complaint.id, 'Resolved')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No complaints found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};