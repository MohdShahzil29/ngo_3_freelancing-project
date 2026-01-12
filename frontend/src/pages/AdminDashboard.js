import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Heart, FileText, TrendingUp, Calendar, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [members, setMembers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <div className="min-h-screen bg-stone-50 py-12" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-stone-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-stone-600">Welcome back, {user?.name}</p>
        </div>

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

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList>
            <TabsTrigger value="members" data-testid="members-tab">Members</TabsTrigger>
            <TabsTrigger value="donations" data-testid="donations-tab">Donations</TabsTrigger>
            <TabsTrigger value="enquiries" data-testid="enquiries-tab">Enquiries</TabsTrigger>
            <TabsTrigger value="beneficiaries" data-testid="beneficiaries-tab">Beneficiaries</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
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
                      <div
                        key={member.id}
                        className="flex justify-between items-center p-4 bg-stone-50 rounded-lg"
                        data-testid={`member-item-${index}`}
                      >
                        <div>
                          <p className="font-semibold text-stone-900">{member.member_number}</p>
                          <p className="text-sm text-stone-600">{member.designation}</p>
                          <p className="text-sm text-stone-500">Fee: ₹{member.designation_fee}</p>
                        </div>
                        <div className="flex space-x-2">
                          {member.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateMemberStatus(member.id, 'approved')}
                              data-testid={`approve-member-${index}`}
                            >
                              Approve
                            </Button>
                          )}
                          {member.status === 'approved' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUpdateMemberStatus(member.id, 'blocked')}
                              data-testid={`block-member-${index}`}
                            >
                              Block
                            </Button>
                          )}
                          {member.status === 'blocked' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateMemberStatus(member.id, 'approved')}
                              data-testid={`unblock-member-${index}`}
                            >
                              Unblock
                            </Button>
                          )}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              member.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : member.status === 'blocked'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {member.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
              </CardHeader>
              <CardContent>
                {donations.length === 0 ? (
                  <p className="text-stone-600 text-center py-8">No donations yet</p>
                ) : (
                  <div className="space-y-4">
                    {donations.slice(0, 10).map((donation, index) => (
                      <div
                        key={donation.id}
                        className="flex justify-between items-center p-4 bg-stone-50 rounded-lg"
                        data-testid={`donation-item-${index}`}
                      >
                        <div>
                          <p className="font-semibold text-stone-900">{donation.donor_name}</p>
                          <p className="text-sm text-stone-600">{donation.donor_email}</p>
                          <p className="text-sm text-stone-500">Receipt: {donation.receipt_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-stone-900">₹{donation.amount}</p>
                          <p className="text-sm text-stone-600">
                            {new Date(donation.created_at).toLocaleDateString()}
                          </p>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              donation.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {donation.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enquiries">
            <Card>
              <CardHeader>
                <CardTitle>Enquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {enquiries.length === 0 ? (
                  <p className="text-stone-600 text-center py-8">No enquiries yet</p>
                ) : (
                  <div className="space-y-4">
                    {enquiries.map((enquiry, index) => (
                      <div
                        key={enquiry.id}
                        className="p-4 bg-stone-50 rounded-lg"
                        data-testid={`enquiry-item-${index}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-stone-900">{enquiry.name}</p>
                            <p className="text-sm text-stone-600">{enquiry.email}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              enquiry.status === 'replied'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {enquiry.status}
                          </span>
                        </div>
                        <p className="text-sm text-stone-600">{enquiry.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="beneficiaries">
            <Card>
              <CardHeader>
                <CardTitle>Beneficiaries</CardTitle>
              </CardHeader>
              <CardContent>
                {beneficiaries.length === 0 ? (
                  <p className="text-stone-600 text-center py-8">No beneficiaries yet</p>
                ) : (
                  <div className="space-y-4">
                    {beneficiaries.map((beneficiary, index) => (
                      <div
                        key={beneficiary.id}
                        className="p-4 bg-stone-50 rounded-lg"
                        data-testid={`beneficiary-item-${index}`}
                      >
                        <p className="font-semibold text-stone-900">{beneficiary.name}</p>
                        <p className="text-sm text-stone-600">Category: {beneficiary.category}</p>
                        <p className="text-sm text-stone-600">Address: {beneficiary.address}</p>
                        {beneficiary.description && (
                          <p className="text-sm text-stone-500 mt-2">{beneficiary.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;