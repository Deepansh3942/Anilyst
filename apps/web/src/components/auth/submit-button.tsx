type SubmitButtonProps = {
  children: React.ReactNode;
  pending?: boolean;
};

export function SubmitButton({ children, pending = false }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold tracking-wide text-[#042f2e] transition-[transform,opacity,filter] hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
      style={{ borderRadius: "0.7rem" }}
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}
