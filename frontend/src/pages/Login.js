import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success("Successfully logged in!");

      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "member") {
        navigate("/member-dashboard");
      } else {
        toast.info("Your membership is pending approval");
        navigate("/pending-approval");
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Login || Emergent";
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4"
      data-testid="login-page"
    >
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200">
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-3xl text-stone-900 mb-2">
              लॉगिन
            </h2>
            <p className="text-stone-600">अपने खाते में प्रवेश करें</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-stone-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
                data-testid="login-email-input"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-stone-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
                data-testid="login-password-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90"
              data-testid="login-submit-button"
            >
              {loading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-stone-600">
              खाता नहीं है?{" "}
              <Link
                to="/register"
                className="text-primary font-semibold hover:underline"
                data-testid="register-link"
              >
                रजिस्टर करें
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
