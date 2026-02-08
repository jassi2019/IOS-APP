export default function DeletionRequested() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900">
            Deletion Request Received
          </h2>

          <div className="space-y-4 text-gray-600">
            <p>
              We have received your request to delete your account. Your account
              is now scheduled for deletion.
            </p>

            <div className="bg-blue-50 p-4 rounded-md text-left">
              <h3 className="text-blue-800 font-medium mb-2">
                Important Information:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-blue-700">
                <li>Your account will be permanently deleted in 60 days</li>
                <li>
                  If you log in during this period, the deletion request will be
                  automatically cancelled
                </li>
                <li>
                  After cancellation, your account will return to active status
                </li>
              </ul>
            </div>

            <p className="mt-4">
              Changed your mind? You can log in anytime within the next 60 days
              to cancel this request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
