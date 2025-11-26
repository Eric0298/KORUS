export function GradientCard({ children }) {
  return (
    <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-sky-400 to-orange-400 shadow-xl">
      <div className="bg-korus-card/95 rounded-2xl p-5 space-y-4">
        {children}
      </div>
    </div>
  );
}
