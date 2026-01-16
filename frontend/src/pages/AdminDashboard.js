import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, Heart, FileText, TrendingUp, Calendar, MessageSquare, 
  Award, FolderOpen, Briefcase, GraduationCap, DollarSign, 
  Settings, BarChart3, Newspaper, Image, UserCheck, CreditCard,
  Receipt, Mail, Target, Gift, Building, Shield
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [members, setMembers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [newsForm, setNewsForm] = useState({ title: '', content: '', image_url: '' });
  const [activityForm, setActivityForm] = useState({ title: '', description: '', images: [] });
  const [campaignForm, setCampaignForm] = useState({ title: '', description: '', goal_amount: '', start_date: '', end_date: '' });
  const [eventForm, setEventForm] = useState({ title: '', description: '', event_date: '', location: '', registration_fee: 0, is_paid: false });
  const [certificateForm, setCertificateForm] = useState({ certificate_type: 'member', recipient_name: '', recipient_email: '', template_id: 'default' });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/member-dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, membersRes, donationsRes, enquiriesRes, beneficiariesRes] = await Promise.all([
        axios.get(`${API}/stats`),
        axios.get(`${API}/members`),
        axios.get(`${API}/donations`),
        axios.get(`${API}/enquiries`),
        axios.get(`${API}/beneficiaries`)
      ]);
      setStats(statsRes.data);
      setMembers(membersRes.data);
      setDonations(donationsRes.data);
      setEnquiries(enquiriesRes.data);
      setBeneficiaries(beneficiariesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMemberStatus = async (memberId, status) => {
    try {
      await axios.patch(`${API}/members/${memberId}/status?status=${status}`);
      toast.success('Member status updated!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/news`, { ...newsForm, author_id: user.id });
      toast.success('News published successfully!');
      setNewsForm({ title: '', content: '', image_url: '' });
      setActiveTab('overview');
    } catch (error) {
      toast.error('Failed to publish news');
    }
  };

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/activities`, { ...activityForm, author_id: user.id });
      toast.success('Activity posted successfully!');
      setActivityForm({ title: '', description: '', images: [] });
      setActiveTab('overview');
    } catch (error) {
      toast.error('Failed to post activity');
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/campaigns`, {
        ...campaignForm,
        goal_amount: parseFloat(campaignForm.goal_amount),
        current_amount: 0,
        status: 'active'
      });
      toast.success('Campaign created successfully!');
      setCampaignForm({ title: '', description: '', goal_amount: '', start_date: '', end_date: '' });
      setActiveTab('overview');
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/events`, {
        ...eventForm,
        registration_fee: parseFloat(eventForm.registration_fee),
        max_participants: null,
        registered_count: 0
      });
      toast.success('Event created successfully!');
      setEventForm({ title: '', description: '', event_date: '', location: '', registration_fee: 0, is_paid: false });
      setActiveTab('overview');
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const handleGenerateCertificate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/certificates`, certificateForm);
      toast.success('Certificate generated and sent!');
      setCertificateForm({ certificate_type: 'member', recipient_name: '', recipient_email: '', template_id: 'default' });
      setActiveTab('overview');
    } catch (error) {
      toast.error('Failed to generate certificate');
    }
  };

  const adminModules = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'donations', label: 'Donations', icon: Heart },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: UserCheck },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'activities', label: 'Activities', icon: Image },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'internships', label: 'Internships', icon: GraduationCap },
    { id: 'designations', label: 'Designations', icon: Briefcase },
    { id: 'receipts', label: 'Receipts', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50" data-testid="admin-dashboard">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-stone-200 min-h-screen sticky top-0">
          <div className="p-6">
            <h2 className="font-heading font-bold text-xl text-stone-900 mb-6">Admin Panel</h2>
            <nav className="space-y-1">
              {adminModules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveTab(module.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === module.id
                        ? 'bg-primary text-white'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                    data-testid={`admin-tab-${module.id}`}
                  >
                    <Icon size={20} />
                    <span className="font-medium text-sm">{module.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="font-heading font-bold text-3xl text-stone-900 mb-2">
                {adminModules.find(m => m.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-stone-600">Welcome back, {user?.name}</p>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <Card data-testid="admin-members-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Total Members</CardTitle>
                      <Users className="text-primary" size={20} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">{stats.total_members || 0}</div>
                    </CardContent>
                  </Card>

                  <Card data-testid="admin-donations-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Total Donations</CardTitle>
                      <Heart className="text-secondary" size={20} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">₹{((stats.total_amount || 0) / 1000).toFixed(1)}K</div>
                    </CardContent>
                  </Card>

                  <Card data-testid="admin-beneficiaries-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Beneficiaries</CardTitle>
                      <FileText className="text-primary" size={20} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">{stats.total_beneficiaries || 0}</div>
                    </CardContent>
                  </Card>

                  <Card data-testid="admin-campaigns-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Active Campaigns</CardTitle>
                      <TrendingUp className="text-secondary" size={20} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">{stats.total_campaigns || 0}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {members.slice(0, 5).map((member, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg">
                            <div>
                              <p className="font-semibold text-stone-900">{member.member_number}</p>
                              <p className="text-sm text-stone-600">{member.designation}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              member.status === 'approved' ? 'bg-green-100 text-green-800' :
                              member.status === 'blocked' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {member.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {donations.slice(0, 5).map((donation, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg">
                            <div>
                              <p className="font-semibold text-stone-900">{donation.donor_name}</p>
                              <p className="text-sm text-stone-600">₹{donation.amount}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              donation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {donation.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <Card>
                <CardHeader>
                  <CardTitle>Member Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {members.length === 0 ? (
                    <p className="text-stone-600 text-center py-8">No members yet</p>
                  ) : (
                    <div className="space-y-4">
                      {members.map((member, index) => (
                        <div key={member.id} className="flex justify-between items-center p-4 bg-stone-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-stone-900">{member.member_number}</p>
                            <p className="text-sm text-stone-600">{member.designation} - ₹{member.designation_fee}</p>
                          </div>
                          <div className="flex space-x-2">
                            {member.status === 'pending' && (
                              <Button size="sm" onClick={() => handleUpdateMemberStatus(member.id, 'approved')}>
                                Approve
                              </Button>
                            )}
                            {member.status === 'approved' && (
                              <Button size="sm" variant="destructive" onClick={() => handleUpdateMemberStatus(member.id, 'blocked')}>
                                Block
                              </Button>
                            )}
                            {member.status === 'blocked' && (
                              <Button size="sm" onClick={() => handleUpdateMemberStatus(member.id, 'approved')}>
                                Unblock
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Donations Tab */}
            {activeTab === 'donations' && (
              <Card>
                <CardHeader>
                  <CardTitle>Donation Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {donations.map((donation, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-stone-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-stone-900">{donation.donor_name}</p>
                          <p className="text-sm text-stone-600">{donation.donor_email}</p>
                          <p className="text-sm text-stone-500">Receipt: {donation.receipt_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-stone-900">₹{donation.amount}</p>
                          <p className="text-sm text-stone-600">{new Date(donation.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* News Management */}
            {activeTab === 'news' && (
              <Card>
                <CardHeader>
                  <CardTitle>Create News</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateNews} className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Content</Label>
                      <Textarea
                        value={newsForm.content}
                        onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                        rows={5}
                        required
                      />
                    </div>
                    <div>
                      <Label>Image URL (Optional)</Label>
                      <Input
                        value={newsForm.image_url}
                        onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full">Publish News</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Activity Management */}
            {activeTab === 'activities' && (
              <Card>
                <CardHeader>
                  <CardTitle>Post Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateActivity} className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={activityForm.title}
                        onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={activityForm.description}
                        onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Post Activity</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Campaign Management */}
            {activeTab === 'campaigns' && (
              <Card>
                <CardHeader>
                  <CardTitle>Create Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCampaign} className="space-y-4">
                    <div>
                      <Label>Campaign Title</Label>
                      <Input
                        value={campaignForm.title}
                        onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={campaignForm.description}
                        onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Goal Amount (₹)</Label>
                        <Input
                          type="number"
                          value={campaignForm.goal_amount}
                          onChange={(e) => setCampaignForm({ ...campaignForm, goal_amount: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={campaignForm.start_date}
                          onChange={(e) => setCampaignForm({ ...campaignForm, start_date: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={campaignForm.end_date}
                        onChange={(e) => setCampaignForm({ ...campaignForm, end_date: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Create Campaign</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Event Management */}
            {activeTab === 'events' && (
              <Card>
                <CardHeader>
                  <CardTitle>Create Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div>
                      <Label>Event Title</Label>
                      <Input
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Event Date</Label>
                        <Input
                          type="datetime-local"
                          value={eventForm.event_date}
                          onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={eventForm.location}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Registration Fee (₹)</Label>
                      <Input
                        type="number"
                        value={eventForm.registration_fee}
                        onChange={(e) => setEventForm({ ...eventForm, registration_fee: e.target.value, is_paid: parseFloat(e.target.value) > 0 })}
                      />
                    </div>
                    <Button type="submit" className="w-full">Create Event</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Certificate Generation */}
            {activeTab === 'certificates' && (
              <Card>
                <CardHeader>
                  <CardTitle>Generate Certificate</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerateCertificate} className="space-y-4">
                    <div>
                      <Label>Certificate Type</Label>
                      <Select
                        value={certificateForm.certificate_type}
                        onValueChange={(value) => setCertificateForm({ ...certificateForm, certificate_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member Certificate</SelectItem>
                          <SelectItem value="visitor">Visitor Certificate</SelectItem>
                          <SelectItem value="achievement">Achievement Certificate</SelectItem>
                          <SelectItem value="internship">Internship Certificate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Recipient Name</Label>
                      <Input
                        value={certificateForm.recipient_name}
                        onChange={(e) => setCertificateForm({ ...certificateForm, recipient_name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Recipient Email</Label>
                      <Input
                        type="email"
                        value={certificateForm.recipient_email}
                        onChange={(e) => setCertificateForm({ ...certificateForm, recipient_email: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Generate & Send Certificate</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Enquiries */}
            {activeTab === 'enquiries' && (
              <Card>
                <CardHeader>
                  <CardTitle>Enquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enquiries.map((enquiry, i) => (
                      <div key={i} className="p-4 bg-stone-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-stone-900">{enquiry.name}</p>
                            <p className="text-sm text-stone-600">{enquiry.email} | {enquiry.phone}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            enquiry.status === 'replied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {enquiry.status}
                          </span>
                        </div>
                        <p className="text-sm text-stone-600">{enquiry.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Beneficiaries */}
            {activeTab === 'beneficiaries' && (
              <Card>
                <CardHeader>
                  <CardTitle>Beneficiaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {beneficiaries.map((beneficiary, i) => (
                      <div key={i} className="p-4 bg-stone-50 rounded-lg">
                        <p className="font-semibold text-stone-900">{beneficiary.name}</p>
                        <p className="text-sm text-stone-600">Category: {beneficiary.category}</p>
                        <p className="text-sm text-stone-600">Address: {beneficiary.address}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Placeholder for other tabs */}
            {['projects', 'expenses', 'internships', 'designations', 'receipts', 'reports'].includes(activeTab) && (
              <Card>
                <CardHeader>
                  <CardTitle>{adminModules.find(m => m.id === activeTab)?.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-stone-600 mb-4">This module is under development</p>
                    <p className="text-sm text-stone-500">Features coming soon!</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;