import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md text-center">
        <CheckCircle className="mx-auto text-green-600" size={64} />
        <h1 className="text-3xl font-bold mt-4 text-stone-900">
          Thank You! 🙏
        </h1>
        <p className="text-stone-600 mt-3">
          Your donation was successful. We truly appreciate your support 💖
        </p>

        <Link
          to="/"
          className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
