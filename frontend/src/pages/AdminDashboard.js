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
  BarChart3, Newspaper, Image, UserCheck, Receipt, Download
} from 'lucide-react';
import { toast } from 'sonner';
import { downloadCertificatePDF, downloadReceiptPDF } from '../utils/pdfGenerator';

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
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [internships, setInternships] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [beneficiaryForm, setBeneficiaryForm] = useState({
    name: '', age: '', gender: '', address: '', phone: '', category: '', description: ''
  });
  const [memberForm, setMemberForm] = useState({ 
    user_id: '', designation: '', designation_fee: '', date_of_birth: '', 
    address: '', city: '', state: '', pincode: '', phone: '' 
  });
  const [newsForm, setNewsForm] = useState({ title: '', content: '', image_url: '' });
  const [activityForm, setActivityForm] = useState({ title: '', description: '', images: [] });
  const [campaignForm, setCampaignForm] = useState({ title: '', description: '', goal_amount: '', start_date: '', end_date: '' });
  const [eventForm, setEventForm] = useState({ title: '', description: '', event_date: '', location: '', registration_fee: 0, is_paid: false });
  const [certificateForm, setCertificateForm] = useState({ certificate_type: 'member', recipient_name: '', recipient_email: '', template_id: 'default' });
  const [projectForm, setProjectForm] = useState({ title: '', description: '', budget: '', start_date: '' });
  const [expenseForm, setExpenseForm] = useState({ category: '', amount: '', description: '', project_id: '' });
  const [internshipForm, setInternshipForm] = useState({ title: '', description: '', duration: '', positions: 1 });
  const [designationForm, setDesignationForm] = useState({ name: '', fee: '', benefits: [] });
  const [receiptForm, setReceiptForm] = useState({ receipt_type: 'donation', recipient_name: '', recipient_email: '', amount: '', description: '' });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/member-dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, membersRes, donationsRes, enquiriesRes, beneficiariesRes, projectsRes, expensesRes, internshipsRes, designationsRes, receiptsRes] = await Promise.all([
        axios.get(`${API}/stats`),
        axios.get(`${API}/members`),
        axios.get(`${API}/donations`),
        axios.get(`${API}/enquiries`),
        axios.get(`${API}/beneficiaries`),
        axios.get(`${API}/projects`).catch(() => ({ data: [] })),
        axios.get(`${API}/expenses`).catch(() => ({ data: [] })),
        axios.get(`${API}/internships`).catch(() => ({ data: [] })),
        axios.get(`${API}/designations`).catch(() => ({ data: [] })),
        axios.get(`${API}/receipts`).catch(() => ({ data: [] }))
      ]);
      setStats(statsRes.data);
      setMembers(membersRes.data);
      setDonations(donationsRes.data);
      setEnquiries(enquiriesRes.data);
      setBeneficiaries(beneficiariesRes.data);
      setProjects(projectsRes.data);
      setExpenses(expensesRes.data);
      setInternships(internshipsRes.data);
      setDesignations(designationsRes.data);
      setReceipts(receiptsRes.data);
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
      fetchData();
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
      fetchData();
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
      fetchData();
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
      fetchData();
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
      fetchData();
    } catch (error) {
      toast.error('Failed to generate certificate');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/projects`, {
        ...projectForm,
        budget: parseFloat(projectForm.budget),
        spent: 0,
        status: 'active'
      });
      toast.success('Project created successfully!');
      setProjectForm({ title: '', description: '', budget: '', start_date: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/expenses`, {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount)
      });
      toast.success('Expense added successfully!');
      setExpenseForm({ category: '', amount: '', description: '', project_id: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const handleCreateInternship = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/internships`, {
        ...internshipForm,
        positions: parseInt(internshipForm.positions),
        applications: []
      });
      toast.success('Internship created successfully!');
      setInternshipForm({ title: '', description: '', duration: '', positions: 1 });
      fetchData();
    } catch (error) {
      toast.error('Failed to create internship');
    }
  };

  const handleCreateDesignation = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/designations`, {
        ...designationForm,
        fee: parseFloat(designationForm.fee)
      });
      toast.success('Designation created successfully!');
      setDesignationForm({ name: '', fee: '', benefits: [] });
      fetchData();
    } catch (error) {
      toast.error('Failed to create designation');
    }
  };

  const handleCreateReceipt = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/receipts`, {
        ...receiptForm,
        amount: parseFloat(receiptForm.amount)
      });
      toast.success('Receipt generated and sent!');
      setReceiptForm({ receipt_type: 'donation', recipient_name: '', recipient_email: '', amount: '', description: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to generate receipt');
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
    { id: 'campaigns', label: 'Campaigns', icon: TrendingUp },
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
        <aside className="w-64 bg-white border-r border-stone-200 min-h-screen sticky top-0 overflow-y-auto">
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
        <main className="flex-1 p-8 overflow-y-auto">
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
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Total Members</CardTitle>
                      <Users className="text-primary" size={20} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">{stats.total_members || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Total Donations</CardTitle>
                      <Heart className="text-secondary" size={20} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">₹{((stats.total_amount || 0) / 1000).toFixed(1)}K</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Projects</CardTitle>
                      <FolderOpen className="text-primary" size={20} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">{projects.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-stone-600">Expenses</CardTitle>
                      <DollarSign className="text-secondary" size={20} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-stone-900">
                        ₹{(expenses.reduce((sum, e) => sum + e.amount, 0) / 1000).toFixed(1)}K
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Member</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={memberForm.phone}
                          onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <Label>Designation</Label>
                        <Select
                          value={memberForm.designation}
                          onValueChange={(value) => setMemberForm({ ...memberForm, designation: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select designation" />
                          </SelectTrigger>
                          <SelectContent>
                            {designations.map((d) => (
                              <SelectItem key={d.id} value={d.name}>{d.name} - ₹{d.fee}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Designation Fee</Label>
                        <Input
                          type="number"
                          value={memberForm.designation_fee}
                          onChange={(e) => setMemberForm({ ...memberForm, designation_fee: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={memberForm.date_of_birth}
                          onChange={(e) => setMemberForm({ ...memberForm, date_of_birth: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Address</Label>
                        <Input
                          value={memberForm.address}
                          onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input
                          value={memberForm.city}
                          onChange={(e) => setMemberForm({ ...memberForm, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          value={memberForm.state}
                          onChange={(e) => setMemberForm({ ...memberForm, state: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Pincode</Label>
                        <Input
                          value={memberForm.pincode}
                          onChange={(e) => setMemberForm({ ...memberForm, pincode: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Button type="button" className="w-full" onClick={() => {
                          toast.info('Member registration requires user account first');
                        }}>
                          Add Member
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Member Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {members.length === 0 ? (
                      <p className="text-stone-600 text-center py-8">No members yet</p>
                    ) : (
                      <div className="space-y-4">
                        {members.map((member) => (
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
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateProject} className="space-y-4">
                      <div>
                        <Label>Project Title</Label>
                        <Input
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          rows={4}
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Budget (₹)</Label>
                          <Input
                            type="number"
                            value={projectForm.budget}
                            onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={projectForm.start_date}
                            onChange={(e) => setProjectForm({ ...projectForm, start_date: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">Create Project</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="p-4 bg-stone-50 rounded-lg">
                          <h3 className="font-semibold text-stone-900">{project.title}</h3>
                          <p className="text-sm text-stone-600 mt-2">{project.description}</p>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-stone-600">Budget: ₹{project.budget}</span>
                            <span className="text-sm text-stone-600">Spent: ₹{project.spent}</span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {project.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Expenses Tab */}
            {activeTab === 'expenses' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Expense</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateExpense} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Category</Label>
                          <Select
                            value={expenseForm.category}
                            onValueChange={(value) => setExpenseForm({ ...expenseForm, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="office">Office Expenses</SelectItem>
                              <SelectItem value="travel">Travel</SelectItem>
                              <SelectItem value="supplies">Supplies</SelectItem>
                              <SelectItem value="utilities">Utilities</SelectItem>
                              <SelectItem value="salaries">Salaries</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Amount (₹)</Label>
                          <Input
                            type="number"
                            value={expenseForm.amount}
                            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={expenseForm.description}
                          onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <Label>Project (Optional)</Label>
                        <Select
                          value={expenseForm.project_id}
                          onValueChange={(value) => setExpenseForm({ ...expenseForm, project_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No Project</SelectItem>
                            {projects.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full">Add Expense</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Expense Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {expenses.map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-4 bg-stone-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-stone-900">{expense.category}</p>
                            <p className="text-sm text-stone-600">{expense.description}</p>
                            <p className="text-xs text-stone-500 mt-1">
                              {new Date(expense.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-stone-900">₹{expense.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Internships Tab */}
            {activeTab === 'internships' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Internship</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateInternship} className="space-y-4">
                      <div>
                        <Label>Internship Title</Label>
                        <Input
                          value={internshipForm.title}
                          onChange={(e) => setInternshipForm({ ...internshipForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={internshipForm.description}
                          onChange={(e) => setInternshipForm({ ...internshipForm, description: e.target.value })}
                          rows={4}
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Duration</Label>
                          <Input
                            value={internshipForm.duration}
                            onChange={(e) => setInternshipForm({ ...internshipForm, duration: e.target.value })}
                            placeholder="e.g., 3 months"
                            required
                          />
                        </div>
                        <div>
                          <Label>Positions</Label>
                          <Input
                            type="number"
                            value={internshipForm.positions}
                            onChange={(e) => setInternshipForm({ ...internshipForm, positions: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">Create Internship</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Internships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {internships.map((internship) => (
                        <div key={internship.id} className="p-4 bg-stone-50 rounded-lg">
                          <h3 className="font-semibold text-stone-900">{internship.title}</h3>
                          <p className="text-sm text-stone-600 mt-2">{internship.description}</p>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-stone-600">Duration: {internship.duration}</span>
                            <span className="text-sm text-stone-600">Positions: {internship.positions}</span>
                            <span className="text-sm text-stone-600">
                              Applications: {internship.applications?.length || 0}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Designations Tab */}
            {activeTab === 'designations' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Designation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateDesignation} className="space-y-4">
                      <div>
                        <Label>Designation Name</Label>
                        <Input
                          value={designationForm.name}
                          onChange={(e) => setDesignationForm({ ...designationForm, name: e.target.value })}
                          placeholder="e.g., Volunteer, Secretary, President"
                          required
                        />
                      </div>
                      <div>
                        <Label>Membership Fee (₹)</Label>
                        <Input
                          type="number"
                          value={designationForm.fee}
                          onChange={(e) => setDesignationForm({ ...designationForm, fee: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Benefits (comma separated)</Label>
                        <Input
                          value={designationForm.benefits.join(', ')}
                          onChange={(e) => setDesignationForm({ ...designationForm, benefits: e.target.value.split(',').map(b => b.trim()) })}
                          placeholder="Certificate, ID Card, Voting Rights"
                        />
                      </div>
                      <Button type="submit" className="w-full">Create Designation</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>All Designations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {designations.map((designation) => (
                        <div key={designation.id} className="p-4 bg-stone-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-stone-900">{designation.name}</h3>
                              <p className="text-sm text-stone-600 mt-1">Fee: ₹{designation.fee}</p>
                              {designation.benefits?.length > 0 && (
                                <p className="text-xs text-stone-500 mt-2">
                                  Benefits: {designation.benefits.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Receipts Tab */}
            {activeTab === 'receipts' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Generate Receipt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateReceipt} className="space-y-4">
                      <div>
                        <Label>Receipt Type</Label>
                        <Select
                          value={receiptForm.receipt_type}
                          onValueChange={(value) => setReceiptForm({ ...receiptForm, receipt_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="donation">Donation Receipt</SelectItem>
                            <SelectItem value="membership">Membership Receipt</SelectItem>
                            <SelectItem value="event">Event Receipt</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Recipient Name</Label>
                          <Input
                            value={receiptForm.recipient_name}
                            onChange={(e) => setReceiptForm({ ...receiptForm, recipient_name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Recipient Email</Label>
                          <Input
                            type="email"
                            value={receiptForm.recipient_email}
                            onChange={(e) => setReceiptForm({ ...receiptForm, recipient_email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Amount (₹)</Label>
                        <Input
                          type="number"
                          value={receiptForm.amount}
                          onChange={(e) => setReceiptForm({ ...receiptForm, amount: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={receiptForm.description}
                          onChange={(e) => setReceiptForm({ ...receiptForm, description: e.target.value })}
                          rows={3}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">Generate Receipt</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>All Receipts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {receipts.map((receipt) => (
                        <div key={receipt.id} className="flex justify-between items-center p-4 bg-stone-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-stone-900">{receipt.receipt_number}</p>
                            <p className="text-sm text-stone-600">{receipt.recipient_name}</p>
                            <p className="text-xs text-stone-500">{receipt.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-stone-900">₹{receipt.amount}</p>
                            <p className="text-xs text-stone-500">{new Date(receipt.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Other existing tabs (News, Activities, Campaigns, Events, Certificates, Donations, Enquiries, Beneficiaries) */}
            {/* ... keeping existing implementations ... */}

            {activeTab === 'news' && (
              <Card>
                <CardHeader>
                  <CardTitle>Create News</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateNews} className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Content</Label>
                      <Textarea value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} rows={5} required />
                    </div>
                    <div>
                      <Label>Image URL (Optional)</Label>
                      <Input value={newsForm.image_url} onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })} />
                    </div>
                    <Button type="submit" className="w-full">Publish News</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'activities' && (
              <Card>
                <CardHeader>
                  <CardTitle>Post Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateActivity} className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input value={activityForm.title} onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={activityForm.description} onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })} rows={4} required />
                    </div>
                    <Button type="submit" className="w-full">Post Activity</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'campaigns' && (
              <Card>
                <CardHeader>
                  <CardTitle>Create Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCampaign} className="space-y-4">
                    <div>
                      <Label>Campaign Title</Label>
                      <Input value={campaignForm.title} onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={campaignForm.description} onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })} rows={4} required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Goal Amount (₹)</Label>
                        <Input type="number" value={campaignForm.goal_amount} onChange={(e) => setCampaignForm({ ...campaignForm, goal_amount: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input type="date" value={campaignForm.start_date} onChange={(e) => setCampaignForm({ ...campaignForm, start_date: e.target.value })} required />
                      </div>
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input type="date" value={campaignForm.end_date} onChange={(e) => setCampaignForm({ ...campaignForm, end_date: e.target.value })} required />
                    </div>
                    <Button type="submit" className="w-full">Create Campaign</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'events' && (
              <Card>
                <CardHeader>
                  <CardTitle>Create Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div>
                      <Label>Event Title</Label>
                      <Input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} rows={4} required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Event Date</Label>
                        <Input type="datetime-local" value={eventForm.event_date} onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} required />
                      </div>
                    </div>
                    <div>
                      <Label>Registration Fee (₹)</Label>
                      <Input type="number" value={eventForm.registration_fee} onChange={(e) => setEventForm({ ...eventForm, registration_fee: e.target.value, is_paid: parseFloat(e.target.value) > 0 })} />
                    </div>
                    <Button type="submit" className="w-full">Create Event</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'certificates' && (
              <Card>
                <CardHeader>
                  <CardTitle>Generate Certificate</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerateCertificate} className="space-y-4">
                    <div>
                      <Label>Certificate Type</Label>
                      <Select value={certificateForm.certificate_type} onValueChange={(value) => setCertificateForm({ ...certificateForm, certificate_type: value })}>
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
                      <Input value={certificateForm.recipient_name} onChange={(e) => setCertificateForm({ ...certificateForm, recipient_name: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Recipient Email</Label>
                      <Input type="email" value={certificateForm.recipient_email} onChange={(e) => setCertificateForm({ ...certificateForm, recipient_email: e.target.value })} required />
                    </div>
                    <Button type="submit" className="w-full">Generate & Send Certificate</Button>
                  </form>
                </CardContent>
              </Card>
            )}

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
                          <span className={`px-3 py-1 rounded-full text-xs ${enquiry.status === 'replied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
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

            {activeTab === 'reports' && (
              <Card>
                <CardHeader>
                  <CardTitle>Reports & Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-stone-600 mb-4">Comprehensive reporting dashboard</p>
                    <p className="text-sm text-stone-500">Download PDF reports for all modules</p>
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
