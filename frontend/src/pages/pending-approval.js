const PendingApproval = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold mb-2">Approval Pending ⏳</h2>
        <p className="text-gray-600">
          Your membership application is under review. You will get access after
          admin approval.
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;
