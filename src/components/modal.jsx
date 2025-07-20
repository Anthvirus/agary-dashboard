export default function Modal({ title, children, visible }) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } bg-black bg-opacity-40`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}
