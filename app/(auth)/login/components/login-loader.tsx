const LoginLoader = () => {
  return (
    <div className="w-full h-full fixed bg-white top-0 left-0 bg-opacity-50">
      <div className="w-[200px] flex h-72 absolute top-1/2 mx-auto left-0 right-0">
        <span className="w-10 h-10 mx-3 rounded-full animate-bounce delay-100 bg-[#f19ab3] opacity-100" />
        <span className="w-10 h-10 mx-3 rounded-full animate-bounce delay-300 bg-[#f19ab3] opacity-100" />
        <span className="w-10 h-10 mx-3 rounded-full animate-bounce delay-500 bg-[#f19ab3] opacity-100" />
      </div>
    </div>
  );
};

export default LoginLoader;
