const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center  ">
      <div className="bg-card shadow-theme w-full max-w-sm rounded-2xl p-6 text-center border border-border bg-white text-black ">
        <div className="text-primary mb-4 flex justify-center">
          <i className="fa-solid fa-right-from-bracket fa-3x"></i>
        </div>

        <h3 className="text-xl font-bold text-main mb-2 ">Confirm Logout</h3>
        <p className="mb-6 ">
          Are you sure you want to log out? Your current session will be ended.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-border text-main hover:bg-gray-100 transition-all font-medium"
          >
            No, Stay
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-primary  text-white hover:bg-secondary transition-all font-medium"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
