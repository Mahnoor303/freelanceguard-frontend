import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Flag,
  Search,
  Eye,
  Clock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

import { adminApi } from "../../adminApi";
import StatCard from "../../components/ui/StatCard";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewReport, setViewReport] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await adminApi("/reports");
      setReports(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const endpoint =
        status === "approved"
          ? `/reports/${id}/approve`
          : `/reports/${id}/reject`;

      await adminApi(endpoint, {
        method: "PATCH",
      });

      loadReports();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleVerify = async (id) => {
    try {
      await adminApi(`/reports/${id}/verify`, {
        method: "PATCH",
      });

      loadReports();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Delete this report?")) return;

    try {
      await adminApi(`/reports/${id}`, {
        method: "DELETE",
      });

      loadReports();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = reports.filter((r) => {
    const text = `
      ${r.company || ""}
      ${r.platform || ""}
      ${r.reason || ""}
      ${r.userId?.name || ""}
    `.toLowerCase();

    const searchMatch = text.includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "all" || r.status === statusFilter;

    return searchMatch && statusMatch;
  });

  const stats = {
    pending: reports.filter((r) => r.status === "pending").length,
    approved: reports.filter((r) => r.status === "approved").length,
    rejected: reports.filter((r) => r.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-text-secondary">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-heading font-bold text-text-primary">
        Community Reports
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <StatCard
          icon={Clock}
          value={stats.pending}
          label="Pending"
          color="warning"
        />

        <StatCard
          icon={CheckCircle}
          value={stats.approved}
          label="Approved"
          color="success"
        />

        <StatCard
          icon={XCircle}
          value={stats.rejected}
          label="Rejected"
          color="danger"
        />

      </div>

      <div className="flex flex-col sm:flex-row gap-4">

        <div className="relative flex-1">

          <Search
            className="absolute left-3 top-2.5 text-text-secondary"
            size={18}
          />

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card-bg text-text-primary focus:outline-none focus:border-primary"
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-card-bg text-text-primary"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {filtered.map((report) => (

          <div
            key={report._id}
            className="bg-card-bg border border-border rounded-xl p-5 space-y-4 hover:border-primary/30 transition"
          >

            <div className="flex justify-between items-start">

              <div>

                <h3 className="font-semibold text-lg text-text-primary">
                  {report.company || "Unknown Company"}
                </h3>

                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {report.platform}
                </span>

              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  report.status === "pending"
                    ? "bg-warning/10 text-warning"
                    : report.status === "approved"
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger"
                }`}
              >
                {report.status}
              </span>

            </div>

            <p className="text-sm text-text-secondary">
              {report.reason}
            </p>
                        <div className="flex items-center justify-between text-xs text-text-secondary">

              <span>
                {report.userId?.name || "Anonymous"}
              </span>

              <span className="flex items-center gap-1">
                <Flag size={14} />
                {report.upvotes || 0}
              </span>

            </div>

            {report.jobLink && (
              <a
                href={report.jobLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-primary truncate"
              >
                <ExternalLink size={13} />
                {report.jobLink}
              </a>
            )}

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">

              {report.status !== "approved" && (
                <button
                  onClick={() => updateStatus(report._id, "approved")}
                  className="flex items-center justify-center gap-1 py-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition"
                >
                  <CheckCircle size={15} />
                  Approve
                </button>
              )}

              {report.status !== "rejected" && (
                <button
                  onClick={() => updateStatus(report._id, "rejected")}
                  className="flex items-center justify-center gap-1 py-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition"
                >
                  <XCircle size={15} />
                  Reject
                </button>
              )}

              <button
                onClick={() => toggleVerify(report._id)}
                className={`flex items-center justify-center gap-1 py-2 rounded-lg transition ${
                  report.verified
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                <ShieldCheck size={15} />
                {report.verified ? "Verified" : "Verify"}
              </button>

              <button
                onClick={() => setViewReport(report)}
                className="flex items-center justify-center gap-1 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
              >
                <Eye size={15} />
                View
              </button>

              <button
                onClick={() => deleteReport(report._id)}
                className="col-span-2 flex items-center justify-center gap-1 py-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition"
              >
                <Trash2 size={15} />
                Delete Report
              </button>

            </div>

          </div>

        ))}

      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-text-secondary">
          No reports found.
        </div>
      )}

      {viewReport && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

          <div className="bg-card-bg border border-border rounded-2xl p-6 w-full max-w-lg relative">

            <button
              onClick={() => setViewReport(null)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <XCircle size={20} />
            </button>

            <h2 className="text-xl font-bold mb-6">
              Report Details
            </h2>

            <div className="space-y-3 text-sm">

              <p>
                <strong>Company:</strong>{" "}
                {viewReport.company || "N/A"}
              </p>

              <p>
                <strong>Platform:</strong>{" "}
                {viewReport.platform}
              </p>

              <p>
                <strong>Reason:</strong>{" "}
                {viewReport.reason}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {viewReport.status}
              </p>

              <p>
                <strong>Verified:</strong>{" "}
                {viewReport.verified ? "Yes" : "No"}
              </p>

              <p>
                <strong>Reported By:</strong>{" "}
                {viewReport.userId?.name || "Anonymous"}
              </p>

              <p>
                <strong>Upvotes:</strong>{" "}
                {viewReport.upvotes || 0}
              </p>

              {viewReport.jobLink && (
                <p>
                  <strong>Job Link:</strong>{" "}
                  <a
                    href={viewReport.jobLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary break-all"
                  >
                    {viewReport.jobLink}
                  </a>
                </p>
              )}

              {viewReport.evidence && (
                <div>

                  <strong>Evidence</strong>

                  <div className="mt-2">

                    <img
                      src={viewReport.evidence}
                      alt="Evidence"
                      className="rounded-lg border border-border max-h-72 w-full object-cover"
                    />

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}