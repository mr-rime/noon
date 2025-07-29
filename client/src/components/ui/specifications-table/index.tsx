export function SpecificationsTable({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-full">
      <table className="w-full table-fixed">
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
