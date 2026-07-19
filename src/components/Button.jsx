function Button({ onClick, children = "+ New Article" }) {
  return (
    <button
      onClick={onClick}
      className="bg-indigo-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white rounded-lg cursor-pointer transition hover:bg-indigo-700 font-semibold shadow-sm"
    >
      {children}
    </button>
  );
}

export default Button;
