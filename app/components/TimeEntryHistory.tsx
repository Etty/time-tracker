import { prisma } from "../../lib/prisma";

export default async function TimeEntryHistory() {
  // Fetch all TimeEntries with their projects
  const timeEntries = await prisma.timeEntry.findMany({
    include: {
      project: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  // Group by date (YYYY-MM-DD)
  const groupedByDate = timeEntries.reduce(
    (acc, entry) => {
      const date = entry.startTime.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    },
    {} as Record<string, typeof timeEntries>,
  );

  let grandTotal = 0;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      {Object.entries(groupedByDate).map(([date, entries]) => {
        let dailyTotal = 0;
        entries.forEach((entry) => {
          dailyTotal += parseFloat(entry.hours.toString());
        });
        grandTotal += dailyTotal;

        return (
          <div
            key={date}
            style={{
              marginBottom: "30px",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h2 style={{ color: "#333", marginBottom: "10px" }}>
              Date: {date}
            </h2>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  style={{
                    marginBottom: "5px",
                    padding: "5px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "3px",
                  }}
                >
                  <strong>DateTime:</strong> {entry.startTime.toISOString()},{" "}
                  <strong>Project:</strong> {entry.project.name},{" "}
                  <strong>Hours:</strong> {entry.hours.toString()},{" "}
                  <strong>Description:</strong> {entry.description}
                </li>
              ))}
            </ul>
            <p style={{ fontWeight: "bold", color: "#555" }}>
              Total hours for {date}: {dailyTotal.toFixed(2)}
            </p>
          </div>
        );
      })}
      <h3
        style={{
          color: "#333",
          borderTop: "2px solid #333",
          paddingTop: "10px",
        }}
      >
        Grand total hours: {grandTotal.toFixed(2)}
      </h3>
    </div>
  );
}
