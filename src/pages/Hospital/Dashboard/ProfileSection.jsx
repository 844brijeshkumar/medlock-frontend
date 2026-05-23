import React, { useState } from "react";
import { Edit, Building2 } from "lucide-react";
import { hospitalData, doctorsData, reportsData } from "../../../utils";

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [hospital, setHospital] = useState(hospitalData);
  const [hospitalProfile, setHospitalProfile] = useState(hospital);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateHospital(hospitalProfile);
    setIsEditing(false);
  };
  const onUpdateHospital = (updatedHospital) => {
    setHospital(updatedHospital);
  };
  return (
    <div className="space-y-8 p-10 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[var(--color-text)]">
          Hospital Profile
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-xl font-medium flex items-center hover:bg-[var(--color-hover)] transition-colors"
        >
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Card Container */}
      <div className="bg-[var(--color-card-bg)] rounded-3xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] p-6 border border-[var(--color-border)]">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-card-text)]">
                  Hospital Name
                </label>
                <input
                  type="text"
                  value={hospitalProfile.name}
                  onChange={(e) =>
                    setHospitalProfile({
                      ...hospitalProfile,
                      name: e.target.value,
                    })
                  }
                  required
                  className="mt-1 block w-full rounded-xl border border-[var(--color-border)] p-3 bg-[var(--color-card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-card-text)]">
                  Location
                </label>
                <input
                  type="text"
                  value={hospitalProfile.location}
                  onChange={(e) =>
                    setHospitalProfile({
                      ...hospitalProfile,
                      location: e.target.value,
                    })
                  }
                  required
                  className="mt-1 block w-full rounded-xl border border-[var(--color-border)] p-3 bg-[var(--color-card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-card-text)]">
                  State
                </label>
                <input
                  type="text"
                  value={hospitalProfile.state}
                  onChange={(e) =>
                    setHospitalProfile({
                      ...hospitalProfile,
                      state: e.target.value,
                    })
                  }
                  required
                  className="mt-1 block w-full rounded-xl border border-[var(--color-border)] p-3 bg-[var(--color-card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-card-text)]">
                  Country
                </label>
                <input
                  type="text"
                  value={hospitalProfile.country}
                  onChange={(e) =>
                    setHospitalProfile({
                      ...hospitalProfile,
                      country: e.target.value,
                    })
                  }
                  required
                  className="mt-1 block w-full rounded-xl border border-[var(--color-border)] p-3 bg-[var(--color-card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-card-text)]">
                  NPI ID
                </label>
                <input
                  type="text"
                  value={hospitalProfile.npi_id}
                  onChange={(e) =>
                    setHospitalProfile({
                      ...hospitalProfile,
                      npi_id: e.target.value,
                    })
                  }
                  required
                  className="mt-1 block w-full rounded-xl border border-[var(--color-border)] p-3 bg-[var(--color-card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-card-text)]">
                Organization Issued Name
              </label>
              <input
                type="text"
                value={hospitalProfile.org_issued_name}
                onChange={(e) =>
                  setHospitalProfile({
                    ...hospitalProfile,
                    org_issued_name: e.target.value,
                  })
                }
                required
                className="mt-1 block w-full rounded-xl border border-[var(--color-border)] p-3 bg-[var(--color-card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-hover)] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-[var(--color-card-text)]">
            <p>
              <strong>Name:</strong> {hospitalProfile.name}
            </p>
            <p>
              <strong>Location:</strong> {hospitalProfile.location}
            </p>
            <p>
              <strong>State:</strong> {hospitalProfile.state}
            </p>
            <p>
              <strong>Country:</strong> {hospitalProfile.country}
            </p>
            <p>
              <strong>NPI ID:</strong> {hospitalProfile.npi_id}
            </p>
            <p>
              <strong>Organization Issued Name:</strong>{" "}
              {hospitalProfile.org_issued_name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
