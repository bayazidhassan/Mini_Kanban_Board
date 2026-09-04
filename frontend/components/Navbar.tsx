const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <h1 className="text-lg font-semibold">Mini Kanban Board</h1>

        <button className="text-sm">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
