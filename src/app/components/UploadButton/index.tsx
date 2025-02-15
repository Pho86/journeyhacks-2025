import Link from "next/link";

export default function UploadButton() {
  return (
    <div className="max-w-screen-lg fixed h-full flex justify-end w-full items-end mx-auto pointer-events-none">
      <Link 
        href="/upload"
        className="flex items-center mb-8 mr-6 bg-zinc-800 hover:bg-zinc-600 rounded-full shadow-lg transition-colors pointer-events-auto"
      >
        <span className="text-white text-lg font-medium pl-6">Add Recipe</span>
        <div className="w-14 h-14 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </Link>
    </div>
  );
}