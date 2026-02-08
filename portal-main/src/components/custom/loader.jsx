"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative">
        {/* Spinner */}
        <div className="h-16 w-16 animate-spin">
          <div className="absolute h-full w-full rounded-full border-4 border-solid border-primary border-t-transparent" />
        </div>

        {/* Inner spinning circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin-reverse">
            <div className="h-full w-full rounded-full border-4 border-solid border-primary/30 border-b-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
