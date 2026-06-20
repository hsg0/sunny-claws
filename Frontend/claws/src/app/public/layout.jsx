export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col flex-1 w-full">
      {children}
    </div>
  );
}
