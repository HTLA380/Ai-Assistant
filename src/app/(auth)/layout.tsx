export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="absolute left-10 top-5 text-lg font-extrabold">PicoChat</p>
      {children}
    </div>
  );
}
