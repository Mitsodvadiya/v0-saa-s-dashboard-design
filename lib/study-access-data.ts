// ── Shared study-access data ──────────────────────────────────────────────────
// Single source of truth for studies and user assignments.
// Both users/page.tsx and study-access/page.tsx import from here so
// the two pages always show consistent data.

export interface Study {
    id: string
    name: string
    shortName: string
    sponsor: string
    phase: string
    status: "Active" | "Completed" | "On Hold" | "Recruiting"
    color: string            // Tailwind bg class pair e.g. "bg-primary/10 text-primary"
}

export const STUDIES: Study[] = [
    {
        id: "STU-001",
        name: "BEACON-2024 Oncology Phase III",
        shortName: "BEACON-2024",
        sponsor: "Pfizer",
        phase: "Phase III",
        status: "Active",
        color: "bg-primary/10 text-primary",
    },
    {
        id: "STU-002",
        name: "AURORA Cardiovascular Phase II",
        shortName: "AURORA-Phase2",
        sponsor: "Novartis",
        phase: "Phase II",
        status: "Active",
        color: "bg-success/10 text-success",
    },
    {
        id: "STU-003",
        name: "NOVA Neurology Trial",
        shortName: "NOVA-Trial",
        sponsor: "AstraZeneca",
        phase: "Phase II",
        status: "Recruiting",
        color: "bg-warning/10 text-warning",
    },
    {
        id: "STU-004",
        name: "HEART-2024 Cardiovascular Study",
        shortName: "HEART-2024",
        sponsor: "Pfizer",
        phase: "Phase I",
        status: "Recruiting",
        color: "bg-destructive/10 text-destructive",
    },
    {
        id: "STU-005",
        name: "VERTEX Diabetes Trial Phase III",
        shortName: "VERTEX-DM",
        sponsor: "Roche",
        phase: "Phase III",
        status: "Active",
        color: "bg-muted text-muted-foreground",
    },
    {
        id: "STU-006",
        name: "PRISM Vaccine Research Study",
        shortName: "PRISM-Vax",
        sponsor: "Johnson & Johnson",
        phase: "Phase II",
        status: "On Hold",
        color: "bg-muted text-muted-foreground",
    },
]

// User ID → array of Study IDs they can access
// Admin (USR-001) = all studies (handled as special case in UI)
export const USER_STUDY_ASSIGNMENTS: Record<string, string[]> = {
    "USR-001": ["STU-001", "STU-002", "STU-003", "STU-004", "STU-005", "STU-006"], // Admin – all
    "USR-002": ["STU-001", "STU-004"],          // Dr. Wilson – Supervisor, Pfizer studies
    "USR-003": ["STU-001", "STU-002", "STU-003"], // Emily – Coordinator
    "USR-004": ["STU-002", "STU-004"],           // Dr. Park – Cardiology
    "USR-005": ["STU-001"],                       // Lisa – Coordinator (inactive, BEACON only)
    "USR-006": ["STU-001", "STU-004"],            // Robert Martinez – CRA, Pfizer
    "USR-007": ["STU-003"],                       // Dr. Nancy White – Neurology/NOVA
    "USR-008": ["STU-001", "STU-002"],            // Priya Sharma – Coordinator
    "USR-009": ["STU-002"],                       // David Kim – CRA, Novartis/AURORA
    "USR-010": ["STU-001", "STU-005"],            // Angela Foster – Supervisor
}

// Role → study access policy description
export const ROLE_STUDY_POLICY: Record<string, { scope: string; label: string; color: string }> = {
    Admin: { scope: "all", label: "All Studies", color: "bg-destructive/10 text-destructive" },
    Supervisor: { scope: "assigned", label: "Assigned Studies", color: "bg-primary/10 text-primary" },
    Coordinator: { scope: "assigned", label: "Assigned Studies", color: "bg-success/10 text-success" },
    Investigator: { scope: "assigned", label: "View Only — Assigned", color: "bg-warning/10 text-warning" },
    CRA: { scope: "assigned", label: "Sponsor Studies Only", color: "bg-muted text-muted-foreground" },
}
