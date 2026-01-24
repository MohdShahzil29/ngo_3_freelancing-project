import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, FileText, Award, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MemberDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "member") {
      navigate("/pending-approval");
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [donationsRes, certificatesRes] = await Promise.all([
        axios.get(`${API}/donations`),
        axios.get(`${API}/certificates`),
      ]);
      setDonations(donationsRes.data);
      setCertificates(certificatesRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Member Dashboard || Emergent";
  }, []);

  const totalDonated = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div
      className="min-h-screen bg-stone-50 py-12"
      data-testid="member-dashboard"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-stone-900 mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-stone-600">Your Member Dashboard</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="total-donations-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-stone-600">
                Total Donations
              </CardTitle>
              <Heart className="text-primary" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900">
                ₹{totalDonated.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="donations-count-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-stone-600">
                Donations Count
              </CardTitle>
              <FileText className="text-secondary" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900">
                {donations.length}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="certificates-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-stone-600">
                Certificates
              </CardTitle>
              <Award className="text-primary" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900">
                {certificates.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="donations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="donations" data-testid="donations-tab">
              Donations
            </TabsTrigger>
            <TabsTrigger value="certificates" data-testid="certificates-tab">
              Certificates
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="profile-tab">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>My Donations</CardTitle>
              </CardHeader>
              <CardContent>
                {donations.length === 0 ? (
                  <p className="text-stone-600 text-center py-8">
                    No donations yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {donations.map((donation, index) => (
                      <div
                        key={donation.id}
                        className="flex justify-between items-center p-4 bg-stone-50 rounded-lg"
                        data-testid={`donation-item-${index}`}
                      >
                        <div>
                          <p className="font-semibold text-stone-900">
                            ₹{donation.amount}
                          </p>
                          <p className="text-sm text-stone-600">
                            {new Date(donation.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-stone-500">
                            Receipt: {donation.receipt_number}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              donation.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
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

          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>My Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                {certificates.length === 0 ? (
                  <p className="text-stone-600 text-center py-8">
                    No certificates yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {certificates.map((cert, index) => (
                      <div
                        key={cert.id}
                        className="flex justify-between items-center p-4 bg-stone-50 rounded-lg"
                        data-testid={`certificate-item-${index}`}
                      >
                        <div>
                          <p className="font-semibold text-stone-900">
                            {cert.certificate_type}
                          </p>
                          <p className="text-sm text-stone-600">
                            Issued:{" "}
                            {new Date(cert.issue_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-stone-500">
                            Cert No: {cert.certificate_number}
                          </p>
                        </div>
                        <Award className="text-primary" size={24} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-stone-600">Name</p>
                    <p className="font-semibold text-stone-900">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-600">Email</p>
                    <p className="font-semibold text-stone-900">
                      {user?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-600">Role</p>
                    <p className="font-semibold text-stone-900 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberDashboard;
