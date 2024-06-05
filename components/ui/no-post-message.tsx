export default function NoPostMessage() {
  return (
    <div className="flex h-[400px] w-[550px] flex-col items-center justify-center space-y-4">
      <IconNoPosts className=" text-gray-400" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
        No More Posts Available
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Check back later for updates.
      </p>
    </div>
  );
}

function IconNoPosts(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}
