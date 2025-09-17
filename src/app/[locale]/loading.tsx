export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">
        <div className="h-8 w-8 bg-primary rounded-full"></div>
      </div>
    </div>
  );
}