import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (formData.password !== formData.confirmPassword) {
  //     toast.error("Passwords do not match");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     await register({
  //       name: formData.name,
  //       email: formData.email,
  //       phone: formData.phone,
  //       password: formData.password,
  //       role: "member",
  //     });
  //     toast.success("Registration successful!");
  //     // navigate("/member-dashboard");
  //     if (user.role === "admin") {
  //       navigate("/admin-dashboard");
  //     } else if (user.role === "member") {
  //       navigate("/member-dashboard");
  //     } else {
  //       toast.info("Your membership is pending approval");
  //       navigate("/pending-approval");
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.detail || "Registration failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        // ❌ role mat bhej
      });

      toast.success("Registration successful!");
      navigate("/pending-approval"); // ✅ direct
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Register || Emergent";
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4"
      data-testid="register-page"
    >
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200">
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-3xl text-stone-900 mb-2">
              रजिस्टर
            </h2>
            <p className="text-stone-600">नया खाता बनाएं</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-stone-700">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2"
                data-testid="register-name-input"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-stone-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2"
                data-testid="register-email-input"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-stone-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-2"
                data-testid="register-phone-input"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-stone-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-2"
                data-testid="register-password-input"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-stone-700">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-2"
                data-testid="register-confirm-password-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90"
              data-testid="register-submit-button"
            >
              {loading ? "रजिस्टर हो रहा है..." : "रजिस्टर करें"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-stone-600">
              पहले से खाता है?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
                data-testid="login-link"
              >
                लॉगिन करें
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
