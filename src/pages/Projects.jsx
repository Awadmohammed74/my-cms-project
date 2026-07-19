function Projects() {
  return (
    <div className="px-4 py-8 flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-slate-900">Projects</h1>
      <p className="text-gray-600">
        Manage and organize your content projects.
      </p>

      <div className="flex items-center justify-center min-h-[40vh] bg-slate-100 rounded-xl border-2 border-dashed border-slate-300">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-500">🚧 Under Construction</p>
          <p className="text-sm text-slate-400 mt-1">This section is being built.</p>
        </div>
      </div>
    </div>
  );
}

export default Projects;
