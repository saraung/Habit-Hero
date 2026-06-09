const Loader = ({ fullPage = false, size = 'md', message = '' }) => {
  const sizeMap = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizeMap[size] || sizeMap.md} rounded-full border-indigo-200 border-t-indigo-600 animate-spin`}
      />
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">{spinner}</div>
  );
};

export default Loader;
