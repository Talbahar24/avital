import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { LeadStatus } from "@/components/LeadStatus";

export default async function AdminWorkshopsPage() {
  const leads = await prisma.workshopLead.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <section>
      <h1>לידים לסדנאות</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>תאריך</th>
            <th>שם</th>
            <th>טלפון</th>
            <th>אירוע</th>
            <th>פרטים</th>
            <th>סטטוס</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{formatDate(lead.createdAt)}</td>
              <td>{lead.name}</td>
              <td>{lead.phone}</td>
              <td>{lead.eventType}</td>
              <td>{lead.details}</td>
              <td>
                <LeadStatus id={lead.id} status={lead.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
