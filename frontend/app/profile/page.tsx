"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  Camera,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Save,
  LogOut,
  AlertCircle,
  FileText
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  getAuthUser,
  updateUserProfile,
  authLogout,
  type AuthUser
} from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user data
  useEffect(() => {
    const current = getAuthUser();
    if (current) loadUserData(current);
    setLoading(false);

    const handleUserChange = () => {
      const u = getAuthUser();
      if (u) loadUserData(u);
    };

    window.addEventListener("darkspot_user_change", handleUserChange);
    return () => window.removeEventListener("darkspot_user_change", handleUserChange);
  }, []);

  const loadUserData = (u: AuthUser) => {
    setUser(u);
    setFullName(u.full_name || u.user_metadata?.full_name || "");
    setEmail(u.email || "");
    
    // Extract phone
    const fullPhone = u.phone || u.user_metadata?.phone || "";
    if (fullPhone.startsWith("+")) {
      const parts = fullPhone.split(" ");
      setPhoneCountryCode(parts[0] || "");
      setPhoneNumber(parts.slice(1).join(" "));
    } else {
      setPhoneNumber(fullPhone);
    }

    setPhoneVerified(Boolean((u as any).phone_confirmed_at));
    setOrganization(u.organization || u.user_metadata?.organization || "");
    setRole(u.role || u.user_metadata?.role || "");
    setBio(u.bio || "");
    setAvatarUrl(u.avatar_url || u.user_metadata?.avatar_url || "");
    setGoogleConnected(
      u.google_connected ??
        u.user_metadata?.google_connected ??
        Boolean((u as any).app_metadata?.providers?.includes("google"))
    );
    setGoogleEmail(u.google_email || u.user_metadata?.google_email || "");
  };

  // Image Upload handler (Real & Working)
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 4MB. Please select a smaller photo.");
      return;
    }

    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      // Auto save photo
      const result = await updateUserProfile({ avatar_url: base64 });
      if (result.success) {
        setAvatarUrl(base64);
        triggerSaveNotice("Profile image updated.");
      } else {
        setErrorMsg(result.error || "Could not update profile image.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    const result = await updateUserProfile({ avatar_url: "" });
    if (result.success) {
      setAvatarUrl("");
      triggerSaveNotice("Profile image removed.");
    } else {
      setErrorMsg(result.error || "Could not remove profile image.");
    }
  };

  // Profile Save handler
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    const fullPhone = phoneNumber.trim() ? `${phoneCountryCode} ${phoneNumber.trim()}`.trim() : undefined;
    
    const res = await updateUserProfile({
      full_name: fullName,
      phone: fullPhone,
      organization,
      avatar_url: avatarUrl,
    });

    if (res.success) {
      triggerSaveNotice("Profile details saved and synchronized successfully.");
    } else {
      setErrorMsg(res.error || "Failed to update profile. Please try again.");
    }
  };

  const triggerSaveNotice = (msg?: string) => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  if (loading) {
    return <div className="mx-auto max-w-4xl px-5 py-20 text-center text-sm text-muted">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="text-xl font-semibold">Sign in to view your profile</h1>
        <Link href="/login" className="btn-primary mt-5">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        eyebrow="USER IDENTITY & CREDENTIALS"
        title="Profile & Account Settings"
        sub="Manage your verified citizen auditor identity, profile picture, phone verification, and connected Google credentials."
      />

      <div className="mx-auto max-w-4xl space-y-8 px-5 py-8">
        {/* Success / Error Notification (Pure White & Subtle Monochrome) */}
        {saveSuccess && (
          <div className="rounded-xl border border-white/20 bg-white/10 p-4 text-xs font-mono text-white flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-white" />
              Profile and authentication parameters saved & synced.
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted">Real-time sync</span>
          </div>
        )}

        {errorMsg && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-mono text-red-300 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Top Profile Hero Card */}
        <div className="card relative overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar Section with Real Upload */}
            <div className="relative group shrink-0 self-start sm:self-auto">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-white/20 bg-neutral-900 overflow-hidden shadow-xl flex items-center justify-center">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-3xl text-white bg-white/10">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Hover overlay with camera */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                  title="Change avatar photo"
                >
                  <Camera size={22} />
                  <span className="text-[10px] font-mono mt-1">Upload</span>
                </button>
              </div>

              {/* Verified badge */}
              <span
                className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black shadow-md"
                title="Verified Auditor Badge"
              >
                <ShieldCheck size={14} />
              </span>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            {/* Profile Overview Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {fullName}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs font-mono text-white">
                  <CheckCircle2 size={12} className="text-white" /> {role}
                </span>
              </div>

              <p className="mt-1 text-xs text-muted flex items-center gap-2">
                <span className="text-white">{email}</span>
                <span>•</span>
                <span className="text-muted">{organization}</span>
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white hover:border-white/30 hover:bg-white/10 transition"
                >
                  <Camera size={13} /> Upload New Photo
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition"
                    title="Remove custom avatar"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                )}

                <Link
                  href="/support"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-muted hover:text-white hover:border-white/30 transition"
                >
                  Helpdesk <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Personal Details & Phone Verification */}
        <form onSubmit={handleSaveProfile} className="space-y-8">
          <div className="card p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <User size={18} className="text-white" />
                <h3 className="text-base font-semibold text-white">Personal Information & Contacts</h3>
              </div>
              <span className="text-xs text-muted font-mono">Real-time editable</span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input text-sm text-white"
                  placeholder="e.g. Arpit Sharma"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="input text-sm text-white pr-20"
                    placeholder="name@example.com"
                    required
                  />
                  <span className="absolute right-2.5 top-2.5 rounded bg-white/10 border border-white/15 px-1.5 py-0.5 text-[10px] font-mono text-white">
                    Primary
                  </span>
                </div>
              </div>

              {/* Phone Number Module */}
              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted flex items-center gap-1.5">
                    <Phone size={13} className="text-white" /> Mobile / Phone Number
                  </label>
                  {phoneVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-white">
                      <CheckCircle2 size={12} className="text-white" /> Number Verified
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-muted">
                      Unverified
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex gap-2 flex-1">
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      className="input w-28 text-sm font-mono shrink-0 text-white"
                    >
                      <option value="+91" className="bg-neutral-900 text-white">🇮🇳 +91 (IN)</option>
                      <option value="+1" className="bg-neutral-900 text-white">🇺🇸 +1 (US)</option>
                      <option value="+44" className="bg-neutral-900 text-white">🇬🇧 +44 (UK)</option>
                      <option value="+61" className="bg-neutral-900 text-white">🇦🇺 +61 (AU)</option>
                      <option value="+971" className="bg-neutral-900 text-white">🇦🇪 +971 (UAE)</option>
                    </select>

                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setPhoneVerified(false);
                      }}
                      className="input flex-1 text-sm font-mono text-white"
                      placeholder="98765 43210"
                    />
                  </div>

                  <button
                    type="button"
                    disabled
                    className="btn-ghost text-xs px-4 py-2 shrink-0 border border-white/20 text-white hover:bg-white/10"
                  >
                    Phone verification unavailable
                  </button>
                </div>
                <p className="text-[11px] text-muted">
                  A phone number can be saved, but OTP verification is not configured for this deployment.
                </p>
              </div>

              {/* Role / Designation */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted">Role / Designation</label>
                <input
                  type="text"
                  value={role}
                  readOnly
                  className="input text-sm text-white"
                  placeholder="e.g. Verified Citizen Auditor / Field Officer"
                />
              </div>

              {/* Organization */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted">Affiliated Organization / Institution</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="input text-sm text-white"
                  placeholder="e.g. State Research Council / University"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-muted">Auditor Profile Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  readOnly
                  className="input text-sm py-2 text-white"
                  placeholder="Describe your research focus or interest in public data discrepancies..."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Google Sign-up & Linked Credentials */}
          <div className="card p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                {/* Official Google 'G' icon */}
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="text-base font-semibold text-white">Google Account & Single Sign-On</h3>
              </div>
              <span className="text-xs text-muted font-mono">OAuth 2.0 Integration</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Google Identity Service</span>
                  {googleConnected ? (
                    <span className="rounded-full bg-white/10 border border-white/20 px-2 py-0.5 text-[10px] font-mono text-white flex items-center gap-1">
                      <CheckCircle2 size={10} className="text-white" /> Connected
                    </span>
                  ) : (
                    <span className="rounded-full bg-neutral-800 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-muted">
                      Not Linked
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted">
                  {googleConnected
                    ? `Linked to Google account: ${googleEmail || email}.`
                    : "Google account linking is not configured for this deployment."}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {googleConnected ? (
                  <button
                    type="button"
                    disabled
                    className="btn-ghost text-xs border border-white/20 text-muted hover:text-white hover:bg-white/5"
                  >
                    Disconnect Google
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white px-3.5 py-2 text-xs font-semibold text-black transition hover:bg-neutral-200 shadow-sm"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Audit Activity & Stats */}
          <div className="card p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-white" />
                <h3 className="text-base font-semibold text-white">Auditor Statistics & Badges</h3>
              </div>
              <span className="text-xs text-muted font-mono">Live Counter</span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <div className="text-2xl font-bold font-mono text-white">—</div>
                <div className="text-[11px] text-muted mt-1">Analyses Run</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <div className="text-2xl font-bold font-mono text-white">—</div>
                <div className="text-[11px] text-muted mt-1">Dark Spots Flagged</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <div className="text-2xl font-bold font-mono text-white">—</div>
                <div className="text-[11px] text-muted mt-1">Quote Accuracy</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <div className="text-2xl font-bold font-mono text-white">—</div>
                <div className="text-[11px] text-muted mt-1">Clearance Level</div>
              </div>
            </div>
          </div>

          {/* Save & Reset Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-line pt-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => authLogout()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3.5 py-2 text-xs text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut size={14} /> Sign out of this session
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  loadUserData(user);
                  setErrorMsg("");
                  setSaveSuccess(false);
                }}
                className="btn-ghost text-xs px-4 py-2.5 w-full sm:w-auto text-white"
              >
                Discard Changes
              </button>

              <button
                type="submit"
                className="btn-primary text-xs px-6 py-2.5 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Save size={14} /> Save Profile Changes
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}
