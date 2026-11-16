function Button({ onClick, children = "+ New Article" }) {
  return (
    <button
      onClick={onClick}
      className="bg-primary px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white rounded-lg cursor-pointer transition hover:bg-secondary font-semibold shadow-sm"
    >
      {children}
    </button>
  );
}

export default Button;
