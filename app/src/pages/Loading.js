const Loading = () => {
  return (
    // Container div that centers its content both vertically and horizontally
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      {/* Text element displaying the loading message */}
      <div className="text-yellow-600 text-2xl">Loading...</div>
    </div>
  );
};

export default Loading;
